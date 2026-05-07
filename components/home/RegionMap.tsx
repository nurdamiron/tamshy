'use client';

import { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const GEO_URL = '/kz-all.topo.json';

const REGION_NAMES: Record<string, string> = {
  'Aqmola': 'Ақмола обл.',
  'Aqtöbe': 'Ақтөбе обл.',
  'Almaty': 'Алматы обл.',
  'Atyrau': 'Атырау обл.',
  'Batys Qazaqstan': 'Батыс Қазақстан обл.',
  'Jambyl': 'Жамбыл обл.',
  'Qarağandy': 'Қарағанды обл.',
  'Qostanai': 'Қостанай обл.',
  'Qyzylorda': 'Қызылорда обл.',
  'Mañğystau': 'Маңғыстау обл.',
  'Pavlodar': 'Павлодар обл.',
  'Soltüstık Qazaqstan': 'Солтүстік Қазақстан обл.',
  'Türkıstan': 'Түркістан обл.',
  'Şığıs Qazaqstan': 'Шығыс Қазақстан обл.',
  'Abai': 'Абай обл.',
  'Jetısu': 'Жетісу обл.',
  'Ulıtaw': 'Ұлытау обл.',
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
  'Astana qalasy': 'Есіл өзенінің ластануы',
  'Almaty qalasy': 'Ауыз су тапшылығы',
  'Almaty': 'Тянь-Шань мұздықтарының еруі',
  'Şymkent qalasy': 'Топырақтың тұздануы',
  'Atyrau': 'Каспийдің мұнаймен ластануы',
  'Mañğystau': 'Тұщы су жетіспеушілігі',
  'Qyzylorda': 'Арал теңізінің кеуіп кетуі',
  'Qarağandy': 'Нұра өзенінің ластануы',
  'Pavlodar': 'Ертіс өзенінің ластануы',
  'Şığıs Qazaqstan': 'Экологиялық зардаптар',
  'Batys Qazaqstan': 'Орал өзенінің ластануы',
  'Jambyl': 'Көлдердің тайыздауы',
  'Türkıstan': 'Сырдарияның суармасы',
  'Soltüstık Qazaqstan': 'Есіл өзенінің тасқыны',
  'Qostanai': 'Құрғақшылық және топырақ эрозиясы',
  'Aqtöbe': 'Шағын өзендердің кеуіп кетуі',
  'Abai': 'Радиоактивті ластану',
  'Jetısu': 'Балқаш көлінің тайыздауы',
  'Ulıtaw': 'Су жабдықтаудың тапшылығы',
  'Aqmola': 'Жер асты суларының сапасы',
};

const CITY_MARKERS: { regionKey: string; coordinates: [number, number]; projects: number }[] = [
  { regionKey: 'ASTANA', coordinates: [71.434467, 51.125762], projects: 45 },
  { regionKey: 'ALMATY', coordinates: [76.95, 43.24], projects: 62 },
  { regionKey: 'SHYMKENT', coordinates: [69.6, 42.32], projects: 28 },
];

interface TooltipData {
  name: string;
  issue: string;
  x: number;
  y: number;
}

const MapContent = memo(function MapContent({ regionNameFn, projectsWord, cityNameFn }: { regionNameFn: (rawName: string) => string; projectsWord: string; cityNameFn: (key: string) => string }) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const handleMouseEnter = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (geo: any, event: React.MouseEvent) => {
      const rawName = geo.properties.name;
      const name = regionNameFn(rawName);
      const issue = WATER_ISSUES[rawName] || '';
      setHoveredRegion(rawName);
      setTooltip({ name, issue, x: event.clientX, y: event.clientY });
    },
    [regionNameFn]
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
                        fill: isHovered ? '#60A5FA' : '#DBEAFE',
                        stroke: '#93C5FD',
                        strokeWidth: 0.6,
                        outline: 'none',
                        transition: 'fill 0.3s ease',
                      },
                      hover: {
                        fill: '#60A5FA',
                        stroke: '#3B82F6',
                        strokeWidth: 0.8,
                        outline: 'none',
                        cursor: 'pointer',
                        filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))',
                      },
                      pressed: {
                        fill: '#3B82F6',
                        stroke: '#2563EB',
                        strokeWidth: 0.8,
                        outline: 'none',
                      },
                    }}
                  />
                </Link>
              );
            })
          }
        </Geographies>

        {/* City markers with pulsing rings */}
        {CITY_MARKERS.map(({ regionKey, coordinates, projects }, i) => (
          <Marker key={regionKey} coordinates={coordinates}>
            {/* Pulsing ring */}
            <circle r={12} fill="#0284C7" fillOpacity={0} stroke="#0284C7" strokeWidth={1.5} className="animate-pulse-ring" style={{ animationDelay: `${i * 0.4}s` }} />
            <circle r={12} fill="#0284C7" fillOpacity={0.1} />
            <circle r={6} fill="#0284C7" stroke="#fff" strokeWidth={2} />
            <text
              textAnchor="middle"
              y={-18}
              style={{
                fontSize: 11,
                fontWeight: 600,
                fill: '#1E3A5F',
                fontFamily: 'Onest, sans-serif',
              }}
            >
              {cityNameFn(regionKey)}
            </text>
            <text
              textAnchor="middle"
              y={-6}
              style={{
                fontSize: 8,
                fill: '#0284C7',
                fontFamily: 'Onest, sans-serif',
              }}
            >
              {projects} {projectsWord}
            </text>
          </Marker>
        ))}
      </ComposableMap>

      {/* Floating tooltip with animation */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            className="fixed z-50 pointer-events-none"
            style={{ left: tooltip.x + 16, top: tooltip.y - 16 }}
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <div className="bg-[#0F172A] text-white px-4 py-2.5 rounded-xl shadow-2xl text-[13px] whitespace-nowrap border border-white/10">
              <div className="font-semibold">{tooltip.name}</div>
              {tooltip.issue && (
                <div className="text-white/60 text-[11px] mt-0.5 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                  {tooltip.issue}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

export default function RegionMap() {
  const t = useTranslations('regionMap');
  const tRegions = useTranslations('regions');

  const regionNameFn = useCallback((rawName: string) => {
    const enumKey = REGION_TO_ENUM[rawName];
    if (enumKey) {
      try { return tRegions(enumKey); } catch { /* fallback */ }
    }
    return REGION_NAMES[rawName] || rawName;
  }, [tRegions]);

  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10"
        >
          <span className="text-caption text-[#0284C7] tracking-widest">{t('caption')}</span>
          <h2 className="text-[28px] sm:text-[36px] font-bold text-[#0F172A] mt-3">
            {t('title')}
          </h2>
          <p className="text-[15px] text-[#64748B] mt-3 max-w-lg mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-white rounded-2xl border border-[#E2E8F0]/60 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)]"
        >
          {/* Radial gradient overlay for depth */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(248,250,252,0.6)_100%)] z-10" />

          <div className="p-4 sm:p-6">
            <MapContent regionNameFn={regionNameFn} projectsWord={t('projectsWord')} cityNameFn={(key: string) => tRegions(key)} />
          </div>

          {/* Legend */}
          <motion.div
            className="flex flex-wrap items-center gap-5 px-6 py-4 border-t border-[#E2E8F0]/60 bg-[#F8FAFC]/50"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-3 rounded-sm bg-[#DBEAFE] border border-[#93C5FD]" />
              <span className="text-[12px] text-[#64748B]">{t('regionLegend')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#0284C7] relative">
                <div className="absolute inset-0 rounded-full bg-[#0284C7] animate-ping opacity-30" />
              </div>
              <span className="text-[12px] text-[#64748B]">{t('cityLegend')}</span>
            </div>
            <div className="text-[12px] text-[#64748B] ml-auto font-medium">
              {t('regionsCount')}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
