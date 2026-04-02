import { prisma } from './prisma';

const OTP_EXPIRY_MINUTES = 10;
const OTP_LENGTH = 6;
const DEV_OTP = '000000';

function generateOTP(length: number): string {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10).toString();
  }
  return code;
}

export async function sendOTP(phone: string): Promise<void> {
  const isDev = process.env.NODE_ENV === 'development' || !process.env.MOBIZON_API_KEY;
  const code = isDev ? DEV_OTP : generateOTP(OTP_LENGTH);
  const expiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await prisma.user.upsert({
    where: { phone },
    update: { otpCode: code, otpExpiry: expiry },
    create: { phone, otpCode: code, otpExpiry: expiry },
  });

  if (isDev) {
    console.log(`[DEV] OTP for ${phone}: ${code}`);
    return;
  }

  await fetch('https://api.mobizon.kz/service/Message/SendSmsMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apiKey: process.env.MOBIZON_API_KEY,
      recipient: phone,
      text: `Ваш код для Тамшы: ${code}. Действителен ${OTP_EXPIRY_MINUTES} минут.`,
    }),
  });
}

export async function verifyOTP(phone: string, code: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { phone } });

  if (!user || !user.otpCode || !user.otpExpiry) return false;
  if (user.otpCode !== code) return false;
  if (new Date() > user.otpExpiry) return false;

  await prisma.user.update({
    where: { phone },
    data: { otpCode: null, otpExpiry: null },
  });

  return true;
}
