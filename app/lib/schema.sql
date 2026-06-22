-- Naomi Budget Tracker Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Profiles table (for user data)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount NUMERIC NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  icon_color TEXT DEFAULT '#006239'
);

-- Budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  limit_amount NUMERIC NOT NULL DEFAULT 0,
  spent_amount NUMERIC NOT NULL DEFAULT 0,
  period TEXT NOT NULL DEFAULT 'monthly' CHECK (period IN ('weekly', 'monthly')),
  icon TEXT DEFAULT '',
  color TEXT DEFAULT '#D4F53C'
);

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  target_amount NUMERIC NOT NULL DEFAULT 0,
  current_amount NUMERIC NOT NULL DEFAULT 0,
  icon TEXT DEFAULT '',
  color TEXT DEFAULT '#3B82F6',
  deadline DATE
);

-- Debts table
CREATE TABLE IF NOT EXISTS debts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('owed', 'owing')),
  person TEXT NOT NULL DEFAULT '',
  amount NUMERIC NOT NULL DEFAULT 0,
  paid_amount NUMERIC NOT NULL DEFAULT 0,
  due_date DATE,
  description TEXT DEFAULT ''
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  amount NUMERIC NOT NULL DEFAULT 0,
  billing_cycle TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('weekly', 'monthly', 'yearly')),
  next_billing DATE,
  icon TEXT DEFAULT '',
  color TEXT DEFAULT '#AF52DE'
);

-- Trials table
CREATE TABLE IF NOT EXISTS trials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  start_date DATE,
  end_date DATE,
  will_convert BOOLEAN DEFAULT false,
  amount NUMERIC NOT NULL DEFAULT 0,
  icon TEXT DEFAULT '',
  color TEXT DEFAULT '#F59E0B'
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trials ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can CRUD own transactions" ON transactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own budgets" ON budgets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own goals" ON goals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own debts" ON debts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own subscriptions" ON subscriptions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own trials" ON trials FOR ALL USING (auth.uid() = user_id);

-- Enable email auth in Supabase Dashboard:
-- Authentication > Providers > Email > Enable
-- Disable "Confirm email" for instant access (or keep it for security)
