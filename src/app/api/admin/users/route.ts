import { NextResponse } from 'next/server';
import { createServiceRoleSupabase } from '@/lib/supabase-server';

// GET - 获取所有用户
export async function GET() {
  try {
    const serviceSupabase = createServiceRoleSupabase();
    const { data: users, error } = await serviceSupabase
      .from('profiles')
      .select('id, phone, role, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ users: users || [] });
  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json({ error: '加载失败' }, { status: 500 });
  }
}

// PATCH - 更新用户角色
export async function PATCH(request: Request) {
  try {
    const { user_id, role } = await request.json();
    if (!user_id || !['user', 'admin'].includes(role)) {
      return NextResponse.json({ error: '参数无效' }, { status: 400 });
    }

    const serviceSupabase = createServiceRoleSupabase();
    const { error } = await serviceSupabase
      .from('profiles')
      .update({ role })
      .eq('id', user_id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin update error:', error);
    return NextResponse.json({ error: '更新失败' }, { status: 500 });
  }
}
