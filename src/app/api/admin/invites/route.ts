import { NextResponse } from 'next/server';
import { createServerSupabase, createServiceRoleSupabase } from '@/lib/supabase-server';
import crypto from 'crypto';

// GET - 获取所有邀请码
export async function GET() {
  try {
    const supabase = createServerSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    const serviceSupabase = createServiceRoleSupabase();
    const { data: codes, error } = await serviceSupabase
      .from('invite_codes')
      .select('id, code, is_used, used_by, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ codes: codes || [] });
  } catch (error) {
    console.error('Admin invites error:', error);
    return NextResponse.json({ error: '加载失败' }, { status: 500 });
  }
}

// POST - 批量生成邀请码
export async function POST(request: Request) {
  try {
    const supabase = createServerSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    const { count } = await request.json();
    const num = Math.min(Math.max(1, count || 5), 100);

    const codes = [];
    for (let i = 0; i < num; i++) {
      codes.push(crypto.randomUUID().split('-')[0].toUpperCase());
    }

    const serviceSupabase = createServiceRoleSupabase();
    const { error } = await serviceSupabase
      .from('invite_codes')
      .insert(codes.map(code => ({ code })));

    if (error) throw error;

    return NextResponse.json({ success: true, codes });
  } catch (error) {
    console.error('Generate invites error:', error);
    return NextResponse.json({ error: '生成失败' }, { status: 500 });
  }
}

// DELETE - 删除邀请码
export async function DELETE(request: Request) {
  try {
    const supabase = createServerSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: '缺少id' }, { status: 400 });

    const serviceSupabase = createServiceRoleSupabase();
    const { error } = await serviceSupabase
      .from('invite_codes')
      .delete()
      .eq('id', id)
      .eq('is_used', false);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete invite error:', error);
    return NextResponse.json({ error: '删除失败' }, { status: 500 });
  }
}
