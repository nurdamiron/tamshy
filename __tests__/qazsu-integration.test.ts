import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prisma } from '@/lib/prisma';
import { createProject } from '@/lib/services/project';
import {
  projectSchema,
  waterBasinValues,
  waterProblemValues,
  sourceSystemValues,
  basinLabels,
  problemLabels,
} from '@/lib/validators';

const p = prisma as unknown as {
  project: {
    findUnique: ReturnType<typeof vi.fn>;
    findFirst:  ReturnType<typeof vi.fn>;
    create:     ReturnType<typeof vi.fn>;
  };
  user: { findUnique: ReturnType<typeof vi.fn> };
  waterObject: { findUnique: ReturnType<typeof vi.fn> };
};

beforeEach(() => vi.clearAllMocks());

// ── Validators: qazsu fields ────────────────────────────────────────────────
describe('projectSchema (qazsu)', () => {
  const base = {
    title: 'Чистая вода',
    description: 'a'.repeat(100),
    type: 'RESEARCH' as const,
    schoolName: 'НИШ Астана',
    region: 'ASTANA' as const,
    teacherName: 'Иван Иванов',
    students: [{ name: 'Алмас', grade: 8 }],
  };

  it('accepts project without qazsu fields (backward compat)', () => {
    expect(projectSchema.safeParse(base).success).toBe(true);
  });

  it('accepts valid qazsu fields', () => {
    const result = projectSchema.safeParse({
      ...base,
      sourceSystem: 'QAZSU',
      basin: 'BALKHASH_ALAKOL',
      waterObjectId: 'ili-river',
      problemType: 'WATER_QUALITY',
      qazsuRefUrl: 'https://qazsu.gov.kz/#/object/ili-river',
      sourceCampaign: 'tamshy-2026',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid basin enum', () => {
    expect(projectSchema.safeParse({ ...base, basin: 'NORTH_SEA' }).success).toBe(false);
  });

  it('rejects invalid problemType', () => {
    expect(projectSchema.safeParse({ ...base, problemType: 'TRAFFIC' }).success).toBe(false);
  });

  it('rejects invalid sourceSystem', () => {
    expect(projectSchema.safeParse({ ...base, sourceSystem: 'TWITTER' }).success).toBe(false);
  });

  it('rejects non-URL qazsuRefUrl', () => {
    expect(projectSchema.safeParse({ ...base, qazsuRefUrl: 'not a url' }).success).toBe(false);
  });

  it('accepts null qazsu fields', () => {
    const result = projectSchema.safeParse({
      ...base,
      basin: null,
      waterObjectId: null,
      problemType: null,
      qazsuRefUrl: null,
      sourceCampaign: null,
    });
    expect(result.success).toBe(true);
  });
});

// ── Enum coverage / labels ──────────────────────────────────────────────────
describe('qazsu enum labels', () => {
  it('basinLabels covers all basin enum values', () => {
    for (const code of waterBasinValues) {
      expect(basinLabels[code]).toBeTruthy();
    }
  });

  it('problemLabels covers all problem enum values', () => {
    for (const code of waterProblemValues) {
      expect(problemLabels[code]).toBeTruthy();
    }
  });

  it('exposes 8 water basins', () => {
    expect(waterBasinValues).toHaveLength(8);
  });

  it('exposes expected source systems', () => {
    expect(sourceSystemValues).toEqual(['DIRECT', 'QAZSU', 'PARTNER']);
  });
});

// ── Service: createProject with Qazsu integration ───────────────────────────
describe('createProject (qazsu)', () => {
  const baseData = {
    title: 'Тест',
    description: 'a'.repeat(100),
    type: 'RESEARCH' as const,
    schoolName: 'Школа',
    region: 'ALMATY_REGION' as const,
    teacherName: 'Учитель',
    grade: 9,
  };

  it('defaults sourceSystem to DIRECT when not provided', async () => {
    p.project.findFirst.mockResolvedValue(null);
    p.user.findUnique.mockResolvedValue({ email: null, name: 'Учитель' });
    p.project.create.mockImplementation(async (args: unknown) => (args as { data: object }).data);

    await createProject('user-1', baseData);

    const args = p.project.create.mock.calls[0][0] as { data: { sourceSystem: string } };
    expect(args.data.sourceSystem).toBe('DIRECT');
  });

  it('respects explicit sourceSystem=QAZSU', async () => {
    p.project.findFirst.mockResolvedValue(null);
    p.user.findUnique.mockResolvedValue({ email: null, name: 'Учитель' });
    p.project.create.mockImplementation(async (args: unknown) => (args as { data: object }).data);

    await createProject('user-1', { ...baseData, sourceSystem: 'QAZSU' });

    const args = p.project.create.mock.calls[0][0] as { data: { sourceSystem: string } };
    expect(args.data.sourceSystem).toBe('QAZSU');
  });

  it('builds qazsuSnapshot when waterObjectId resolves', async () => {
    p.project.findFirst.mockResolvedValue(null);
    p.user.findUnique.mockResolvedValue({ email: null, name: 'Учитель' });
    p.project.create.mockImplementation(async (args: unknown) => (args as { data: object }).data);
    p.waterObject.findUnique.mockResolvedValue({
      id: 'ili-river',
      name: 'Иле',
      nameKz: 'Іле',
      basin: 'BALKHASH_ALAKOL',
      type: 'RIVER',
      region: 'ALMATY_REGION',
    });

    await createProject('user-1', {
      ...baseData,
      sourceSystem: 'QAZSU',
      waterObjectId: 'ili-river',
    });

    const args = p.project.create.mock.calls[0][0] as {
      data: {
        waterObjectId: string;
        basin: string | null;
        qazsuSnapshot: { waterObjectId: string; basin: string; capturedAt: string };
      };
    };
    expect(args.data.waterObjectId).toBe('ili-river');
    // basin auto-derived from WaterObject when client did not pass it
    expect(args.data.basin).toBe('BALKHASH_ALAKOL');
    expect(args.data.qazsuSnapshot.waterObjectId).toBe('ili-river');
    expect(args.data.qazsuSnapshot.basin).toBe('BALKHASH_ALAKOL');
    expect(typeof args.data.qazsuSnapshot.capturedAt).toBe('string');
  });

  it('throws BAD_REQUEST when waterObjectId not found', async () => {
    p.project.findFirst.mockResolvedValue(null);
    p.waterObject.findUnique.mockResolvedValue(null);

    await expect(
      createProject('user-1', { ...baseData, waterObjectId: 'unknown-id' }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' });
  });

  it('does not call waterObject.findUnique when waterObjectId is missing', async () => {
    p.project.findFirst.mockResolvedValue(null);
    p.user.findUnique.mockResolvedValue({ email: null, name: 'Учитель' });
    p.project.create.mockImplementation(async (args: unknown) => (args as { data: object }).data);

    await createProject('user-1', baseData);

    expect(p.waterObject.findUnique).not.toHaveBeenCalled();
  });

  it('explicit basin overrides waterObject basin', async () => {
    p.project.findFirst.mockResolvedValue(null);
    p.user.findUnique.mockResolvedValue({ email: null, name: 'Учитель' });
    p.project.create.mockImplementation(async (args: unknown) => (args as { data: object }).data);
    p.waterObject.findUnique.mockResolvedValue({
      id: 'ili-river',
      name: 'Иле',
      nameKz: 'Іле',
      basin: 'BALKHASH_ALAKOL',
      type: 'RIVER',
      region: 'ALMATY_REGION',
    });

    await createProject('user-1', {
      ...baseData,
      basin: 'IRTYSH',
      waterObjectId: 'ili-river',
    });

    const args = p.project.create.mock.calls[0][0] as { data: { basin: string } };
    expect(args.data.basin).toBe('IRTYSH');
  });
});
