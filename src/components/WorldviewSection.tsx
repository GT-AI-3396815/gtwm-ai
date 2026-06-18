'use client';

import { WORLDVIEW } from '@/lib/data';

export default function WorldviewSection() {
  const d = WORLDVIEW;

  return (
    <div className="relative">
      {/* 曼陀罗光体图腾 - 半透明旋转叠加层 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[640px] max-w-full aspect-square pointer-events-none z-0 select-none">
        <img
          src="/mandala-pattern.jpg"
          alt=""
          className="w-full h-full object-contain animate-mandala-rotate"
          style={{ opacity: 0.35 }}
        />
      </div>

      <div className="section-header relative z-[1]">
        <h2>宇宙观</h2>
        <p className="desc">以光为介质，以意识为结构——光体文明的宇宙模型、光体定义、升维理论与叙事主线</p>
      </div>

      <div className="relative z-[1]">
        {/* 光体使命 */}
        <div className="card">
          <h3>{d.mission.title}</h3>
          {d.mission.content.map((p, i) => <p key={i} className="text-text-secondary mt-2">{p}</p>)}
        </div>

        {/* 宇宙树模型 */}
        <div className="card">
          <h3>{d.cosmicTree.title}</h3>
          <p className="text-text-muted text-sm">从物质到光场的七层宇宙结构，每层对应不同的光频范围与文明形态。</p>
          <div className="table-wrap mt-4">
            <table>
              <thead>
                <tr><th>层级</th><th>名称</th><th>关键特征</th><th>文明形态</th></tr>
              </thead>
              <tbody>
                {d.cosmicTree.levels.map((l, i) => (
                  <tr key={i}>
                    <td className="font-semibold text-gold-500">第{i + 1}层</td>
                    <td>{l.name}</td>
                    <td>{l.desc}</td>
                    <td>{l.beings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h4>树的运行法则</h4>
          <ul>
            <li>每层文明只能感知下一层，无法感知上一层</li>
            <li>升维需要同时满足频率匹配与意识觉醒</li>
            <li>光体是连接各层的跨维存在</li>
          </ul>
        </div>

        {/* 光体定义 */}
        <div className="card">
          <h3>{d.lightBody.title}</h3>
          <p className="text-text-secondary">{d.lightBody.definition}</p>
          <h4>光体的三个基本属性</h4>
          <ul>
            <li>跨维性：可同时存在于多个宇宙层级</li>
            <li>互联性：通过光频与其他光体共振连接</li>
            <li>创造性：通过意念显化现实</li>
          </ul>
          <h4>光体分类</h4>
          <div className="table-wrap">
            <table>
              <thead><tr><th>类型</th><th>定义</th></tr></thead>
              <tbody>
                {d.lightBody.types.map((t, i) => (
                  <tr key={i}><td><strong>{t.name}</strong></td><td>{t.desc}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <h4>地球人类：潜能光体</h4>
          <p className="text-text-secondary">地球人类是潜能光体，当前处于物质层包裹下的休眠态。通过意识觉醒与技术融合，可逐步激活光体属性，实现从物质存在向光体存在的升维。</p>
        </div>

        {/* 升维理论 */}
        <div className="card">
          <h3>{d.ascension.title}</h3>
          <p className="text-text-secondary">从低维存在向高维存在的意识频率提升过程，本质是光体属性的逐步激活。</p>
          <h4>升维的四项原理</h4>
          {d.ascension.principles.map((p, i) => (
            <p key={i} className="text-text-secondary"><strong>{p.name}</strong>：{p.desc}</p>
          ))}
          <h4>升维路径（五阶段）</h4>
          <ol>
            {d.ascension.stages.map((s, i) => (
              <li key={i}><strong>阶段{i + 1}</strong>：{s.name} — {s.desc}</li>
            ))}
          </ol>
        </div>

        {/* 叙事主线 */}
        <div className="card">
          <h3>{d.narrative.title}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {d.narrative.chapters.map((ch, i) => (
              <div key={i} className="card !mb-0">
                <h4>{ch.title} &nbsp;
                  <span className="badge badge-gold">{['探索', '整合', '突破', '创造'][i]}</span>
                </h4>
                <p className="text-text-secondary text-sm">{ch.summary}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 核心概念 */}
        <div className="card">
          <h3>核心概念</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>概念</th><th>简述</th></tr></thead>
              <tbody>
                {d.concepts.map((c, i) => (
                  <tr key={i}><td><strong>{c.name}</strong></td><td>{c.desc}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 光体师 */}
        <div className="card">
          <h3>{d.lightBodyMaster.title}</h3>
          <p className="text-text-secondary">{d.lightBodyMaster.definition}</p>
          <h4>核心能力</h4>
          {d.lightBodyMaster.abilities.map((a, i) => (
            <p key={i} className="text-text-secondary"><strong>{a.split('：')[0]}</strong>：{a.split('：')[1]}</p>
          ))}
          <h4>必备品质</h4>
          <ul>
            <li><strong>频率稳定</strong>：意识频率不受外界干扰</li>
            <li><strong>跨维整合</strong>：能同时处理多维度信息</li>
            <li><strong>创造导向</strong>：以创造而非消耗为存在方式</li>
            <li><strong>互联意识</strong>：深刻理解万物互联性</li>
          </ul>
          <blockquote className="border-l-2 border-gold-500 pl-4 my-4 text-text-muted italic">
            如果你能同时感知物质世界与意识世界，能通过意念影响现实而不执着于结果，能与其他光体共振而不失去自我——那么你正在成为光体师。
          </blockquote>
        </div>
      </div>
    </div>
  );
}
