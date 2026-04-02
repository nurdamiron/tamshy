import { NextRequest, NextResponse } from 'next/server';
import { phoneSchema } from '@/lib/validators';
import { sendOTP } from '@/lib/sms';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = phoneSchema.safeParse(body.phone);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    await sendOTP(result.data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Не удалось отправить SMS' },
      { status: 500 }
    );
  }
}
