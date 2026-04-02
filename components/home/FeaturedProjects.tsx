'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import ProjectCard from '@/components/project/ProjectCard';

const fallbackProjects = [
  {
    id: '1',
    title: 'Система сбора дождевой воды для школы',
    description: 'Проект по установке системы сбора и фильтрации дождевой воды на территории школы. Позволяет экономить до 30% воды.',
    type: 'INVENTION',
    status: 'APPROVED',
    region: 'ASTANA',
    schoolName: 'Школа No45',
    grade: 9,
    teacherName: '',
    authorName: 'Алмас К.',
    voteCount: 142,
    createdAt: '2026-03-15',
  },
  {
    id: '2',
    title: 'Документальный фильм о реке Или',
    description: 'Короткометражный фильм о состоянии реки Или и её значении для экосистемы. Интервью с экологами.',
    type: 'VIDEO',
    status: 'APPROVED',
    region: 'ALMATY',
    schoolName: 'Гимназия No125',
    grade: 10,
    teacherName: '',
    authorName: 'Дана М.',
    voteCount: 98,
    createdAt: '2026-03-20',
  },
  {
    id: '3',
    title: 'Исследование качества воды в Каспийском море',
    description: 'Комплексное исследование pH, солёности и загрязнённости воды в прибрежной зоне Актау.',
    type: 'RESEARCH',
    status: 'WINNER',
    region: 'MANGYSTAU',
    schoolName: 'НИШ Актау',
    grade: 11,
    teacherName: '',
    authorName: 'Арман Т.',
    voteCount: 215,
    createdAt: '2026-03-10',
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
  author: { name: string | null };
  _count: { votes: number };
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 260, damping: 20 },
  },
};

export default function FeaturedProjects() {
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
              authorName: p.author?.name || 'Автор',
              voteCount: p._count?.votes || 0,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <span className="text-caption text-[#0284C7] tracking-widest">ИЗБРАННОЕ</span>
            <h2 className="text-[28px] sm:text-[32px] font-bold text-[#0F172A] mt-3">
              Лучшие проекты
            </h2>
            <p className="text-[15px] text-[#64748B] mt-2">
              Проекты с наибольшим количеством голосов
            </p>
          </div>
          <Link href="/projects" className="hidden sm:block">
            <Button variant="secondary" size="sm">
              Смотреть все
            </Button>
          </Link>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {projects.map((project) => (
            <motion.div key={project.id} variants={cardVariants}>
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-8 text-center sm:hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link href="/projects">
            <Button variant="secondary" className="w-full">
              Смотреть все проекты
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
