// ============================================
// Supabase Edge 兼容客户端（Middleware / Server Components）
// 仅依赖 @supabase/ssr，可安全在 Edge Runtime 运行
// ============================================
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createServerSupabase() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          try { cookieStore.set({ name, value, ...options }); } catch {}
        },
        remove(name: string, options: Record<string, unknown>) {
          try { cookieStore.delete({ name, ...options }); } catch {}
        },
      },
    }
  );
}
