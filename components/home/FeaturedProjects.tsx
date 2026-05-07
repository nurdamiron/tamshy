'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';
import ProjectCard from '@/components/project/ProjectCard';
import { mediaUrl } from '@/lib/media';

const fallbackProjects = [
  {
    id: '1',
    title: 'Мектепке арналған жаңбыр суын жинаудың ақылды жүйесі',
    description: 'Жаңбыр суын жинау және сүзудің автоматтандырылған жүйесі. 3 сатылы сүзгі + 1200 л резервуар. 3 айда мектеп бағын суаруға 3000 л астам су жиналды.',
    type: 'INVENTION',
    status: 'WINNER',
    region: 'ASTANA',
    schoolName: 'Мектеп-гимназия №91, Астана',
    grade: 9,
    teacherName: 'Нурлан Сейткали',
    authorName: 'Алмас С.',
    voteCount: 187,
    createdAt: '2026-02-10',
    thumbnailUrl: mediaUrl('1507525428034-b723cf961d3e'),
  },
  {
    id: '2',
    title: '«Іленің дауысы» деректі фильмі',
    description: 'Іле өзенінің жайы туралы 18 минуттық фильм. 3 нүктеде дрон түсірілімі, гидрологтармен және балықшылармен сұхбат. 2 400 қарау, 3 қалалық іс-шарада көрсетілді.',
    type: 'VIDEO',
    status: 'WINNER',
    region: 'ALMATY',
    schoolName: 'НЗМ ФМБ, Алматы',
    grade: 10,
    teacherName: 'Айгул Бекова',
    authorName: 'Дана М.',
    voteCount: 214,
    createdAt: '2026-02-14',
    thumbnailUrl: mediaUrl('1437482078695-73f5ca6c96e2'),
  },
  {
    id: '3',
    title: 'Сырдария өзені суының сапасын зерттеу',
    description: '2 ай бойы 5 нүктеде сынама алынды. Марганец бойынша ШРК асқандығы анықталды. Нәтижелер Су ресурстары комитетіне берілді.',
    type: 'RESEARCH',
    status: 'WINNER',
    region: 'KYZYLORDA',
    schoolName: 'Мектеп №211, Қызылорда',
    grade: 11,
    teacherName: 'Гулнара Оразбекова',
    authorName: 'Арман Т.',
    voteCount: 156,
    createdAt: '2026-02-18',
    thumbnailUrl: mediaUrl('1498084393753-b411b2d26b34'),
  },
];

interface ApiProject {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  region: string;
  schoolName: string;
  grade: number;
  teacherName: string;
  createdAt: string;
  thumbnailUrl: string | null;
  author: { name: string | null };
  _count: { votes: number };
}

export default function FeaturedProjects() {
  const t = useTranslations('featured');
  const tCommon = useTranslations('common');
  const [projects, setProjects] = useState(fallbackProjects);

  useEffect(() => {
    fetch('/api/projects?sort=popular&page=1')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.projects?.length > 0) {
          setProjects(
            data.projects.slice(0, 3).map((p: ApiProject) => ({
              id: p.id,
              title: p.title,
              description: p.description,
              type: p.type,
              status: p.status,
              region: p.region,
              schoolName: p.schoolName,
              grade: p.grade,
              teacherName: p.teacherName,
              createdAt: p.createdAt,
              thumbnailUrl: p.thumbnailUrl,
              authorName: p.author?.name || tCommon('defaultAuthor'),
              voteCount: p._count?.votes || 0,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <span className="text-caption text-[#0284C7] tracking-widest">{t('caption')}</span>
            <h2 className="text-[28px] sm:text-[36px] font-bold text-[#0F172A] mt-3">
              {t('title')}
            </h2>
            <p className="text-[15px] text-[#64748B] mt-2">
              {t('subtitle')}
            </p>
          </div>
          <Link href="/projects" className="hidden sm:block">
            <Button variant="secondary" size="sm">
              {t('viewAll')}
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: i * 0.12, type: 'spring', stiffness: 260, damping: 20 }}
            >
              <ProjectCard project={project} rank={i + 1} />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-8 text-center sm:hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link href="/projects">
            <Button variant="secondary" className="w-full">
              {t('viewAllProjects')}
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
