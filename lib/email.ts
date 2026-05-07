import nodemailer from 'nodemailer';
import { randomInt, createHmac } from 'crypto';
import { prisma } from './prisma';

const OTP_EXPIRY_MINUTES = 10;
const OTP_LENGTH = 6;
const DEV_OTP = '000000';

// ── Transporter (singleton) ──────────────────────────

let _transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      service: 'gmail',
      pool: true,
      maxConnections: 3,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
  return _transporter;
}

const FROM = () => `"Тамшы" <${process.env.GMAIL_USER ?? 'no-reply@tamshy.kz'}>`;

function getContactEmails(): string[] {
  return (process.env.CONTACT_EMAILS ?? '').split(',').map((e) => e.trim()).filter(Boolean);
}

/** Dev-режим: только если SMTP не настроен. */
function isDev(): boolean {
  return !process.env.GMAIL_APP_PASSWORD;
}

/** Absolute base URL for assets (logo, etc.) */
function appUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL ?? '';
  return raw.startsWith('http://localhost') ? 'https://tamshy.kz' : (raw || 'https://tamshy.kz');
}

// ── OTP helpers ──────────────────────────────────────

function generateOTP(): string {
  return Array.from({ length: OTP_LENGTH }, () => randomInt(0, 10)).join('');
}

function hashOTP(code: string): string {
  const salt = process.env.JWT_SECRET ?? 'fallback-otp-salt';
  return createHmac('sha256', salt).update(code).digest('hex');
}

// ── OTP send / verify ────────────────────────────────

export async function sendOTP(email: string): Promise<void> {
  if (!process.env.GMAIL_APP_PASSWORD && process.env.NODE_ENV === 'production') {
    throw new Error('[FATAL] GMAIL_APP_PASSWORD не задан — отправка OTP невозможна');
  }

  const code = isDev() ? DEV_OTP : generateOTP();
  const expiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await prisma.user.upsert({
    where: { email },
    update: { otpCode: hashOTP(code), otpExpiry: expiry },
    create: { email, otpCode: hashOTP(code), otpExpiry: expiry },
  });

  if (isDev()) {
    console.log(`[DEV] OTP for ${email}: ${code}`);
    return;
  }

  await getTransporter().sendMail({
    from: FROM(),
    to: email,
    subject: 'Растау коды — Тамшы',
    html: otpEmailHtml(code),
  });
}

export async function verifyOTP(email: string, code: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.otpCode || !user.otpExpiry) return false;
  if (user.otpCode !== hashOTP(code)) return false;
  if (new Date() > user.otpExpiry) return false;

  await prisma.user.update({
    where: { email },
    data: { otpCode: null, otpExpiry: null },
  });

  return true;
}

// ── Contact form notifications ───────────────────────

export async function sendContactNotification(data: {
  name: string;
  email: string;
  topic: string;
  message: string;
  fileUrl?: string | null;
}): Promise<void> {
  if (isDev()) {
    console.log('[DEV EMAIL] contact notification:', data);
    return;
  }

  const transporter = getTransporter();
  const admins = getContactEmails();

  await Promise.all([
    transporter.sendMail({
      from: FROM(),
      to: admins,
      replyTo: data.email,
      subject: `Жаңа өтініш: ${data.topic}`,
      html: adminContactHtml(data),
    }),
    transporter.sendMail({
      from: FROM(),
      to: data.email,
      subject: 'Хабарламаңыз қабылданды — Тамшы',
      html: userContactConfirmHtml(data.name),
    }),
  ]);
}

// ── Contest submission notifications ─────────────────

export async function sendSubmissionNotification(data: {
  contestTitle: string;
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  region: string;
}): Promise<void> {
  if (isDev()) {
    console.log('[DEV EMAIL] submission notification:', data);
    return;
  }

  const transporter = getTransporter();
  const admins = getContactEmails();

  await Promise.all([
    transporter.sendMail({
      from: FROM(),
      to: admins,
      subject: `Жаңа өтінім: ${data.contestTitle} — ${data.fullName}`,
      html: adminSubmissionHtml(data),
    }),
    transporter.sendMail({
      from: FROM(),
      to: data.email,
      subject: `Өтінім қабылданды — ${data.contestTitle}`,
      html: userSubmissionConfirmHtml(data),
    }),
  ]);
}

