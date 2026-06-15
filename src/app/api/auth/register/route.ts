import { NextResponse } from 'next/server';
import { createServiceRoleSupabase } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const { phone, password, invite_code } = await request.json();

    // 校验手机号
    if (!phone || !/^1\d{10}$/.test(phone)) {
      return NextResponse.json({ error: '手机号格式错误' }, { status: 400 });
    }

    // 校验密码
    if (!password || password.length < 6) {
      return NextResponse.json({ error: '密码至少6位' }, { status: 400 });
    }

    const supabase = createServiceRoleSupabase();

    // 如果提供了邀请码，验证有效性
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
    }

    // 创建用户
    const { data, error: createError } = await supabase.auth.admin.createUser({
      phone: phone.trim(),
      phone_confirm: true,
      password,
    });

    if (createError) {
      if (createError.message.toLowerCase().includes('already')) {
        return NextResponse.json({ error: '该手机号已注册' }, { status: 409 });
      }
      console.error('Create user error:', createError);
      return NextResponse.json({ error: '注册失败，请稍后重试' }, { status: 500 });
    }

    if (!data?.user) {
      return NextResponse.json({ error: '注册失败，请稍后重试' }, { status: 500 });
    }

    // 绑定邀请码
    if (invite_code) {
      await supabase
        .from('invite_codes')
        .update({ is_used: true, used_by: phone.trim() })
        .eq('code', invite_code.trim())
        .eq('is_used', false);
    }

    return NextResponse.json({
      success: true,
      user_id: data.user.id,
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
  }
}
