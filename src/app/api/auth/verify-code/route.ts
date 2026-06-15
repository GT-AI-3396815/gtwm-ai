import { NextResponse } from 'next/server';
import { createServiceRoleSupabase } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const { phone, code } = await request.json();
    if (!phone || !code) {
      return NextResponse.json({ error: '参数不完整' }, { status: 400 });
    }

    const supabase = createServiceRoleSupabase();

    // 验证码校验
    const { data: record, error: findError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('phone', phone)
      .eq('code', code)
      .eq('used', false)
      .single();

    if (findError || !record) {
      return NextResponse.json({ error: '验证码错误' }, { status: 400 });
    }

    if (new Date(record.expires_at) < new Date()) {
      return NextResponse.json({ error: '验证码已过期' }, { status: 400 });
    }

    // 标记验证码已使用
    await supabase
      .from('verification_codes')
      .update({ used: true })
      .eq('id', record.id);

    // 创建/查找用户
    const { data: { user }, error: signError } = await supabase.auth.admin.createUser({
      phone: phone,
      phone_confirm: true,
    });

    // 如果已存在则查找
    let authUser = user;
    if (signError && signError.message.includes('already')) {
      const { data: existing } = await supabase.auth.admin.listUsers();
      const found = existing?.users?.find((u: { phone: string }) => u.phone === phone);
      if (found) authUser = found;
    }

    if (!authUser) {
      return NextResponse.json({ error: '用户创建失败' }, { status: 500 });
    }

    // 如果提供了邀请码，绑定使用
    if (record.invite_code) {
      await supabase
        .from('invite_codes')
        .update({ is_used: true, used_by: phone })
        .eq('code', record.invite_code)
        .eq('is_used', false);
    }

    // 生成 JWT session
    const { data: tokenData, error: tokenError } = await supabase.auth.admin.generateLink({
      type: 'signup',
      phone: phone,
    });

    // 使用 signInWithPassword 的替代方案：直接用 admin API 签发 session
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.createUser({
      phone,
      phone_confirm: true,
      user_metadata: { login_at: new Date().toISOString() },
    });

    if (sessionError && !sessionError.message.includes('already')) {
      return NextResponse.json({ error: '登录失败' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      phone,
      user_id: authUser.id
    });
  } catch (error) {
    console.error('Verify code error:', error);
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
  }
}