// ── Shared layout helpers ─────────────────────────────

/** Inline water-drop SVG used as logo in email header */
function logoSvg(): string {
  return `<img src="${appUrl()}/logo.png" width="40" height="40" alt="Тамшы" style="display:inline-block;vertical-align:middle;" onerror="this.style.display='none'">`;
}

function emailHeader(accent = '#0284C7'): string {
  return `
    <tr>
      <td align="center" style="background:linear-gradient(135deg,${accent} 0%,#0369A1 100%);padding:28px 32px 24px;border-radius:16px 16px 0 0;">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-right:10px;vertical-align:middle;">
              ${logoSvg()}
            </td>
            <td style="vertical-align:middle;">
              <span style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px;">Тамшы</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}

function emailFooter(): string {
  return `
    <tr>
      <td style="padding:20px 32px;background:#F8FAFC;border-radius:0 0 16px 16px;border-top:1px solid #E2E8F0;">
        <p style="margin:0;font-size:11px;color:#94A3B8;text-align:center;line-height:1.6;">
          © 2026 Тамшы · <a href="https://tamshy.kz" style="color:#0284C7;text-decoration:none;">tamshy.kz</a><br>
          Бұл хат автоматты түрде жіберілді. Жауап бермеңіз.
        </p>
      </td>
    </tr>`;
}

function emailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html lang="kk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Тамшы</title>
</head>
<body style="margin:0;padding:0;background:#EFF6FF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fff;border-radius:16px;border:1px solid #DBEAFE;box-shadow:0 4px 24px rgba(2,132,199,0.08);">
        ${content}
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── OTP email ─────────────────────────────────────────

function otpEmailHtml(code: string): string {
  const digits = code.split('').map(d =>
    `<span style="display:inline-block;width:44px;height:52px;line-height:52px;text-align:center;font-size:28px;font-weight:800;color:#0284C7;background:#EFF6FF;border:2px solid #BAE6FD;border-radius:10px;margin:0 3px;">${d}</span>`
  ).join('');

  const content = `
    ${emailHeader()}
    <tr>
      <td style="padding:32px 32px 24px;">
        <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#0F172A;">Кіру коды</h2>
        <p style="margin:0 0 24px;font-size:15px;color:#64748B;line-height:1.6;">
          Tamshy.kz платформасына кіру үшін төмендегі кодты пайдаланыңыз:
        </p>
        <div style="text-align:center;padding:24px 0;">
          ${digits}
        </div>
        <div style="margin:24px 0 0;padding:14px 18px;background:#FFFBEB;border-left:3px solid #F59E0B;border-radius:8px;">
          <p style="margin:0;font-size:13px;color:#92400E;line-height:1.5;">
            ⏱ Код <strong>${OTP_EXPIRY_MINUTES} минут</strong> бойы жарамды.<br>
            🔒 Кодты ешкімге бермеңіз.
          </p>
        </div>
        <p style="margin:16px 0 0;font-size:13px;color:#94A3B8;">
          Егер сіз кіруді сұратпаған болсаңыз — бұл хатты елемеуіңізге болады.
        </p>
      </td>
    </tr>
    ${emailFooter()}`;

  return emailWrapper(content);
}

// ── Admin contact notification ────────────────────────

function adminContactHtml(data: {
  name: string;
  email: string;
  topic: string;
  message: string;
  fileUrl?: string | null;
}): string {
  const content = `
    ${emailHeader('#0F172A')}
    <tr>
      <td style="padding:28px 32px 8px;">
        <div style="display:inline-block;padding:4px 12px;background:#DBEAFE;border-radius:20px;margin-bottom:12px;">
          <span style="font-size:12px;font-weight:600;color:#1D4ED8;text-transform:uppercase;letter-spacing:0.5px;">Жаңа өтініш</span>
        </div>
        <h2 style="margin:0 0 4px;font-size:20px;font-weight:700;color:#0F172A;">${escHtml(data.topic)}</h2>
        <p style="margin:0;font-size:13px;color:#64748B;">Байланыс нысаны арқылы жіберілді</p>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 32px 28px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E2E8F0;border-radius:12px;overflow:hidden;">
          ${adminRow('Аты-жөні', escHtml(data.name), '#F8FAFC')}
          ${adminRow('Email', `<a href="mailto:${escHtml(data.email)}" style="color:#0284C7;text-decoration:none;">${escHtml(data.email)}</a>`, '#fff')}
          ${adminRow('Тақырып', escHtml(data.topic), '#F8FAFC')}
          ${adminRow('Хабарлама', `<div style="white-space:pre-wrap;line-height:1.6;">${escHtml(data.message)}</div>`, '#fff')}
          ${data.fileUrl ? adminRow('Файл', `<a href="${escHtml(data.fileUrl)}" style="color:#0284C7;text-decoration:none;font-weight:500;">📎 Жүктеп алу</a>`, '#F8FAFC') : ''}
        </table>
        <p style="margin:16px 0 0;font-size:13px;color:#94A3B8;">
          Жауап беру үшін <a href="mailto:${escHtml(data.email)}" style="color:#0284C7;">${escHtml(data.email)}</a> мекенжайына жазыңыз.
        </p>
      </td>
    </tr>
    ${emailFooter()}`;

  return emailWrapper(content);
}

function adminRow(label: string, value: string, bg: string): string {
  return `
    <tr>
      <td style="padding:12px 16px;background:${bg};border-bottom:1px solid #F1F5F9;width:130px;vertical-align:top;">
        <span style="font-size:12px;font-weight:600;color:#64748B;text-transform:uppercase;letter-spacing:0.3px;">${label}</span>
      </td>
      <td style="padding:12px 16px;background:${bg};border-bottom:1px solid #F1F5F9;vertical-align:top;">
        <span style="font-size:14px;color:#0F172A;">${value}</span>
      </td>
    </tr>`;
}

// ── User contact confirmation ─────────────────────────

function userContactConfirmHtml(name: string): string {
  const content = `
    ${emailHeader()}
    <tr>
      <td style="padding:36px 32px;text-align:center;">
        <div style="width:64px;height:64px;background:#DCFCE7;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:20px;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0F172A;">Хабарламаңыз қабылданды!</h2>
        <p style="margin:0 0 24px;font-size:15px;color:#64748B;line-height:1.6;">
          ${escHtml(name)}, бізге жазғаныңыз үшін рахмет.<br>
          Біз 1 жұмыс күні ішінде жауап береміз.
        </p>
        <a href="https://tamshy.kz" style="display:inline-block;padding:12px 28px;background:#0284C7;color:#fff;border-radius:10px;font-size:14px;font-weight:600;text-decoration:none;">
          Сайтқа оралу
        </a>
      </td>
    </tr>
    ${emailFooter()}`;

  return emailWrapper(content);
}

// ── Admin submission notification ────────────────────

function adminSubmissionHtml(data: {
  contestTitle: string;
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  region: string;
}): string {
  const content = `
    ${emailHeader('#0F172A')}
    <tr>
      <td style="padding:28px 32px 8px;">
        <div style="display:inline-block;padding:4px 12px;background:#FEF3C7;border-radius:20px;margin-bottom:12px;">
          <span style="font-size:12px;font-weight:600;color:#92400E;text-transform:uppercase;letter-spacing:0.5px;">Жаңа өтінім</span>
        </div>
        <h2 style="margin:0 0 4px;font-size:20px;font-weight:700;color:#0F172A;">${escHtml(data.contestTitle)}</h2>
        <p style="margin:0;font-size:13px;color:#64748B;">Конкурсқа өтінім келіп түсті</p>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 32px 28px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E2E8F0;border-radius:12px;overflow:hidden;">
          ${adminRow('Аты-жөні', escHtml(data.fullName), '#F8FAFC')}
          ${adminRow('Email', `<a href="mailto:${escHtml(data.email)}" style="color:#0284C7;text-decoration:none;">${escHtml(data.email)}</a>`, '#fff')}
          ${adminRow('Телефон', escHtml(data.phone), '#F8FAFC')}
          ${adminRow('Ұйым', escHtml(data.institution), '#fff')}
          ${adminRow('Аймақ', escHtml(data.region), '#F8FAFC')}
        </table>
      </td>
    </tr>
    ${emailFooter()}`;

  return emailWrapper(content);
}

// ── User submission confirmation ──────────────────────

function userSubmissionConfirmHtml(data: { contestTitle: string; fullName: string }): string {
  const content = `
    ${emailHeader()}
    <tr>
      <td style="padding:36px 32px;text-align:center;">
        <div style="width:64px;height:64px;background:#FEF3C7;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:20px;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0F172A;">Өтінім қабылданды!</h2>
        <p style="margin:0 0 6px;font-size:15px;color:#64748B;line-height:1.6;">
          ${escHtml(data.fullName)}, сіздің
        </p>
        <p style="margin:0 0 20px;font-size:16px;font-weight:700;color:#0284C7;">
          «${escHtml(data.contestTitle)}»
        </p>
        <p style="margin:0 0 28px;font-size:15px;color:#64748B;line-height:1.6;">
          конкурсына өтінімі сәтті тіркелді.<br>
          Нәтижелер туралы email арқылы хабарлаймыз.
        </p>
        <div style="padding:16px;background:#F0F9FF;border-radius:10px;margin-bottom:24px;">
          <p style="margin:0;font-size:13px;color:#0369A1;line-height:1.6;">
            📅 Нәтижелер: конкурс аяқталғаннан кейін<br>
            📧 Байланыс: <a href="mailto:info@tamshy.kz" style="color:#0284C7;text-decoration:none;">info@tamshy.kz</a>
          </p>
        </div>
        <a href="https://tamshy.kz/contests" style="display:inline-block;padding:12px 28px;background:#0284C7;color:#fff;border-radius:10px;font-size:14px;font-weight:600;text-decoration:none;">
          Конкурстарды көру
        </a>
      </td>
    </tr>
    ${emailFooter()}`;

  return emailWrapper(content);
}

// ── Utils ─────────────────────────────────────────────

function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Project submission confirmation (to teacher) ──────

export async function sendProjectSubmittedEmail(data: {
  teacherEmail: string;
  teacherName: string | null;
  projectTitle: string;
  studentName: string | null;
  schoolName: string;
}): Promise<void> {
  if (isDev()) {
    console.log('[DEV EMAIL] project submitted:', data);
    return;
  }

  const content = `
    ${emailHeader()}
    <tr>
      <td style="padding:36px 32px;text-align:center;">
        <div style="width:64px;height:64px;background:#DCFCE7;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:20px;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0F172A;">Жоба сәтті тапсырылды!</h2>
        <p style="margin:0 0 20px;font-size:15px;color:#64748B;line-height:1.6;">
          ${escHtml(data.teacherName ?? 'Мұғалім')}, сіздің жобаңыз модерацияға жіберілді.
        </p>
        <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:20px;margin-bottom:24px;text-align:left;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:6px 0;vertical-align:top;width:110px;">
                <span style="font-size:12px;font-weight:600;color:#94A3B8;text-transform:uppercase;letter-spacing:0.5px;">Жоба атауы</span>
              </td>
              <td style="padding:6px 0;">
                <span style="font-size:14px;font-weight:600;color:#0F172A;">${escHtml(data.projectTitle)}</span>
              </td>
            </tr>
            ${data.studentName ? `
            <tr>
              <td style="padding:6px 0;vertical-align:top;">
                <span style="font-size:12px;font-weight:600;color:#94A3B8;text-transform:uppercase;letter-spacing:0.5px;">Оқушы</span>
              </td>
              <td style="padding:6px 0;">
                <span style="font-size:14px;color:#0F172A;">${escHtml(data.studentName)}</span>
              </td>
            </tr>` : ''}
            <tr>
              <td style="padding:6px 0;vertical-align:top;">
                <span style="font-size:12px;font-weight:600;color:#94A3B8;text-transform:uppercase;letter-spacing:0.5px;">Мектеп</span>
              </td>
              <td style="padding:6px 0;">
                <span style="font-size:14px;color:#0F172A;">${escHtml(data.schoolName)}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:6px 0;vertical-align:top;">
                <span style="font-size:12px;font-weight:600;color:#94A3B8;text-transform:uppercase;letter-spacing:0.5px;">Күй</span>
              </td>
              <td style="padding:6px 0;">
                <span style="display:inline-block;padding:2px 10px;background:#FEF9C3;border:1px solid #FDE047;border-radius:20px;font-size:12px;font-weight:600;color:#A16207;">Қарастырылуда</span>
              </td>
            </tr>
          </table>
        </div>
        <div style="padding:14px 18px;background:#FFF7ED;border-left:3px solid #F97316;border-radius:8px;margin-bottom:24px;text-align:left;">
          <p style="margin:0;font-size:13px;color:#9A3412;line-height:1.6;">
            Жюри 3 жұмыс күні ішінде жобаңызды қарастырады.<br>
            Нәтиже туралы email арқылы хабарлаймыз.
          </p>
        </div>
        <a href="https://tamshy.kz/cabinet" style="display:inline-block;padding:12px 28px;background:#0284C7;color:#fff;border-radius:10px;font-size:14px;font-weight:600;text-decoration:none;">
          Кабинетке өту
        </a>
      </td>
    </tr>
    ${emailFooter()}`;

  await getTransporter().sendMail({
    from: FROM(),
    to: data.teacherEmail,
    subject: `Жоба тапсырылды: ${data.projectTitle} — Тамшы`,
    html: emailWrapper(content),
  });
}

// ── Project status change (always send, not just consentEmail) ──

export async function sendProjectStatusEmail(data: {
  teacherEmail: string;
  teacherName: string | null;
  projectTitle: string;
  status: string;
}): Promise<void> {
  if (isDev()) {
    console.log('[DEV EMAIL] project status:', data.status, data.projectTitle);
    return;
  }

  const STATUS_MAP: Record<string, { emoji: string; title: string; body: string; color: string; bg: string }> = {
    APPROVED: {
      emoji: '✓', color: '#16A34A', bg: '#DCFCE7',
      title: 'Жоба мақұлданды!',
      body: 'Жобаңыз жюримен мақұлданды және дауыс беруге ашылды. Платформамыздың барлық қатысушылары оған дауыс бере алады.',
    },
    REJECTED: {
      emoji: '✕', color: '#DC2626', bg: '#FEE2E2',
      title: 'Жоба қабылданбады',
      body: 'Өкінішке орай, жобаңыз іріктеуден өтпеді. Жюри пікірін кабинетте қарауға болады.',
    },
    WINNER: {
      emoji: '★', color: '#D97706', bg: '#FEF3C7',
      title: 'Жоба жеңімпаз атанды!',
      body: 'Құттықтаймыз! Жобаңыз Тамшы конкурсының жеңімпазы деп танылды. Бұл керемет жетістік!',
    },
  };

  const tpl = STATUS_MAP[data.status];
  if (!tpl) return;

  const content = `
    ${emailHeader(data.status === 'WINNER' ? '#D97706' : data.status === 'APPROVED' ? '#16A34A' : '#DC2626')}
    <tr>
      <td style="padding:36px 32px;text-align:center;">
        <div style="width:64px;height:64px;background:${tpl.bg};border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:20px;">
          <span style="font-size:28px;color:${tpl.color};font-weight:800;">${tpl.emoji}</span>
        </div>
        <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0F172A;">${tpl.title}</h2>
        <p style="margin:0 0 16px;font-size:16px;font-weight:600;color:#0284C7;">${escHtml(data.projectTitle)}</p>
        <p style="margin:0 0 28px;font-size:15px;color:#64748B;line-height:1.6;">${tpl.body}</p>
        <a href="https://tamshy.kz/cabinet" style="display:inline-block;padding:12px 28px;background:#0284C7;color:#fff;border-radius:10px;font-size:14px;font-weight:600;text-decoration:none;">
          Кабинетке өту
        </a>
      </td>
    </tr>
    ${emailFooter()}`;

  await getTransporter().sendMail({
    from: FROM(),
    to: data.teacherEmail,
    subject: `${tpl.title}: ${data.projectTitle} — Тамшы`,
    html: emailWrapper(content),
  });
}
