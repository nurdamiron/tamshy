import { NextResponse } from 'next/server';
import { waterProblemValues, problemLabels } from '@/lib/validators';

// GET /api/qazsu/problem-types
// Таксономия водных проблем для формы подачи и фильтров.
export async function GET() {
  const problems = waterProblemValues.map((code) => ({
    code,
    label: problemLabels[code],
  }));
  return NextResponse.json(
    { problems },
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
  );
}
