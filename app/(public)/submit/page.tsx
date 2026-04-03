'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Card from '@/components/ui/Card';
import { regionLabels } from '@/lib/validators';
import { PROJECT_TYPES, GRADES } from '@/lib/constants';
import { useTranslations } from 'next-intl';

const STEP_KEYS = [
  { num: 1, titleKey: 'stepLogin' },
  { num: 2, titleKey: 'stepAbout' },
  { num: 3, titleKey: 'stepProject' },
  { num: 4, titleKey: 'stepUpload' },
  { num: 5, titleKey: 'stepDone' },
];

export default function SubmitPage() {
  const t = useTranslations('submit');
  const tTypes = useTranslations('types');
  const tCommon = useTranslations('common');

  const tRegions = useTranslations('regions');

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

  // Form data
  const [phone, setPhone] = useState('+7');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [school, setSchool] = useState('');
  const [region, setRegion] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [projectType, setProjectType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const sendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOtpSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('errorSendingSms'));
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAuthenticated(true);
      setStep(2);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('errorVerification'));
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
          description,
          type: projectType,
          fileUrl,
          videoUrl: videoUrl || null,
          schoolName: school,
          region,
          teacherName,
          grade: parseInt(grade),
          userName: name,
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
      case 1: return authenticated;
      case 2: return name && grade && school && region && teacherName;
      case 3: return projectType && title && description.length >= 100;
      case 4: return file || videoUrl;
      default: return false;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
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
              <h2 className="text-[20px] font-semibold mb-1">{t('loginTitle')}</h2>
              <p className="text-[14px] text-[#64748B] mb-6">
                {t('loginDesc')}
              </p>

              <div className="space-y-4">
                <Input
                  label={t('phoneLabel')}
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={otpSent}
                />

                {!otpSent ? (
                  <Button onClick={sendOtp} loading={loading} className="w-full">
                    {t('getCode')}
                  </Button>
                ) : (
                  <>
                    <Input
                      label={t('smsCode')}
                      placeholder="______"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="text-center text-[20px] tracking-[8px]"
                    />
                    <Button onClick={verifyOtp} loading={loading} className="w-full">
                      {t('confirm')}
                    </Button>
                    <button
                      onClick={() => { setOtpSent(false); setOtp(''); }}
                      className="w-full text-[13px] text-[#64748B] hover:text-[#0284C7] transition-colors"
                    >
                      {t('resendCode')}
                    </button>
                  </>
                )}
              </div>

              {error && (
                <p className="mt-4 text-[13px] text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>
              )}
            </Card>
          )}

          {/* Step 2: About yourself */}
          {step === 2 && (
            <Card hover={false} padding="lg">
              <h2 className="text-[20px] font-semibold mb-1">{t('aboutTitle')}</h2>
              <p className="text-[14px] text-[#64748B] mb-6">
                {t('aboutDesc')}
              </p>

              <div className="space-y-4">
                <Input
                  label={t('nameLabel')}
                  placeholder={t('namePlaceholder')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Select
                  label={t('gradeLabel')}
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  options={translatedGrades}
                  placeholder={t('gradePlaceholder')}
                />
                <Input
                  label={t('schoolLabel')}
                  placeholder={t('schoolPlaceholder')}
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                />
                <Select
                  label={t('regionLabel')}
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  options={regionOptions}
                  placeholder={t('regionPlaceholder')}
                />
                <Input
                  label={t('teacherLabel')}
                  placeholder={t('teacherPlaceholder')}
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                />
              </div>
            </Card>
          )}

          {/* Step 3: About project */}
          {step === 3 && (
            <Card hover={false} padding="lg">
              <h2 className="text-[20px] font-semibold mb-1">{t('projectTitle')}</h2>
              <p className="text-[14px] text-[#64748B] mb-6">
                {t('projectDesc')}
              </p>

              <div className="space-y-5">
                {/* Project type cards */}
                <div>
                  <label className="text-[13px] font-medium text-[#0F172A] block mb-2">
                    {t('projectTypeLabel')}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {PROJECT_TYPES.filter(pt => pt.value !== 'OTHER').map((pt) => (
                      <button
                        key={pt.value}
                        type="button"
                        onClick={() => setProjectType(pt.value)}
                        className={`p-4 rounded-xl border-2 text-left transition-all
                          ${projectType === pt.value
                            ? 'border-[#0284C7] bg-[#E0F2FE]'
                            : 'border-[#E2E8F0] hover:border-[#0284C7]/30'}`}
                      >
                        <div className="text-[14px] font-medium text-[#0F172A]">{tTypes(pt.value)}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  label={t('projectNameLabel')}
                  placeholder={t('projectNamePlaceholder')}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <Textarea
                  label={t('projectDescLabel')}
                  placeholder={t('projectDescPlaceholder')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  showCount
                  maxLength={5000}
                  hint={t('minChars')}
                />
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
