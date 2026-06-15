'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Suspense } from 'react';

function LoginForm() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [inviteCode, setInviteCode] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const sendCode = async () => {
    if (!phone || phone.length !== 11) { setError('请输入正确的手机号'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim(), invite_code: inviteCode.trim() || undefined })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '发送失败');
      setSent(true);
      setCountdown(60);
      const timer = setInterval(() => setCountdown(prev => { if (prev <= 1) { clearInterval(timer); return 0; } return prev - 1; }), 1000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '发送失败');
    } finally { setLoading(false); }
  };

  const verifyCode = async () => {
    if (!code) { setError('请输入验证码'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim(), code })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '验证失败');

      await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });

      const redirect = searchParams.get('redirect') || '/';
      router.push(redirect);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '验证失败');
    } finally { setLoading(false); }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="card w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="animate-glow">光体文明</h2>
          <p className="text-text-muted text-sm mt-2">登录 / 注册</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-text-muted block mb-1">手机号</label>
            <input
              type="tel"
              maxLength={11}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="输入 11 位手机号"
              className="input-field"
              disabled={sent}
            />
          </div>

          <div>
            <label className="text-sm text-text-muted block mb-1">邀请码（注册时填写）</label>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.trim())}
              placeholder="如有邀请码请在此输入"
              className="input-field"
              disabled={sent}
            />
          </div>

          {!sent ? (
            <button onClick={sendCode} disabled={loading || !phone} className="btn-primary w-full disabled:opacity-50">
              {loading ? '发送中...' : '获取验证码'}
            </button>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-sm text-text-muted block mb-1">验证码</label>
                <input
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="输入 6 位验证码"
                  className="input-field"
                />
              </div>
              <button onClick={verifyCode} disabled={loading || code.length !== 6} className="btn-primary w-full disabled:opacity-50">
                {loading ? '验证中...' : '登录 / 注册'}
              </button>
              <button
                onClick={() => { setSent(false); setCode(''); }}
                disabled={countdown > 0}
                className="btn-outline w-full disabled:opacity-50"
              >
                {countdown > 0 ? `${countdown}秒后可重新发送` : '重新发送'}
              </button>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-900 bg-opacity-20 border border-red-800 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-text-muted">加载中...</div>}>
      <LoginForm />
    </Suspense>
  );
}
