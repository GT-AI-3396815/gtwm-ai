-- ============================================
-- 光体文明 - Supabase 数据库 Schema
-- ============================================

-- 1. 用户档案表（扩展 Supabase auth.users）
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  phone TEXT UNIQUE,
  nickname TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  invite_code_used TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 行级安全：用户只能读取自己的档案
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 插入触发器：注册时自动创建 profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, phone, role)
  VALUES (
    NEW.id,
    NEW.phone,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. 邀请码表
-- ============================================
CREATE TABLE IF NOT EXISTS public.invite_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  max_uses INT DEFAULT 1,
  used_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  used_by UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

ALTER TABLE public.invite_codes ENABLE ROW LEVEL SECURITY;

-- 所有人可验证邀请码（只读 code + is_active + used_count + max_uses）
CREATE POLICY "Anyone can verify invite code"
  ON public.invite_codes FOR SELECT
  USING (true);

-- 管理员可管理邀请码
CREATE POLICY "Admins can manage invite codes"
  ON public.invite_codes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- 3. 验证码表（手机验证码）
-- ============================================
CREATE TABLE IF NOT EXISTS public.verification_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.verification_codes ENABLE ROW LEVEL SECURITY;

-- 验证码表仅通过 API Route 访问（使用 service_role key）
-- 不做公开访问策略

-- ============================================
-- 4. 生成内容历史表
-- ============================================
CREATE TABLE IF NOT EXISTS public.generated_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL DEFAULT '通用',
  prompt TEXT NOT NULL,
  result TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.generated_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own content"
  ON public.generated_content FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own content"
  ON public.generated_content FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own content"
  ON public.generated_content FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 索引
-- ============================================
CREATE INDEX IF NOT EXISTS idx_invite_codes_code ON public.invite_codes(code);
CREATE INDEX IF NOT EXISTS idx_verification_codes_phone ON public.verification_codes(phone);
CREATE INDEX IF NOT EXISTS idx_generated_content_user ON public.generated_content(user_id, created_at DESC);

-- ============================================
-- 定时清理过期验证码（每天执行）
-- ============================================
CREATE OR REPLACE FUNCTION public.cleanup_expired_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM public.verification_codes WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- 注意：需要 Supabase Dashboard → Database → Extensions 中启用 pg_cron
-- SELECT cron.schedule('cleanup-codes', '0 3 * * *', 'SELECT cleanup_expired_codes()');
