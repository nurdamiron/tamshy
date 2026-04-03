'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Badge from '@/components/ui/Badge';
import { regionLabels } from '@/lib/validators';
import { useTranslations } from 'next-intl';

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    type: string;
    status: string;
    region: string;
    schoolName: string;
    grade: number;
    authorName?: string;
    voteCount: number;
    createdAt: string;
    thumbnailUrl?: string | null;
  };
  rank?: number;
}

const typeToBadge: Record<string, 'video' | 'research' | 'art' | 'invention' | 'app' | 'other'> = {
  VIDEO: 'video', RESEARCH: 'research', ART: 'art',
  INVENTION: 'invention', APP: 'app', OTHER: 'other',
};

const typeGradients: Record<string, string> = {
  VIDEO: 'from-blue-500 to-blue-600',
  RESEARCH: 'from-purple-500 to-purple-600',
  ART: 'from-amber-500 to-orange-500',
  INVENTION: 'from-orange-500 to-red-500',
  APP: 'from-teal-500 to-emerald-500',
  OTHER: 'from-gray-400 to-gray-500',
};

const typeIcons: Record<string, JSX.Element> = {
  VIDEO: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.8">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" />
    </svg>
  ),
  RESEARCH: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.8">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  ART: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.8">
      <circle cx="13.5" cy="6.5" r="2.5" />
      <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  ),
  INVENTION: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.8">
      <path d="M12 2v1M4.22 4.22l.7.7M1 12h1M4.22 19.78l.7-.7M20.78 19.78l-.7-.7M23 12h-1M19.78 4.22l-.7.7" />
      <circle cx="12" cy="12" r="5" />
      <path d="M9 18h6M10 22h4" />
    </svg>
  ),
  APP: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.8">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12" y2="18" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  OTHER: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.8">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
};

const rankColors: Record<number, { bg: string; text: string; border: string }> = {
  1: { bg: 'bg-gradient-to-br from-[#F59E0B] to-[#D97706]', text: 'text-white', border: 'border-[#F59E0B]' },
  2: { bg: 'bg-gradient-to-br from-[#94A3B8] to-[#64748B]', text: 'text-white', border: 'border-[#94A3B8]' },
  3: { bg: 'bg-gradient-to-br from-[#D97706] to-[#B45309]', text: 'text-white', border: 'border-[#D97706]' },
};

export default function ProjectCard({ project, rank }: ProjectCardProps) {
  const tTypes = useTranslations('types');
  const tCommon = useTranslations('common');
  const tRegions = useTranslations('regions');
  const isGlow = rank === 1;

  return (
    <Link href={`/projects/${project.id}`}>
      <motion.div
        className={`group relative bg-white rounded-2xl overflow-hidden h-full flex flex-col cursor-pointer border border-[#E2E8F0]/60 transition-all duration-300 ${
          isGlow
            ? 'shadow-[0_0_40px_rgba(2,132,199,0.12),0_4px_16px_rgba(0,0,0,0.04)]'
            : 'shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)]'
        }`}
        whileHover={{
          y: -6,
          boxShadow: isGlow
            ? '0 0 50px rgba(2,132,199,0.18), 0 20px 40px rgba(0,0,0,0.08)'
            : '0 20px 40px rgba(0,0,0,0.08), 0 8px 16px rgba(0,0,0,0.04)',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {/* Gradient thumbnail OR Image */}
        {project.thumbnailUrl ? (
          <div className="relative h-[150px] flex items-center justify-center overflow-hidden">
            <img src={project.thumbnailUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            
            {/* Rank badge */}
            {rank && rank <= 3 && (
              <motion.div
                className={`absolute top-3 left-3 w-8 h-8 rounded-full ${rankColors[rank].bg} ${rankColors[rank].text} flex items-center justify-center text-[13px] font-bold shadow-lg z-20`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 400 }}
              >
                {rank}
              </motion.div>
            )}

            {/* Winner badge */}
            {project.status === 'WINNER' && (
              <div className="absolute top-3 right-3 bg-white/30 backdrop-blur-md rounded-full px-2.5 py-1 flex items-center gap-1 z-20 shadow-sm border border-white/20">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#F5A623">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="text-[10px] font-bold text-white shadow-sm">WINNER</span>
              </div>
            )}
          </div>
        ) : (
          <div className={`relative bg-gradient-to-br ${typeGradients[project.type] || typeGradients.OTHER} h-[130px] flex items-center justify-center overflow-hidden`}>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.06]">
              <div className="absolute top-2 right-2 w-20 h-20 rounded-full border border-white/40" />
              <div className="absolute bottom-2 left-2 w-14 h-14 rounded-full border border-white/30" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-white/20" />
            </div>

            {/* Type icon */}
            <motion.div
              className="relative z-10 w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center"
              whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.4 }}
            >
              {typeIcons[project.type] || typeIcons.OTHER}
            </motion.div>

            {/* Rank badge */}
            {rank && rank <= 3 && (
              <motion.div
                className={`absolute top-3 left-3 w-8 h-8 rounded-full ${rankColors[rank].bg} ${rankColors[rank].text} flex items-center justify-center text-[13px] font-bold shadow-lg`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 400 }}
              >
                {rank}
              </motion.div>
            )}

            {/* Winner badge */}
            {project.status === 'WINNER' && (
              <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#F5A623">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="text-[10px] font-bold text-white">WINNER</span>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="mb-3">
            <Badge variant={typeToBadge[project.type] || 'other'}>
              {tTypes(project.type)}
            </Badge>
          </div>

          <h3 className="text-[15px] font-semibold text-[#0F172A] mb-2 line-clamp-2 leading-snug group-hover:text-[#0284C7] transition-colors duration-300">
            {project.title}
          </h3>

          <p className="text-[13px] text-[#64748B] line-clamp-2 mb-4 flex-1 leading-relaxed">
            {project.description}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between text-[12px] text-[#64748B] pt-3 border-t border-[#E2E8F0]/60">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-1">
                <div className="w-5 h-5 rounded-full bg-[#E0F2FE] flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2.5">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                {project.authorName || tCommon('defaultAuthor')}
              </span>
              <span className="text-[#E2E8F0]">|</span>
              <span>{tRegions(project.region) || regionLabels[project.region] || project.region}</span>
            </div>
            <motion.span
              className="flex items-center gap-1 font-semibold text-[#0284C7]"
              whileHover={{ scale: 1.1 }}
            >
              <motion.svg
                width="14" height="14" viewBox="0 0 24 24" fill="#0284C7" fillOpacity="0.2" stroke="#0284C7" strokeWidth="1.5"
                whileHover={{ scale: 1.2, fill: '#0284C7', fillOpacity: 0.6 }}
                transition={{ duration: 0.2 }}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </motion.svg>
              {project.voteCount}
            </motion.span>
          </div>
        </div>

        {/* Hover gradient border */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#0284C7]/15 transition-colors duration-300 pointer-events-none" />
      </motion.div>
    </Link>
  );
}
