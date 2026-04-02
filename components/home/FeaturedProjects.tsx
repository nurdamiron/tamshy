'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import ProjectCard from '@/components/project/ProjectCard';

const placeholderProjects = [
  {
    id: '1',
    title: 'Система сбора дождевой воды для школы',
    description: 'Проект по установке системы сбора и фильтрации дождевой воды на территории школы No45 г. Астаны. Позволяет экономить до 30% воды.',
    type: 'INVENTION' as const,
    status: 'APPROVED' as const,
    region: 'ASTANA' as const,
    schoolName: 'Школа No45',
    grade: 9,
    teacherName: 'Айгуль Сериковна',
    authorName: 'Алмас К.',
    voteCount: 142,
    createdAt: '2026-03-15',
  },
  {
    id: '2',
    title: 'Документальный фильм о реке Или',
    description: 'Короткометражный фильм о состоянии реки Или и её значении для экосистемы региона. Интервью с экологами и местными жителями.',
    type: 'VIDEO' as const,
    status: 'APPROVED' as const,
    region: 'ALMATY' as const,
    schoolName: 'Гимназия No125',
    grade: 10,
    teacherName: 'Бакытжан Серикович',
    authorName: 'Дана М.',
    voteCount: 98,
    createdAt: '2026-03-20',
  },
  {
    id: '3',
    title: 'Исследование качества воды в Каспийском море',
    description: 'Комплексное исследование pH, солёности и загрязнённости воды в прибрежной зоне Актау. Пробы из 12 точек побережья.',
    type: 'RESEARCH' as const,
    status: 'WINNER' as const,
    region: 'MANGYSTAU' as const,
    schoolName: 'НИШ Актау',
    grade: 11,
    teacherName: 'Марат Нурланович',
    authorName: 'Арман Т.',
    voteCount: 215,
    createdAt: '2026-03-10',
  },
];

export default function FeaturedProjects() {
  return (
    <section className="py-20 bg-[#F8FAF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <span className="text-caption text-[#1D9E75] tracking-widest">ИЗБРАННОЕ</span>
            <h2 className="text-[28px] sm:text-[32px] font-bold text-[#111B17] mt-3">
              Лучшие проекты
            </h2>
            <p className="text-[15px] text-[#5A7A6E] mt-2">
              Проекты с наибольшим количеством голосов
            </p>
          </div>
          <Link href="/projects" className="hidden sm:block">
            <Button variant="secondary" size="sm">
              Смотреть все
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {placeholderProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/projects">
            <Button variant="secondary" className="w-full">
              Смотреть все проекты
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
