import Link from 'next/link';
import Badge, { getTypeLabel } from '@/components/ui/Badge';
import { regionLabels } from '@/lib/validators';

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
  };
}

const typeToBadge: Record<string, 'video' | 'research' | 'art' | 'invention' | 'app' | 'other'> = {
  VIDEO: 'video',
  RESEARCH: 'research',
  ART: 'art',
  INVENTION: 'invention',
  APP: 'app',
  OTHER: 'other',
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <div className="card p-5 h-full flex flex-col cursor-pointer">
        {/* Top row: badge + status */}
        <div className="flex items-center justify-between mb-3">
          <Badge variant={typeToBadge[project.type] || 'other'}>
            {getTypeLabel(project.type)}
          </Badge>
          {project.status === 'WINNER' && (
            <Badge variant="winner">
              <span className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                Победитель
              </span>
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 className="text-[16px] font-semibold text-[#111B17] mb-2 line-clamp-2 leading-snug">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-[13px] text-[#5A7A6E] line-clamp-2 mb-4 flex-1">
          {project.description}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-[12px] text-[#5A7A6E] pt-3 border-t border-[#E2EDE9]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {project.authorName || 'Автор'}
            </span>
            <span className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {regionLabels[project.region] || project.region}
            </span>
          </div>
          <span className="flex items-center gap-1 font-medium text-[#1D9E75]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {project.voteCount}
          </span>
        </div>
      </div>
    </Link>
  );
}
