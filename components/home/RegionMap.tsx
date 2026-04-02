'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { regionLabels } from '@/lib/validators';

const regionPositions: Record<string, { x: number; y: number }> = {
  ASTANA: { x: 55, y: 30 },
  ALMATY: { x: 72, y: 62 },
  SHYMKENT: { x: 52, y: 72 },
  AKTOBE: { x: 30, y: 38 },
  KARAGANDA: { x: 58, y: 42 },
  MANGYSTAU: { x: 15, y: 58 },
  TURKESTAN: { x: 45, y: 68 },
  ZHAMBYL: { x: 55, y: 65 },
  ALMATY_REGION: { x: 68, y: 55 },
  ATYRAU: { x: 18, y: 42 },
  AKTAU: { x: 12, y: 52 },
  PAVLODAR: { x: 68, y: 25 },
  SEMEY: { x: 75, y: 32 },
  TALDYKORGAN: { x: 75, y: 48 },
  KYZYLORDA: { x: 38, y: 58 },
  TARAZ: { x: 52, y: 62 },
  PETROPAVLOVSK: { x: 55, y: 15 },
  ORAL: { x: 20, y: 28 },
  KOSTANAY: { x: 40, y: 20 },
};

export default function RegionMap() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-[24px] font-semibold text-[#111B17] mb-2">
            География проектов
          </h2>
          <p className="text-[14px] text-[#5A7A6E] mb-8">
            Проекты из всех регионов Казахстана
          </p>
        </motion.div>

        <div className="relative w-full aspect-[2/1] bg-[#F8FAF9] rounded-xl border border-[#E2EDE9] overflow-hidden">
          {/* Simplified KZ outline */}
          <svg
            viewBox="0 0 100 80"
            className="w-full h-full"
            fill="none"
          >
            {/* Simplified Kazakhstan border */}
            <path
              d="M8 35 L15 18 L30 12 L45 10 L60 12 L75 15 L85 22 L88 35 L85 48 L80 58 L72 65 L60 70 L48 72 L35 68 L22 60 L12 50 L8 42 Z"
              fill="#E1F5EE"
              stroke="#1D9E75"
              strokeWidth="0.3"
              strokeOpacity="0.3"
            />

            {/* Region dots */}
            {Object.entries(regionPositions).map(([region, pos]) => (
              <Link key={region} href={`/regions?region=${region}`}>
                <g className="cursor-pointer">
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="1.8"
                    fill="#1D9E75"
                    className="transition-all hover:r-[2.5]"
                  />
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="3"
                    fill="#1D9E75"
                    fillOpacity="0.15"
                  />
                  <text
                    x={pos.x}
                    y={pos.y + 4.5}
                    textAnchor="middle"
                    className="text-[2.2px] fill-[#5A7A6E] font-medium"
                  >
                    {regionLabels[region]}
                  </text>
                </g>
              </Link>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}
