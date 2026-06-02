-- ============================================================
-- EsfotGo - Supabase Database Schema
-- Escuela Politécnica Nacional
-- ============================================================

-- 1. PROFILES (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'estudiante'
    CHECK (role IN ('estudiante', 'docente', 'administrador')),
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger: auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'estudiante')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS: profiles
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
      WHERE id = auth.uid() AND role = 'administrador'
    )
  );

-- 2. EVENTS
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  location TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view events"
  ON public.events FOR SELECT
  USING (true);

CREATE POLICY "Docentes and admins can create events"
  ON public.events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('docente', 'administrador')
    )
  );

CREATE POLICY "Docentes and admins can update events"
  ON public.events FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('docente', 'administrador')
    )
  );

CREATE POLICY "Admins can delete events"
  ON public.events FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'administrador'
    )
  );

-- 3. BUS ROUTES
CREATE TABLE IF NOT EXISTS public.bus_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL DEFAULT '#1B6BB0',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.bus_routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view bus routes"
  ON public.bus_routes FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage bus routes"
  ON public.bus_routes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'administrador'
    )
  );

-- 4. BUS STOPS
CREATE TABLE IF NOT EXISTS public.bus_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID NOT NULL REFERENCES public.bus_routes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  stop_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.bus_stops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view bus stops"
  ON public.bus_stops FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage bus stops"
  ON public.bus_stops FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'administrador'
    )
  );

-- 5. BUS LOCATIONS (realtime tracking)
CREATE TABLE IF NOT EXISTS public.bus_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID NOT NULL REFERENCES public.bus_routes(id) ON DELETE CASCADE,
  bus_id TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  heading DOUBLE PRECISION NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.bus_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view bus locations"
  ON public.bus_locations FOR SELECT
  USING (true);

CREATE POLICY "Service can upsert bus locations"
  ON public.bus_locations FOR ALL
  USING (true);

-- Enable realtime for bus_locations
ALTER PUBLICATION supabase_realtime ADD TABLE public.bus_locations;

-- 6. CAMPUS LOCATIONS
CREATE TABLE IF NOT EXISTS public.campus_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.campus_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view campus locations"
  ON public.campus_locations FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage campus locations"
  ON public.campus_locations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'administrador'
    )
  );

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Change user password (uses Supabase admin API under the hood)
CREATE OR REPLACE FUNCTION public.change_user_password(
  current_plain_password TEXT,
  new_plain_password TEXT
)
RETURNS VOID AS $$
BEGIN
  -- Verify current password via auth.users
  IF NOT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
      AND encrypted_password = crypt(current_plain_password, auth.users.encrypted_password)
  ) THEN
    RAISE EXCEPTION 'Current password is incorrect' USING ERRCODE = 'A0001';
  END IF;

  -- Password will be updated client-side via supabase.auth.updateUser()
  -- This function serves as an RPC validation layer
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- SEED DATA (optional)
-- ============================================================

-- Sample campus locations
INSERT INTO public.campus_locations (name, description, category, latitude, longitude)
VALUES
  ('Edificio ESFOT', 'Edificio principal de la Escuela de Formación de Tecnólogos', 'academico', -0.2105, -78.4895),
  ('Biblioteca Central', 'Biblioteca principal del campus', 'biblioteca', -0.2102, -78.4890),
  ('Comedor Politécnico', 'Comedor estudiantil', 'servicios', -0.2110, -78.4898),
  ('Gimnasio', 'Instalaciones deportivas', 'deportes', -0.2098, -78.4902),
  ('Auditorio', 'Auditorio principal para eventos', 'eventos', -0.2108, -78.4892)
ON CONFLICT DO NOTHING;

-- Sample bus route
INSERT INTO public.bus_routes (id, name, description, color)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'Ruta Polibús - Campus',
    'Recorrido principal del polibus por el campus EPN',
    '#1B6BB0'
  )
ON CONFLICT DO NOTHING;

-- Sample bus stops for route
INSERT INTO public.bus_stops (route_id, name, latitude, longitude, stop_order)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Entrada Principal', -0.2095, -78.4910, 1),
  ('00000000-0000-0000-0000-000000000001', 'Edificio ESFOT', -0.2105, -78.4895, 2),
  ('00000000-0000-0000-0000-000000000001', 'Biblioteca', -0.2102, -78.4890, 3),
  ('00000000-0000-0000-0000-000000000001', 'Comedor', -0.2110, -78.4898, 4),
  ('00000000-0000-0000-0000-000000000001', 'Salida Campus', -0.2115, -78.4885, 5)
ON CONFLICT DO NOTHING;

-- Trigger: auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_updated_at_events
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 7. REGISTRATION ATTEMPTS (audit & rate-limiting)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.registration_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  ip_address TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'email_sent', 'email_verified', 'profile_created', 'failed')),
  error_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.registration_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service can insert registration attempts"
  ON public.registration_attempts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view registration attempts"
  ON public.registration_attempts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'administrador'
    )
  );

-- Index for rate-limiting queries
CREATE INDEX IF NOT EXISTS idx_registration_attempts_email_created
  ON public.registration_attempts(email, created_at DESC);

-- ============================================================
-- 8. ENHANCED PROFILE TRIGGER (with registration tracking)
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
BEGIN
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'estudiante');

  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    user_role
  );

  -- Log successful registration
  INSERT INTO public.registration_attempts (email, status)
  VALUES (NEW.email, 'profile_created');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-create the trigger to use the updated function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 9. RESTRICTED ZONES (cartography admin)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.restricted_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  coordinates JSONB NOT NULL DEFAULT '[]',
  fill_color TEXT NOT NULL DEFAULT 'rgba(200,16,46,0.2)',
  stroke_color TEXT NOT NULL DEFAULT '#C8102E',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.restricted_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view restricted zones"
  ON public.restricted_zones FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage restricted zones"
  ON public.restricted_zones FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'administrador'
    )
  );

-- Enable realtime for campus_locations (cartography sync)
ALTER PUBLICATION supabase_realtime ADD TABLE public.campus_locations;

CREATE TRIGGER set_updated_at_campus_locations
  BEFORE UPDATE ON public.campus_locations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
