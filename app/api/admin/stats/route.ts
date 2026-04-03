import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenPayload } from '@/lib/auth';

export async function GET() {
  try {
    const payload = await getTokenPayload();
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [
      contests,
      submissionsNew,
      submissionsReviewing,
      submissionsAccepted,
      submissionsRejected,
      materials,
      news,
      messages,
      subscribers,
    ] = await Promise.all([
      prisma.contest.count(),
      prisma.contestSubmission.count({ where: { status: 'NEW' } }),
      prisma.contestSubmission.count({ where: { status: 'REVIEWING' } }),
      prisma.contestSubmission.count({ where: { status: 'ACCEPTED' } }),
      prisma.contestSubmission.count({ where: { status: 'REJECTED' } }),
      prisma.material.count(),
      prisma.news.count(),
      prisma.contactMessage.count(),
      prisma.newsletterSub.count(),
    ]);

    return NextResponse.json({
      contests,
      submissions: {
        total: submissionsNew + submissionsReviewing + submissionsAccepted + submissionsRejected,
        new: submissionsNew,
        reviewing: submissionsReviewing,
        accepted: submissionsAccepted,
        rejected: submissionsRejected,
      },
      materials,
      news,
      messages,
      subscribers,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки статистики' }, { status: 500 });
  }
}
