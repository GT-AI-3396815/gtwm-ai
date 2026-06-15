import { NextResponse } from 'next/server';
import { createServiceRoleSupabase } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = createServiceRoleSupabase();
    const { data: items, error } = await supabase
      .from('generated_content')
      .select('id, prompt, category, result, created_at')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json({ items: items || [] });
  } catch (error) {
    console.error('History error:', error);
    return NextResponse.json({ error: '加载失败' }, { status: 500 });
  }
}
