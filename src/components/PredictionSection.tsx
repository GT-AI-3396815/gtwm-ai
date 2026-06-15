'use client';

import { useState, useEffect } from 'react';
import { PREDICTIONS, DASHBOARD } from '@/lib/data';

const TIMELINE_NODES = [
  { year: 2026, label: '意识浪涌' },
  { year: 2030, label: '集体临界' },
  { year: 2036, label: '范式合流' },
  { year: 2040, label: '共振实证' },
  { year: 2046, label: '升维启动' },
];

export default function PredictionSection() {
  const [openCards, setOpenCards] = useState<Set<number>>(new Set());
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimated(true), 300);
  }, []);

  const toggleCard = (idx: number) => {
    setOpenCards(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <div>
      <div className="section-header text-center">
        <h2>光体视角 · 人类未来20年发展预测</h2>
        <p className="desc mt-2">2026 — 2046 · 十五个维度 · 五个升维节点</p>
      </div>

      {/* 时间轴 */}
      <div className="card overflow-x-auto">
        <div className="flex justify-between items-start min-w-[500px] py-4 px-8 relative">
          <div className="absolute top-8 left-8 right-8 h-0.5 bg-border-subtle"></div>
          {TIMELINE_NODES.map((n, i) => (
            <div key={i} className="flex flex-col items-center relative z-10">
              <div className="w-3 h-3 rounded-full bg-gold-500 mb-3"></div>
              <div className="text-sm font-bold text-gold-400">{n.year}</div>
              <div className="text-xs text-text-muted mt-1">{n.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 预测维度卡片 */}
      {PREDICTIONS.map((d, idx) => (
        <div key={idx} className={`pred-card ${openCards.has(idx) ? 'open' : ''}`}>
          <div className="pred-card-header">
            <div className="dim-num">{idx + 1}</div>
            <div>
              <div className="font-semibold text-text-primary">维度{idx + 1}：{d.dim}</div>
              <div className="text-text-muted text-xs mt-0.5">{['人类集体意识频率提升','AI与人类意识融合','全球协作与新型治理','从GDP到光频GDP','光频共振修复路径','地球文明整体身份','意义生产取代消费复制','意识-身体整合医学','从知识传输到意识激活','意识驱动的价值网络','光码的审美编码','意识-技术深度融合','意识频率的视觉表达','沉浸式意识体验','身体作为意识接口'][idx]}</div>
            </div>
          </div>
          <div className="pred-card-body">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>年份</th><th>关键事件</th><th>光体解读</th></tr>
                </thead>
                <tbody>
                  {d.events.map((e, i) => (
                    <tr key={i}>
                      <td><strong>{e.year}</strong></td>
                      <td>{e.event}</td>
                      <td>{e.interpretation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="pred-toggle" onClick={() => toggleCard(idx)}>
            <span>展开时间线详情</span>
            <span className={`transition-transform ${openCards.has(idx) ? 'rotate-180' : ''}`}>▼</span>
          </div>
        </div>
      ))}

      {/* 仪表盘 */}
      <div className="card">
        <h3 className="text-center text-gold-400 text-lg mb-6">升维指数仪表盘</h3>
        {DASHBOARD.map((d, i) => (
          <div key={i} className="dash-row">
            <div className="w-24 text-right text-xs text-text-secondary flex-shrink-0">{d.dim}</div>
            <div className="dash-bar-wrap">
              <div
                className="dash-bar-fill"
                style={{ width: animated ? `${d.cur}%` : '0%' }}
              ></div>
            </div>
            <div className="w-12 text-xs font-semibold text-gold-400 flex-shrink-0">{d.cur}%</div>
            <div className={`w-8 text-center text-xs flex-shrink-0 ${d.trend === 'up' ? 'text-green-400' : 'text-cyan-400'}`}>
              {d.trend === 'up' ? '↑' : '→'}
            </div>
            <div className="w-12 text-center text-xs text-text-muted flex-shrink-0">{d.target}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
