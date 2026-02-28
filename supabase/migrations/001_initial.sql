-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL DEFAULT 'My Salon',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own profile" ON profiles FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Stylists
CREATE TABLE IF NOT EXISTS stylists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  hire_date DATE NOT NULL DEFAULT CURRENT_DATE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE stylists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own stylists" ON stylists FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stylist_id UUID NOT NULL REFERENCES stylists(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  service TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('completed', 'no_show', 'cancelled', 'scheduled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own appointments" ON appointments FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Revenue Goals
CREATE TABLE IF NOT EXISTS revenue_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month TEXT NOT NULL, -- YYYY-MM
  goal_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, month)
);
ALTER TABLE revenue_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own goals" ON revenue_goals FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Service role can read all (for admin API)
CREATE POLICY "Service role reads all profiles" ON profiles FOR SELECT USING (auth.role() = 'service_role');
CREATE POLICY "Service role reads all stylists" ON stylists FOR SELECT USING (auth.role() = 'service_role');
CREATE POLICY "Service role reads all appointments" ON appointments FOR SELECT USING (auth.role() = 'service_role');
