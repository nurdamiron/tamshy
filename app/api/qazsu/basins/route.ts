import { NextResponse } from 'next/server';
import { waterBasinValues, basinLabels } from '@/lib/validators';

// GET /api/qazsu/basins
// Возвращает 8 водохозяйственных бассейнов Казахстана.
// Кешируется на CDN — справочник статичен.
export async function GET() {
  const basins = waterBasinValues.map((code) => ({
    code,
    label: basinLabels[code],
  }));
  return NextResponse.json(
    { basins },
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
  );
}
