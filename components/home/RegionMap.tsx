'use client';

import { useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';
import Link from 'next/link';

const GEO_URL = '/kz-all.topo.json';

const REGION_NAMES: Record<string, string> = {
  'Aqmola': 'Акмолинская обл.',
  'Aqtöbe': 'Актобе',
  'Almaty': 'Алматинская обл.',
  'Atyrau': 'Атырау',
  'Batys Qazaqstan': 'Западно-Казахстанская обл.',
  'Jambyl': 'Жамбылская обл.',
  'Qarağandy': 'Карагандинская обл.',
  'Qostanai': 'Костанайская обл.',
  'Qyzylorda': 'Кызылординская обл.',
  'Mañğystau': 'Мангистауская обл.',
  'Pavlodar': 'Павлодарская обл.',
  'Soltüstık Qazaqstan': 'Северо-Казахстанская обл.',
  'Türkıstan': 'Туркестанская обл.',
  'Şığıs Qazaqstan': 'Восточно-Казахстанская обл.',
  'Abai': 'Область Абай',
  'Jetısu': 'Область Жетысу',
  'Ulıtaw': 'Область Улытау',
  'Astana qalasy': 'Астана',
  'Almaty qalasy': 'Алматы',
  'Şymkent qalasy': 'Шымкент',
};

const REGION_TO_ENUM: Record<string, string> = {
  'Astana qalasy': 'ASTANA',
  'Almaty qalasy': 'ALMATY',
  'Almaty': 'ALMATY_REGION',
  'Şymkent qalasy': 'SHYMKENT',
  'Aqtöbe': 'AKTOBE',
  'Qarağandy': 'KARAGANDA',
  'Mañğystau': 'MANGYSTAU',
  'Türkıstan': 'TURKESTAN',
  'Jambyl': 'ZHAMBYL',
  'Atyrau': 'ATYRAU',
  'Pavlodar': 'PAVLODAR',
  'Şığıs Qazaqstan': 'SEMEY',
  'Qyzylorda': 'KYZYLORDA',
  'Soltüstık Qazaqstan': 'PETROPAVLOVSK',
  'Batys Qazaqstan': 'ORAL',
  'Qostanai': 'KOSTANAY',
  'Jetısu': 'TALDYKORGAN',
  'Abai': 'SEMEY',
  'Ulıtaw': 'KARAGANDA',
  'Aqmola': 'ASTANA',
};

const WATER_ISSUES: Record<string, string> = {
  'Astana qalasy': 'Загрязнение реки Есиль',
  'Almaty qalasy': 'Дефицит питьевой воды',
  'Almaty': 'Таяние ледников Тянь-Шаня',
  'Şymkent qalasy': 'Засоление почв',
  'Atyrau': 'Загрязнение Каспия нефтью',
  'Mañğystau': 'Нехватка пресной воды',
  'Qyzylorda': 'Высыхание Аральского моря',
  'Qarağandy': 'Загрязнение реки Нура',
  'Pavlodar': 'Загрязнение Иртыша',
  'Şığıs Qazaqstan': 'Экологические последствия',
  'Batys Qazaqstan': 'Загрязнение реки Урал',
  'Jambyl': 'Обмеление озёр',
  'Türkıstan': 'Ирригация Сырдарьи',
  'Soltüstık Qazaqstan': 'Паводки реки Ишим',
  'Qostanai': 'Засуха и эрозия почв',
  'Aqtöbe': 'Пересыхание малых рек',
  'Abai': 'Радиоактивное загрязнение',
  'Jetısu': 'Обмеление озера Балхаш',
  'Ulıtaw': 'Дефицит водоснабжения',
  'Aqmola': 'Качество грунтовых вод',
};

const CITY_MARKERS: { name: string; coordinates: [number, number]; projects: number }[] = [
  { name: 'Астана', coordinates: [71.43, 51.13], projects: 45 },
  { name: 'Алматы', coordinates: [76.95, 43.24], projects: 62 },
  { name: 'Шымкент', coordinates: [69.6, 42.32], projects: 28 },
];

interface TooltipData {
  name: string;
  issue: string;
  x: number;
  y: number;
}

const MapContent = memo(function MapContent() {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const handleMouseEnter = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (geo: any, event: React.MouseEvent) => {
      const rawName = geo.properties.name;
      const name = REGION_NAMES[rawName] || rawName;
      const issue = WATER_ISSUES[rawName] || '';
      setHoveredRegion(rawName);
      setTooltip({ name, issue, x: event.clientX, y: event.clientY });
    },
    []
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      setTooltip((prev) =>
        prev ? { ...prev, x: event.clientX, y: event.clientY } : null
      );
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredRegion(null);
    setTooltip(null);
  }, []);

  return (
    <>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [67, 48.5], scale: 1300 }}
        width={900}
        height={480}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const rawName = geo.properties.name;
              const regionEnum = REGION_TO_ENUM[rawName];
              const isHovered = hoveredRegion === rawName;

              return (
                <Link
                  key={geo.rsmKey}
                  href={regionEnum ? `/projects?region=${regionEnum}` : '/projects'}
                >
                  <Geography
                    geography={geo}
                    onMouseEnter={(e) => handleMouseEnter(geo, e)}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      default: {
                        fill: '#DBEAFE',
                        stroke: '#93C5FD',
                        strokeWidth: 0.6,
                        outline: 'none',
                      },
                      hover: {
                        fill: '#60A5FA',
                        stroke: '#3B82F6',
                        strokeWidth: 0.8,
                        outline: 'none',
                        cursor: 'pointer',
                      },
                      pressed: {
                        fill: '#3B82F6',
                        stroke: '#2563EB',
                        strokeWidth: 0.8,
                        outline: 'none',
                      },
                    }}
                    className={isHovered ? '' : ''}
                  />
                </Link>
              );
            })
          }
        </Geographies>

        {/* City markers */}
        {CITY_MARKERS.map(({ name, coordinates, projects }) => (
          <Marker key={name} coordinates={coordinates}>
            <circle r={6} fill="#0284C7" stroke="#fff" strokeWidth={2} />
            <circle r={12} fill="#0284C7" fillOpacity={0.15} />
            <text
              textAnchor="middle"
              y={-16}
              style={{
                fontSize: 11,
                fontWeight: 600,
                fill: '#1E3A5F',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {name}
            </text>
            <text
              textAnchor="middle"
              y={-5}
              style={{
                fontSize: 8,
                fill: '#0284C7',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {projects} проектов
            </text>
          </Marker>
        ))}
      </ComposableMap>

      {/* Floating tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{ left: tooltip.x + 16, top: tooltip.y - 16 }}
        >
          <div className="bg-[#0F172A] text-white px-3.5 py-2 rounded-lg shadow-xl text-[13px] whitespace-nowrap">
            <div className="font-semibold">{tooltip.name}</div>
            {tooltip.issue && (
              <div className="text-white/60 text-[11px] mt-0.5">{tooltip.issue}</div>
            )}
          </div>
        </div>
      )}
    </>
  );
});

export default function RegionMap() {
  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-caption text-[#0284C7] tracking-widest">ГЕОГРАФИЯ</span>
          <h2 className="text-[28px] sm:text-[32px] font-bold text-[#0F172A] mt-3">
            Карта проектов
          </h2>
          <p className="text-[15px] text-[#64748B] mt-2 max-w-lg mx-auto">
            Наведите на регион, чтобы увидеть водные проблемы. Нажмите для просмотра проектов.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm"
        >
          <div className="p-4 sm:p-6">
            <MapContent />
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-5 px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC]/50">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-3 rounded-sm bg-[#DBEAFE] border border-[#93C5FD]" />
              <span className="text-[12px] text-[#64748B]">Регион</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#0284C7]" />
              <span className="text-[12px] text-[#64748B]">Города респ. значения</span>
            </div>
            <div className="text-[12px] text-[#64748B] ml-auto">
              20 регионов
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
