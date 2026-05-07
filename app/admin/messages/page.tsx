'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  fileUrl: string | null;
  createdAt: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchMessages = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/contacts?page=${p}`);
      if (!res.ok) throw new Error('Ошибка загрузки');
      const data = await res.json();
      setMessages(data.messages || []);
      setTotal(data.total ?? 0);
      setTotalPages(data.pages ?? 1);
      setPage(p);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages(1);
  }, [fetchMessages]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 animate-pulse">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-100 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600 font-medium">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-3 text-[13px] text-red-500 hover:text-red-700 underline">
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* header */}
      <div>
        <h1 className="text-xl font-bold text-[#0F172A]">Сообщения</h1>
        <p className="text-[13px] text-slate-500 mt-0.5">
          Всего: {total} сообщений из формы обратной связи
        </p>
      </div>

      {/* table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-[13px]">
            Сообщений пока нет
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-5 py-3 font-semibold text-slate-500">Имя</th>
                  <th className="px-5 py-3 font-semibold text-slate-500">Email</th>
                  <th className="px-5 py-3 font-semibold text-slate-500">Тема</th>
                  <th className="px-5 py-3 font-semibold text-slate-500">Сообщение</th>
                  <th className="px-5 py-3 font-semibold text-slate-500">Дата</th>
                  <th className="px-5 py-3 font-semibold text-slate-500 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg, i) => (
                  <motion.tr
                    key={msg.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-t border-[#E2E8F0] hover:bg-slate-50/60 transition-colors cursor-pointer"
                    onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
                  >
                    <td className="px-5 py-3 font-medium text-slate-700 whitespace-nowrap">
                      {msg.name}
                    </td>
                    <td className="px-5 py-3 text-slate-500">{msg.email}</td>
                    <td className="px-5 py-3 text-slate-500">{msg.topic}</td>
                    <td className="px-5 py-3 text-slate-500 max-w-[300px] truncate">
                      {msg.message}
                    </td>
                    <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(msg.createdAt).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-5 py-3">
                      <motion.div
                        animate={{ rotate: expandedId === msg.id ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-slate-400">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </motion.div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => fetchMessages(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1.5 text-[13px] rounded-lg border border-[#E2E8F0] disabled:opacity-40 hover:bg-slate-50"
          >
            ← Назад
          </button>
          <span className="text-[13px] text-slate-500">{page} / {totalPages}</span>
          <button
            onClick={() => fetchMessages(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1.5 text-[13px] rounded-lg border border-[#E2E8F0] disabled:opacity-40 hover:bg-slate-50"
          >
            Вперёд →
          </button>
        </div>
      )}

      {/* expanded message overlay */}
      <AnimatePresence>
        {expandedId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setExpandedId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              {(() => {
                const msg = messages.find((m) => m.id === expandedId);
                if (!msg) return null;
                return (
                  <div
                    className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
                      <h3 className="text-lg font-semibold text-[#0F172A]">Сообщение</h3>
                      <button
                        onClick={() => setExpandedId(null)}
                        className="text-slate-400 hover:text-slate-700 transition-colors p-1"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Имя</p>
                          <p className="text-[14px] text-slate-700 font-medium">{msg.name}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                          <p className="text-[14px] text-slate-700">{msg.email}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Тема</p>
                        <p className="text-[14px] text-slate-700">{msg.topic}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Сообщение</p>
                        <p className="text-[14px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      </div>
                      {msg.fileUrl && (
                        <div>
                          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Файл</p>
                          <a
                            href={msg.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[13px] text-blue-600 hover:text-blue-700 underline"
                          >
                            Скачать файл
                          </a>
                        </div>
                      )}
                      <div>
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Дата</p>
                        <p className="text-[14px] text-slate-500">
                          {new Date(msg.createdAt).toLocaleString('ru-RU')}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
