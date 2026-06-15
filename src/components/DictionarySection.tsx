'use client';

import { useState } from 'react';
import { DICTIONARY } from '@/lib/data';

const LETTERS = ['G', 'S', 'Y', 'J', 'R', 'C', 'B', 'K', 'Z'];

export default function DictionarySection() {
  const [search, setSearch] = useState('');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [openTerms, setOpenTerms] = useState<Set<number>>(new Set());

  const toggleTerm = (idx: number) => {
    setOpenTerms(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const filtered = DICTIONARY.filter(t => {
    if (activeLetter && t.term[0] !== activeLetter) return false;
    if (search && !t.term.includes(search) && !t.definition.includes(search) && !t.narrativeUsage.includes(search)) return false;
    return true;
  });

  return (
    <div>
      <div className="section-header">
        <h2>术语词典</h2>
        <p className="desc">12个核心术语，构成光体文明认知体系的语义基座</p>
      </div>

      <div className="card">
        <input
          type="text"
          placeholder="搜索术语..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${!activeLetter ? 'bg-gold-500 text-white' : 'bg-surface-700 text-text-muted hover:text-text-primary'}`}
            onClick={() => setActiveLetter(null)}
          >
            全部
          </button>
          {LETTERS.map(l => (
            <button
              key={l}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${activeLetter === l ? 'bg-gold-500 text-white' : 'bg-surface-700 text-text-muted hover:text-text-primary'}`}
              onClick={() => setActiveLetter(l === activeLetter ? null : l)}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div>
        {filtered.map((t, idx) => (
          <div key={idx} className={`term-card ${openTerms.has(idx) ? 'open' : ''}`}>
            <div className="term-header" onClick={() => toggleTerm(idx)}>
              <div className="flex items-center gap-3">
                <span className="badge badge-cyan">{t.term[0]}</span>
                <span className="font-semibold text-text-primary">{t.term}</span>
                <span className="text-text-muted text-xs">{t.pinyin}</span>
              </div>
              <span className={`text-text-muted transition-transform ${openTerms.has(idx) ? 'rotate-180' : ''}`}>▼</span>
            </div>
            <div className="term-body">
              <div>
                <p className="text-gold-500 text-xs font-semibold uppercase tracking-wider">定义</p>
                <p className="text-text-secondary text-sm mt-1">{t.definition}</p>
              </div>
              <div>
                <p className="text-gold-500 text-xs font-semibold uppercase tracking-wider">类比</p>
                <p className="text-text-secondary text-sm mt-1">{t.analogy}</p>
              </div>
              <div>
                <p className="text-gold-500 text-xs font-semibold uppercase tracking-wider">叙事用法</p>
                <p className="text-text-secondary text-sm mt-1">{t.narrativeUsage}</p>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-text-muted">未找到匹配的术语</div>
        )}
      </div>
    </div>
  );
}
