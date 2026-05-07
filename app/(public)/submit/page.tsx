'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Card from '@/components/ui/Card';
import {
  regionLabels,
  waterBasinValues,
  waterProblemValues,
  sourceSystemValues,
} from '@/lib/validators';
import { PROJECT_TYPES, GRADES } from '@/lib/constants';
import { useTranslations } from 'next-intl';

const TYPE_META = {
  VIDEO:     { bg: 'bg-blue-50',   activeBg: 'bg-blue-100',   color: '#3B82F6', activeColor: '#1D4ED8', path: <><polygon points="5 3 19 12 5 21 5 3"/></> },
  RESEARCH:  { bg: 'bg-purple-50', activeBg: 'bg-purple-100', color: '#8B5CF6', activeColor: '#6D28D9', path: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></> },
  ART:       { bg: 'bg-amber-50',  activeBg: 'bg-amber-100',  color: '#F59E0B', activeColor: '#D97706', path: <><path d="M12 2a10 10 0 0110 10c0 5.52-4.48 10-10 10-1.5 0-3-.5-4-1.5l1-1c.7.7 1.9 1 3 1 4.41 0 8-3.59 8-8s-3.59-8-8-8c-2 0-3.8.74-5.17 1.94L9 8H2V1l2.55 2.55A10 10 0 0112 2z"/></> },
  INVENTION: { bg: 'bg-orange-50', activeBg: 'bg-orange-100', color: '#F97316', activeColor: '#EA580C', path: <><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.5 4.5 0 0012 3.5 4.5 4.5 0 007.5 11.5c.76.76 1.23 1.52 1.41 2.5"/></> },
  APP:       { bg: 'bg-teal-50',   activeBg: 'bg-teal-100',   color: '#14B8A6', activeColor: '#0D9488', path: <><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></> },
  OTHER:     { bg: 'bg-slate-50',  activeBg: 'bg-slate-100',  color: '#94A3B8', activeColor: '#64748B', path: <><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></> },
} as const;

const STEP_KEYS = [
  { num: 1, titleKey: 'stepLogin' },
  { num: 2, titleKey: 'stepAbout' },
  { num: 3, titleKey: 'stepProject' },
  { num: 4, titleKey: 'stepUpload' },
  { num: 5, titleKey: 'stepDone' },
];

export default function SubmitPage() {
  return (
    <Suspense fallback={null}>
      <SubmitInner />
    </Suspense>
  );
}

function SubmitInner() {
  const t = useTranslations('submit');
  const tTypes = useTranslations('types');
  const tCommon = useTranslations('common');
  const tQazsu = useTranslations('qazsu');
  const tBasins = useTranslations('basins');
  const tProblems = useTranslations('problems');

  const tRegions = useTranslations('regions');
  const searchParams = useSearchParams();

  const translatedGrades = GRADES.map((g) => ({
    value: g.value,
    label: `${g.value} ${tCommon('class')}`,
  }));

  const regionOptions = Object.entries(regionLabels).map(([value, label]) => ({
    value,
    label: tRegions(value) || label,
  }));
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  // OTP
  const [email, setEmail] = useState('');
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const otp = digits.join('');

  const handleDigit = useCallback((index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  }, [digits]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) otpRefs.current[index - 1]?.focus();
  }, [digits]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = ['', '', '', '', '', ''];
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  }, []);
  // Команда: динамический список (1-5 участников)
  const [students, setStudents] = useState([{ name: '', grade: '' }]);
  const addStudent = () => setStudents(s => s.length < 5 ? [...s, { name: '', grade: '' }] : s);
  const removeStudent = (i: number) => setStudents(s => s.filter((_, idx) => idx !== i));
  const updateStudent = (i: number, field: 'name' | 'grade', val: string) =>
    setStudents(s => s.map((st, idx) => idx === i ? { ...st, [field]: val } : st));

  const [school, setSchool] = useState('');
  const [region, setRegion] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [projectType, setProjectType] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  // ── Qazsu integration: deeplink params (?source=qazsu&basin=...&water_object=...) ──
  const [basin, setBasin] = useState('');
  const [problemType, setProblemType] = useState('');
  const [waterObjectId, setWaterObjectId] = useState('');
  const [qazsuRefUrl, setQazsuRefUrl] = useState('');
  const [sourceSystem, setSourceSystem] = useState<'DIRECT' | 'QAZSU' | 'PARTNER'>('DIRECT');
  const [sourceCampaign, setSourceCampaign] = useState('');

  // Один раз на маунт читаем query-params из Qazsu deeplink.
  useEffect(() => {
    const src = (searchParams.get('source') || '').toUpperCase();
    if ((sourceSystemValues as readonly string[]).includes(src)) {
      setSourceSystem(src as 'DIRECT' | 'QAZSU' | 'PARTNER');
    }
    const b = (searchParams.get('basin') || '').toUpperCase();
    if ((waterBasinValues as readonly string[]).includes(b)) setBasin(b);
    const p = (searchParams.get('problem_type') || searchParams.get('problem') || '').toUpperCase();
    if ((waterProblemValues as readonly string[]).includes(p)) setProblemType(p);
    const wo = searchParams.get('water_object') || searchParams.get('water_object_id');
    if (wo) setWaterObjectId(wo);
    const ref = searchParams.get('ref_url') || searchParams.get('qazsu_ref');
    if (ref) setQazsuRefUrl(ref);
    const camp = searchParams.get('campaign');
    if (camp) setSourceCampaign(camp);
    const r = (searchParams.get('region') || '').toUpperCase();
    if (r && Object.keys(regionLabels).includes(r)) setRegion(r);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Consent state
  const [consentPd, setConsentPd] = useState(false);
  const [consentEmail, setConsentEmail] = useState(false);
  const [consentTeacher, setConsentTeacher] = useState(false);
  const [consentParental, setConsentParental] = useState(false);
  const [consentLicense, setConsentLicense] = useState(false);

  useEffect(() => {
    if (authenticated) {
      fetch('/api/me').then(r => r.json()).then(data => {
        if (data.user?.name) setTeacherName(data.user.name);
      }).catch(() => {});
    }
  }, [authenticated]);

  const sendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOtpSent(true);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('errorSendingSms'));
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    if (otp.length < 6) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp, consentPd, consentEmail, isTeacher: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAuthenticated(true);
      setStep(2);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('errorVerification'));
      setDigits(['', '', '', '', '', '']);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }
    setLoading(false);
  };

  const uploadFile = async (): Promise<string | null> => {
    if (!file) return null;
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      });
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          resolve(data.url);
        } else {
          reject(new Error(t('errorUpload')));
        }
      });
      xhr.addEventListener('error', () => reject(new Error(t('errorNetwork'))));
      xhr.open('POST', '/api/upload');
      xhr.send(formData);
    });
  };

  const submitProject = async () => {
    setLoading(true);
    setError('');
    try {
      let fileUrl = null;
      if (file) {
        fileUrl = await uploadFile();
      }

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          summary: summary || null,
          description,
          type: projectType,
          fileUrl,
          videoUrl: videoUrl || null,
          schoolName: school,
          region,
          teacherName,
          students: students.map(s => ({ name: s.name.trim(), grade: parseInt(s.grade) })),
          // Qazsu integration
          sourceSystem,
          sourceCampaign: sourceCampaign || null,
          basin: basin || null,
          waterObjectId: waterObjectId || null,
          problemType: problemType || null,
          qazsuRefUrl: qazsuRefUrl || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStep(5);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('errorSubmitting'));
    }
    setLoading(false);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return authenticated && consentPd && consentTeacher;
      case 2: return students[0]?.name && students[0]?.grade && school && region && teacherName && consentParental
          && students.every(s => s.name.trim().length >= 2 && !!s.grade);
      case 3: return projectType && title && description.length >= 100;
      case 4: return (file || videoUrl) && consentLicense;
      default: return false;
    }
  };

  const fromQazsu = sourceSystem === 'QAZSU';

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* Qazsu deeplink badge */}
      {fromQazsu && (
        <div className="mb-6 flex items-start gap-3 p-3.5 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284C7"
            strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5">
            <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
          </svg>
          <div className="flex-1">
            <p className="text-[13px] font-medium text-[#0F172A]">
              {tQazsu('badgeFromQazsu')}
            </p>
            <p className="text-[12px] text-[#475569] leading-relaxed mt-0.5">
              {basin && `${tQazsu('basinLabel')}: ${tBasins(basin)}. `}
              {problemType && `${tQazsu('problemLabel')}: ${tProblems(problemType)}. `}
              {qazsuRefUrl && (
                <a href={qazsuRefUrl} target="_blank" rel="noopener noreferrer"
                  className="text-[#0284C7] hover:underline">{tQazsu('openContext')}</a>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Progress */}
      <div className="flex items-center justify-between mb-10">
        {STEP_KEYS.map((s, i) => (
          <div key={s.num} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-semibold transition-colors
                  ${step > s.num ? 'bg-[#0284C7] text-white' :
                    step === s.num ? 'bg-[#0284C7] text-white' :
                    'bg-[#E2E8F0] text-[#64748B]'}`}
              >
                {step > s.num ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : s.num}
              </div>
              <span className="text-[11px] text-[#64748B] mt-1.5 hidden sm:block">{t(s.titleKey)}</span>
            </div>
            {i < STEP_KEYS.length - 1 && (
              <div className={`w-8 sm:w-16 h-[2px] mx-1 sm:mx-2 ${step > s.num ? 'bg-[#0284C7]' : 'bg-[#E2E8F0]'}`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Step 1: Auth */}
          {step === 1 && (
            <Card hover={false} padding="lg">
              <AnimatePresence mode="wait">
                {!otpSent ? (
                  <motion.div key="email-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <h2 className="text-[20px] font-semibold mb-1">{t('loginTitle')}</h2>
                    <p className="text-[14px] text-[#64748B] mb-4">{t('loginDesc')}</p>

                    {/* Правовой notice */}
                    <div className="flex gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200 mb-5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706"
                        strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5">
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                      <p className="text-[12.5px] text-amber-800 leading-relaxed">
                        {t('teacherNotice')}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[13px] font-medium text-[#374151] mb-1.5">
                          {t('phoneLabel')}
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && consentPd && consentTeacher && email && sendOtp()}
                          placeholder="example@mail.com"
                          autoComplete="email"
                          className="w-full h-11 px-3.5 rounded-xl border border-[#E2E8F0] text-[15px] text-[#0F172A]
                            placeholder:text-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20
                            focus:border-[#0284C7] transition-all bg-[#FAFAFA]"
                        />
                      </div>

                      <div className="space-y-3">
                        {/* Мұғалім растауы */}
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" checked={consentTeacher}
                            onChange={(e) => setConsentTeacher(e.target.checked)}
                            className="mt-0.5 w-4 h-4 rounded accent-[#0284C7] cursor-pointer shrink-0" />
                          <span className="text-[12.5px] text-[#475569] leading-relaxed">
                            {t('consentTeacher')}{' '}<span className="text-red-500">*</span>
                          </span>
                        </label>

                        {/* ПД */}
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" checked={consentPd} onChange={(e) => setConsentPd(e.target.checked)}
                            className="mt-0.5 w-4 h-4 rounded accent-[#0284C7] cursor-pointer shrink-0" />
                          <span className="text-[12.5px] text-[#475569] leading-relaxed">
                            {t.rich('consentPdText', {
                              link: (chunks) => (
                                <Link href="/privacy" target="_blank" rel="noopener noreferrer"
                                  className="text-[#0284C7] hover:underline font-medium"
                                  onClick={(e) => e.stopPropagation()}>{chunks}</Link>
                              ),
                            })}{' '}<span className="text-red-500">*</span>
                          </span>
                        </label>

                        {/* Email уведомления */}
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" checked={consentEmail}
                            onChange={(e) => setConsentEmail(e.target.checked)}
                            className="mt-0.5 w-4 h-4 rounded accent-[#0284C7] cursor-pointer shrink-0" />
                          <span className="text-[12.5px] text-[#475569] leading-relaxed">
                            {t('consentEmailText')}
                          </span>
                        </label>
                      </div>

                      {error && (
                        <p className="text-[13px] text-red-500 bg-red-50 border border-red-100 px-3 py-2.5 rounded-lg">{error}</p>
                      )}

                      <button onClick={sendOtp}
                        disabled={!consentPd || !consentTeacher || !email || loading}
                        className="w-full h-11 rounded-xl bg-[#0284C7] text-white text-[14px] font-semibold
                          hover:bg-[#0369A1] disabled:opacity-40 disabled:cursor-not-allowed transition-all
                          flex items-center justify-center gap-2">
                        {loading && (
                          <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                            <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                          </svg>
                        )}
                        {t('getCode')}
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="otp-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <h2 className="text-[20px] font-semibold mb-1">{t('smsCode')}</h2>

                    {/* Email badge */}
                    <div className="inline-flex items-center gap-2 mt-1 mb-6 px-3 py-1.5 bg-[#F0F9FF] border border-[#BAE6FD] rounded-full">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      <span className="text-[12px] font-medium text-[#0284C7]">{email}</span>
                    </div>

                    {/* 6 digit boxes */}
                    <div className="flex gap-2 justify-center mb-5">
                      {digits.map((digit, i) => (
                        <input key={i}
                          ref={(el) => { otpRefs.current[i] = el; }}
                          type="text" inputMode="numeric" maxLength={1} value={digit}
                          onChange={(e) => handleDigit(i, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(i, e)}
                          onPaste={i === 0 ? handlePaste : undefined}
                          className={`w-11 h-13 rounded-xl border-2 text-center text-[20px] font-bold
                            text-[#0F172A] transition-all outline-none
                            ${digit ? 'border-[#0284C7] bg-[#F0F9FF]' : 'border-[#E2E8F0] bg-[#FAFAFA]'}
                            focus:border-[#0284C7] focus:bg-[#F0F9FF] focus:ring-2 focus:ring-[#0284C7]/15`}
                          style={{ height: '52px' }}
                        />
                      ))}
                    </div>

                    {error && (
                      <p className="text-[13px] text-red-500 bg-red-50 border border-red-100 px-3 py-2.5 rounded-lg text-center mb-4">{error}</p>
                    )}

                    <button onClick={verifyOtp} disabled={otp.length < 6 || loading}
                      className="w-full h-11 rounded-xl bg-[#0284C7] text-white text-[14px] font-semibold
                        hover:bg-[#0369A1] disabled:opacity-40 disabled:cursor-not-allowed transition-all
                        flex items-center justify-center gap-2 mb-3">
                      {loading && (
                        <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                          <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                      )}
                      {t('confirm')}
                    </button>
                    <button onClick={() => { setOtpSent(false); setDigits(['','','','','','']); setError(''); }}
                      className="w-full text-[13px] text-[#94A3B8] hover:text-[#64748B] transition-colors">
                      {t('resendCode')}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          )}

          {/* Step 2: About yourself */}
          {step === 2 && (
            <Card hover={false} padding="lg">
              <h2 className="text-[20px] font-semibold mb-1">{t('aboutTitle')}</h2>
              <p className="text-[14px] text-[#64748B] mb-6">
                {t('aboutDesc')}
              </p>

              <div className="space-y-5">
                {/* Мектеп + аймақ */}
                <Input label={t('schoolLabel')} placeholder={t('schoolPlaceholder')}
                  value={school} onChange={(e) => setSchool(e.target.value)} />
                <Select label={t('regionLabel')} value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  options={regionOptions} placeholder={t('regionPlaceholder')} />
                <Input label="Мұғалімнің аты-жөні" placeholder={t('teacherPlaceholder')}
                  value={teacherName} onChange={(e) => setTeacherName(e.target.value)} />

                {/* Команда */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[13px] font-medium text-[#374151]">
                      Команда мүшелері
                      <span className="ml-1.5 text-[11px] text-[#94A3B8] font-normal">
                        (1–5 оқушы)
                      </span>
                    </label>
                    {students.length < 5 && (
                      <button onClick={addStudent} type="button"
                        className="flex items-center gap-1 text-[12px] font-medium text-[#0284C7]
                          hover:text-[#0369A1] transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Қатысушы қосу
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {students.map((st, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        {/* Number */}
                        <div className="w-6 h-11 flex items-center justify-center shrink-0">
                          <span className="text-[12px] font-bold text-[#CBD5E1]">{i + 1}</span>
                        </div>
                        {/* Name */}
                        <div className="flex-1">
                          <input
                            type="text"
                            value={st.name}
                            onChange={(e) => updateStudent(i, 'name', e.target.value)}
                            placeholder="Аты-жөні"
                            className="w-full h-11 px-3 rounded-xl border border-[#E2E8F0] text-[14px]
                              text-[#0F172A] placeholder:text-[#CBD5E1] bg-[#FAFAFA]
                              focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7] transition-all"
                          />
                        </div>
                        {/* Grade */}
                        <div className="w-28 shrink-0">
                          <select
                            value={st.grade}
                            onChange={(e) => updateStudent(i, 'grade', e.target.value)}
                            className="w-full h-11 px-3 rounded-xl border border-[#E2E8F0] text-[14px]
                              text-[#0F172A] bg-[#FAFAFA] focus:outline-none focus:ring-2
                              focus:ring-[#0284C7]/20 focus:border-[#0284C7] transition-all cursor-pointer"
                          >
                            <option value="">Сынып</option>
                            {Array.from({length: 11}, (_, k) => k + 1).map(g => (
                              <option key={g} value={g}>{g} сынып</option>
                            ))}
                          </select>
                        </div>
                        {/* Remove */}
                        {students.length > 1 && (
                          <button onClick={() => removeStudent(i)} type="button"
                            className="w-11 h-11 flex items-center justify-center rounded-xl
                              text-[#CBD5E1] hover:text-red-500 hover:bg-red-50 transition-all shrink-0">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {students.length < 5 && (
                    <p className="text-[11px] text-[#94A3B8] mt-2">
                      Максимум 5 оқушы қоса аласыз
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-[#F1F5F9]">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={consentParental}
                      onChange={(e) => setConsentParental(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-[#0284C7] cursor-pointer shrink-0"
                    />
                    <span className="text-[13px] text-[#475569] leading-relaxed group-hover:text-[#0F172A] transition-colors">
                      Мен оқушының ата-анасының/заңды өкілдерінің жеке деректерін өңдеуге
                      жазбаша келісімі бар екенін растаймын (14 жасқа дейінгі оқушылар үшін міндетті).{' '}
                      <span className="text-red-500">*</span>
                    </span>
                  </label>
                </div>
              </div>
            </Card>
          )}

          {/* Step 3: About project */}
          {step === 3 && (
            <Card hover={false} padding="lg">
              <h2 className="text-[20px] font-semibold mb-1">{t('projectTitle')}</h2>
              <p className="text-[14px] text-[#64748B] mb-6">{t('projectDesc')}</p>

              <div className="space-y-6">
                {/* Su context (бассейн + тақырып) — необязательно */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[13px] font-medium text-[#374151] block mb-1.5">
                      {tQazsu('basinLabel')}
                      <span className="ml-1.5 text-[11px] text-[#94A3B8] font-normal">{tQazsu('optional')}</span>
                    </label>
                    <select
                      value={basin}
                      onChange={(e) => setBasin(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-[#E2E8F0] text-[14px]
                        text-[#0F172A] bg-[#FAFAFA] focus:outline-none focus:ring-2
                        focus:ring-[#0284C7]/20 focus:border-[#0284C7] transition-all cursor-pointer"
                    >
                      <option value="">{tQazsu('unselected')}</option>
                      {waterBasinValues.map((code) => (
                        <option key={code} value={code}>{tBasins(code)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[13px] font-medium text-[#374151] block mb-1.5">
                      {tQazsu('problemLabel')}
                      <span className="ml-1.5 text-[11px] text-[#94A3B8] font-normal">{tQazsu('optional')}</span>
                    </label>
                    <select
                      value={problemType}
                      onChange={(e) => setProblemType(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-[#E2E8F0] text-[14px]
                        text-[#0F172A] bg-[#FAFAFA] focus:outline-none focus:ring-2
                        focus:ring-[#0284C7]/20 focus:border-[#0284C7] transition-all cursor-pointer"
                    >
                      <option value="">{tQazsu('unselected')}</option>
                      {waterProblemValues.map((code) => (
                        <option key={code} value={code}>{tProblems(code)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Project type grid */}
                <div>
                  <label className="text-[13px] font-medium text-[#374151] block mb-3">
                    {t('projectTypeLabel')}
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {PROJECT_TYPES.map((pt) => {
                      const selected = projectType === pt.value;
                      const meta = TYPE_META[pt.value as keyof typeof TYPE_META];
                      return (
                        <button
                          key={pt.value}
                          type="button"
                          onClick={() => setProjectType(pt.value)}
                          className={`relative p-3.5 rounded-xl border-2 text-left transition-all group
                            ${selected
                              ? 'border-[#0284C7] bg-[#F0F9FF] shadow-sm'
                              : 'border-[#E2E8F0] bg-white hover:border-[#0284C7]/40 hover:bg-[#FAFEFF]'}`}
                        >
                          {/* Checkmark */}
                          {selected && (
                            <span className="absolute top-2 right-2 w-4 h-4 bg-[#0284C7] rounded-full flex items-center justify-center">
                              <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                                <polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </span>
                          )}
                          {/* Icon */}
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5
                            ${selected ? meta.activeBg : meta.bg}`}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                              stroke={selected ? meta.activeColor : meta.color} strokeWidth="2"
                              strokeLinecap="round" strokeLinejoin="round">
                              {meta.path}
                            </svg>
                          </div>
                          <div className={`text-[13px] font-semibold leading-tight
                            ${selected ? 'text-[#0284C7]' : 'text-[#0F172A]'}`}>
                            {tTypes(pt.value)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="text-[13px] font-medium text-[#374151] block mb-1.5">
                    {t('projectNameLabel')}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t('projectNamePlaceholder')}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E2E8F0] text-[15px] text-[#0F172A]
                      placeholder:text-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20
                      focus:border-[#0284C7] transition-all bg-[#FAFAFA]"
                  />
                </div>

                {/* Summary / Аннотация */}
                <div>
                  <label className="text-[13px] font-medium text-[#374151] block mb-1.5">
                    Қысқаша аннотация
                    <span className="ml-1.5 text-[11px] text-[#94A3B8] font-normal">міндетті емес</span>
                  </label>
                  <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Жобаның негізгі идеясын 2-3 сөйлеммен сипаттаңыз..."
                    rows={3}
                    maxLength={500}
                    className="w-full px-3.5 py-3 rounded-xl border border-[#E2E8F0] text-[14px] text-[#0F172A]
                      placeholder:text-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20
                      focus:border-[#0284C7] transition-all bg-[#FAFAFA] resize-none leading-relaxed"
                  />
                  <div className="flex justify-end mt-1">
                    <span className="text-[11px] text-[#94A3B8]">{summary.length}/500</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-[13px] font-medium text-[#374151] block mb-1.5">
                    {t('projectDescLabel')}
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t('projectDescPlaceholder')}
                    rows={5}
                    maxLength={5000}
                    className="w-full px-3.5 py-3 rounded-xl border border-[#E2E8F0] text-[15px] text-[#0F172A]
                      placeholder:text-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20
                      focus:border-[#0284C7] transition-all bg-[#FAFAFA] resize-none leading-relaxed"
                  />
                  {/* Progress bar + counter */}
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex-1 h-1 bg-[#E2E8F0] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300
                          ${description.length >= 100 ? 'bg-[#0284C7]' : 'bg-[#F59E0B]'}`}
                        style={{ width: `${Math.min((description.length / 5000) * 100, 100)}%` }}
                      />
                    </div>
                    <span className={`text-[12px] font-medium shrink-0
                      ${description.length >= 100 ? 'text-[#64748B]' : 'text-[#F59E0B]'}`}>
                      {description.length < 100
                        ? `${t('minChars')} · ${description.length}/100`
                        : `${description.length}/5000`}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Step 4: Upload */}
          {step === 4 && (
            <Card hover={false} padding="lg">
              <h2 className="text-[20px] font-semibold mb-1">{t('uploadTitle')}</h2>
              <p className="text-[14px] text-[#64748B] mb-6">
                {t('uploadDesc')}
              </p>

              <div className="space-y-5">
                {/* Drop zone */}
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
                    ${file ? 'border-[#0284C7] bg-[#E0F2FE]' : 'border-[#E2E8F0] hover:border-[#0284C7]/40'}`}
                  onClick={() => document.getElementById('file-input')?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const dropped = e.dataTransfer.files[0];
                    if (dropped) setFile(dropped);
                  }}
                >
                  <input
                    id="file-input"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.mp4,.mov"
                    className="hidden"
                    onChange={(e) => {
                      const selected = e.target.files?.[0];
                      if (selected) setFile(selected);
                    }}
                  />
                  {file ? (
                    <div>
                      <svg className="mx-auto mb-2" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      <p className="text-[14px] font-medium text-[#0F172A]">{file.name}</p>
                      <p className="text-[12px] text-[#64748B] mt-1">
                        {(file.size / (1024 * 1024)).toFixed(1)} {t('megabytes')}
                      </p>
                      <button
                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                        className="mt-2 text-[12px] text-red-500 hover:underline"
                      >
                        {t('remove')}
                      </button>
                    </div>
                  ) : (
                    <div>
                      <svg className="mx-auto mb-2" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <p className="text-[14px] text-[#64748B]">
                        {t('dropzone')}
                      </p>
                      <p className="text-[12px] text-[#64748B] mt-1">
                        {t('fileFormats')}
                      </p>
                    </div>
                  )}
                </div>

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-full bg-[#E2E8F0] rounded-full h-2">
                    <div
                      className="bg-[#0284C7] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-[#E2E8F0]" />
                  <span className="text-[12px] text-[#64748B]">{t('or')}</span>
                  <div className="flex-1 h-px bg-[#E2E8F0]" />
                </div>

                <Input
                  label={t('videoUrlLabel')}
                  placeholder={t('videoUrlPlaceholder')}
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  hint={t('videoUrlHint')}
                />

                <div className="pt-2 border-t border-[#F1F5F9]">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={consentLicense}
                      onChange={(e) => setConsentLicense(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-[#0284C7] cursor-pointer shrink-0"
                    />
                    <span className="text-[13px] text-[#475569] leading-relaxed group-hover:text-[#0F172A] transition-colors">
                      Жобаны жүктей отырып, мен автор/автордың заңды өкілі екенімді растаймын
                      және «Су ресурстары ААО» ЖАҚ-қа конкурс шеңберінде жобаны жариялауға
                      және пайдалануға айрықша емес лицензия беремін{' '}
                      <Link
                        href="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0284C7] hover:underline font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Пайдаланушы келісіміне
                      </Link>
                      .{' '}
                      <span className="text-red-500">*</span>
                    </span>
                  </label>
                </div>
              </div>
            </Card>
          )}

          {/* Step 5: Success */}
          {step === 5 && (
            <Card hover={false} padding="lg">
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-[#E0F2FE] flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2 className="text-[24px] font-bold text-[#0F172A] mb-2">
                  {t('successTitle')}
                </h2>
                <p className="text-[15px] text-[#64748B] max-w-md mx-auto">
                  {t('successDesc', { title })}
                </p>
                <div className="mt-8 flex gap-3 justify-center">
                  <a href="/projects">
                    <Button variant="secondary">{t('viewProjects')}</Button>
                  </a>
                  <a href="/">
                    <Button>{t('goHome')}</Button>
                  </a>
                </div>
              </div>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Error */}
      {error && step !== 1 && (
        <p className="mt-4 text-[13px] text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>
      )}

      {/* Navigation */}
      {step > 1 && step < 5 && (
        <div className="flex justify-between mt-6">
          <Button variant="ghost" onClick={() => setStep(step - 1)}>
            &larr; {t('back')}
          </Button>
          {step < 4 ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
              {t('next')} &rarr;
            </Button>
          ) : (
            <Button onClick={submitProject} loading={loading} disabled={!canProceed()}>
              {t('submitProject')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
