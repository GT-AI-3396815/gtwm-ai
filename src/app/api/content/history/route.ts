import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = createServerSupabase();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const { data: items, error } = await supabase
      .from('generated_content')
      .select('id, prompt, category, result, created_at')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json({ items: items || [] });
  } catch (error) {
    console.error('History error:', error);
    return NextResponse.json({ error: '加载失败' }, { status: 500 });
  }
}
