'use client';

import { useState } from 'react';
import { EXTERNAL_LINKS } from '@/lib/data';

export default function GenerateSection() {
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState('通用');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    setSaved(false);

    try {
      const apiKey = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;
      const model = process.env.NEXT_PUBLIC_DEEPSEEK_MODEL || 'deepseek-chat';

      if (!apiKey) throw new Error('API Key 未配置');

      const systemPrompt = `你是光体文明的智能创作助手。你基于光体文明的世界观体系进行内容创作。
光体文明核心理念：以光为介质、以意识为结构的高维存在形式。人类是潜能光体，需要通过意识觉醒实现升维。
请在以下类别中创作：${category}。保持简洁有深度的风格，200-500字。`;

      const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt.trim() }
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`API 错误(${res.status}): ${errText.slice(0, 200)}`);
      }

      const dsData = await res.json();
      const content = dsData.choices?.[0]?.message?.content || '生成结果为空';
      setResult(content);
      setSaved(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '生成失败';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="section-header">
        <h2>内容生成</h2>
        <p className="desc">通过 AI 生成光体文明相关创意内容，结果自动保存至数据库</p>
      </div>

      <div className="card">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-text-muted block mb-1">内容类别</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field"
            >
              {['通用', '宇宙观', '术语解读', '叙事创作', '光体修行', '未来预测', '光码解码'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-text-muted block mb-1">输入创作提示</label>
            <textarea
              placeholder="例如：创作一段关于人类觉醒的光体叙事..."
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="input-field resize-none"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? '生成中...' : '✧ 生成内容'}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-900 bg-opacity-20 border border-red-800 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h4>生成结果 {saved && <span className="badge badge-cyan ml-2">已保存</span>}</h4>
            </div>
            <div className="bg-surface-900 border border-border-subtle rounded-lg p-4 text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
              {result}
            </div>
          </div>
        )}
      </div>

      <div className="card text-center py-10">
        <p className="text-gold-500 text-lg mb-3">✧ DeepSeek 内容生成智能体</p>
        <p className="text-text-muted text-sm mb-5">跳转到外部智能体进行更强大的 AI 内容创作</p>
        <a
          href={EXTERNAL_LINKS.generate}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-block no-underline"
        >
          ✧ 打开 Kimi 智能体
        </a>
      </div>
    </div>
  );
}
