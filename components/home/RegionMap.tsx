'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { regionLabels } from '@/lib/validators';

interface RegionPoint {
  x: number;
  y: number;
  region: string;
  issue?: string;
}

const regionPoints: RegionPoint[] = [
  { x: 370, y: 100, region: 'ASTANA', issue: 'Загрязнение Есиля' },
  { x: 500, y: 220, region: 'ALMATY', issue: 'Дефицит воды в пригороде' },
  { x: 390, y: 260, region: 'SHYMKENT', issue: 'Засоление почв' },
  { x: 180, y: 130, region: 'AKTOBE', issue: 'Пересыхание малых рек' },
  { x: 380, y: 150, region: 'KARAGANDA', issue: 'Загрязнение Нуры' },
  { x: 60, y: 230, region: 'MANGYSTAU', issue: 'Опреснение морской воды' },
  { x: 310, y: 270, region: 'TURKESTAN', issue: 'Ирригация Сырдарьи' },
  { x: 400, y: 230, region: 'ZHAMBYL', issue: 'Обмеление озёр' },
  { x: 480, y: 200, region: 'ALMATY_REGION', issue: 'Таяние ледников' },
  { x: 95, y: 165, region: 'ATYRAU', issue: 'Загрязнение Каспия' },
  { x: 55, y: 200, region: 'AKTAU', issue: 'Нехватка пресной воды' },
  { x: 460, y: 80, region: 'PAVLODAR', issue: 'Загрязнение Иртыша' },
  { x: 520, y: 100, region: 'SEMEY', issue: 'Радиоактивное загрязнение' },
  { x: 520, y: 170, region: 'TALDYKORGAN', issue: 'Обмеление Балхаша' },
  { x: 240, y: 240, region: 'KYZYLORDA', issue: 'Высыхание Арала' },
  { x: 370, y: 240, region: 'TARAZ', issue: 'Загрязнение Таласа' },
  { x: 340, y: 50, region: 'PETROPAVLOVSK', issue: 'Паводки Ишима' },
  { x: 120, y: 90, region: 'ORAL', issue: 'Загрязнение Урала' },
  { x: 270, y: 60, region: 'KOSTANAY', issue: 'Засуха и эрозия' },
];

export default function RegionMap() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="py-20 bg-[#F8FAF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-caption text-[#1D9E75] tracking-widest">ГЕОГРАФИЯ</span>
          <h2 className="text-[28px] sm:text-[32px] font-bold text-[#111B17] mt-3">
            Карта проектов
          </h2>
          <p className="text-[15px] text-[#5A7A6E] mt-2 max-w-lg mx-auto">
            Водные проблемы и проекты из всех регионов Казахстана
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative w-full bg-white rounded-2xl border border-[#E2EDE9] overflow-hidden p-4 sm:p-6 shadow-sm"
        >
          <svg viewBox="0 0 600 320" className="w-full h-auto" fill="none">
            <path
              d="M45,180 L50,160 L55,140 L65,120 L80,100 L100,85 L120,75 L140,65 L165,58
                 L190,52 L210,48 L230,45 L255,42 L280,40 L305,38 L325,40 L345,38
                 L360,35 L375,38 L390,42 L410,45 L430,50 L450,55 L465,60 L480,68
                 L495,75 L510,85 L525,95 L535,108 L542,120 L548,135 L550,150
                 L548,165 L542,178 L535,190 L525,200 L515,210 L500,218 L485,225
                 L470,232 L455,238 L440,245 L425,252 L410,258 L395,263 L380,268
                 L365,270 L350,272 L335,270 L320,268 L305,265 L290,262 L275,258
                 L260,255 L245,250 L230,248 L215,245 L200,240 L185,235 L170,228
                 L155,220 L140,212 L125,205 L110,198 L95,192 L80,188 L65,185
                 L50,182 Z"
              fill="#E1F5EE"
              stroke="#1D9E75"
              strokeWidth="1.5"
              strokeOpacity="0.3"
            />

            <path d="M240,240 Q260,200 280,160 Q300,120 320,90" stroke="#1D9E75" strokeWidth="0.8" strokeOpacity="0.15" strokeDasharray="4 3" />
            <path d="M460,80 Q470,120 480,160 Q490,190 500,218" stroke="#1D9E75" strokeWidth="0.8" strokeOpacity="0.15" strokeDasharray="4 3" />
            <path d="M95,165 Q140,170 180,160 Q220,150 260,140" stroke="#1D9E75" strokeWidth="0.8" strokeOpacity="0.15" strokeDasharray="4 3" />

            <ellipse cx="215" cy="255" rx="18" ry="12" fill="#1D9E75" fillOpacity="0.06" stroke="#1D9E75" strokeWidth="0.5" strokeOpacity="0.15" />
            <text x="215" y="275" textAnchor="middle" className="text-[7px] fill-[#5A7A6E]/40">Арал</text>

            <path d="M40,140 Q35,170 38,200 Q40,230 45,260" stroke="#1D9E75" strokeWidth="1" strokeOpacity="0.1" fill="none" />

            <ellipse cx="490" cy="180" rx="25" ry="8" fill="#1D9E75" fillOpacity="0.06" stroke="#1D9E75" strokeWidth="0.5" strokeOpacity="0.15" />
            <text x="490" y="195" textAnchor="middle" className="text-[7px] fill-[#5A7A6E]/40">Балхаш</text>

            {regionPoints.map((point) => {
              const isHovered = hovered === point.region;
              return (
                <Link key={point.region} href={`/projects?region=${point.region}`}>
                  <g
                    className="cursor-pointer"
                    onMouseEnter={() => setHovered(point.region)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={isHovered ? 14 : 10}
                      fill="#1D9E75"
                      fillOpacity={isHovered ? 0.12 : 0.06}
                      className="transition-all duration-300"
                    />
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={isHovered ? 5 : 3.5}
                      fill={isHovered ? '#0F6E56' : '#1D9E75'}
                      className="transition-all duration-300"
                    />
                    <text
                      x={point.x}
                      y={point.y + (isHovered ? 22 : 16)}
                      textAnchor="middle"
                      className={`transition-all duration-300 ${
                        isHovered
                          ? 'text-[9px] fill-[#111B17] font-semibold'
                          : 'text-[7.5px] fill-[#5A7A6E] font-medium'
                      }`}
                    >
                      {regionLabels[point.region]}
                    </text>

                    {isHovered && point.issue && (
                      <>
                        <rect
                          x={point.x - 65}
                          y={point.y - 32}
                          width={130}
                          height={20}
                          rx={6}
                          fill="white"
                          stroke="#E2EDE9"
                          strokeWidth="0.5"
                          filter="url(#tooltipShadow)"
                        />
                        <text
                          x={point.x}
                          y={point.y - 18}
                          textAnchor="middle"
                          className="text-[7px] fill-[#1D9E75] font-medium"
                        >
                          {point.issue}
                        </text>
                      </>
                    )}
                  </g>
                </Link>
              );
            })}

            <defs>
              <filter id="tooltipShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.08" />
              </filter>
            </defs>
          </svg>

          <div className="flex flex-wrap items-center gap-5 mt-4 pt-4 border-t border-[#E2EDE9]">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1D9E75]" />
              <span className="text-[12px] text-[#5A7A6E]">Регион с проектами</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-5 border-t border-dashed border-[#1D9E75]/30" />
              <span className="text-[12px] text-[#5A7A6E]">Реки</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1D9E75]/10 border border-[#1D9E75]/20" />
              <span className="text-[12px] text-[#5A7A6E]">Водоёмы</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
