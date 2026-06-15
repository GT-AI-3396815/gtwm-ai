import { NextResponse } from 'next/server';
import { createServiceRoleSupabase } from '@/lib/supabase-server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { phone, invite_code } = await request.json();
    if (!phone || !/^1\d{10}$/.test(phone)) {
      return NextResponse.json({ error: '手机号格式错误' }, { status: 400 });
    }

    const supabase = createServiceRoleSupabase();

    // 如果提供了邀请码，验证
    if (invite_code) {
      const { data: invite } = await supabase
        .from('invite_codes')
        .select('id, is_used')
        .eq('code', invite_code.trim())
        .single();

      if (!invite) {
        return NextResponse.json({ error: '邀请码无效' }, { status: 400 });
      }
      if (invite.is_used) {
        return NextResponse.json({ error: '邀请码已被使用' }, { status: 400 });
      }
      // 标记为验证中（稍后在 verify 时正式绑定）
    }

    // 生成6位验证码
    const code = crypto.randomInt(100000, 999999).toString();

    // 存入数据库（有效期10分钟）
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    await supabase.from('verification_codes').upsert({
      phone,
      code,
      invite_code: invite_code?.trim() || null,
      expires_at: expiresAt,
      used: false
    }, { onConflict: 'phone' });

    // 实际生产环境应调用短信服务发送验证码
    console.log(`[DEV] 验证码已生成: ${code} -> 手机号: ${phone}`);

    return NextResponse.json({
      success: true,
      message: '验证码已发送',
      // 开发环境返回验证码，生产环境删除此行
      dev_code: code
    });
  } catch (error) {
    console.error('Send code error:', error);
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
  }
}
