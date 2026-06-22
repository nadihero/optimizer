-- Naomi Budget Tracker Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
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
  name TEXT NOT NULL DEFAULT '',
  start_date DATE,
  end_date DATE,
  will_convert BOOLEAN DEFAULT false,
  amount NUMERIC NOT NULL DEFAULT 0,
  icon TEXT DEFAULT '',
  color TEXT DEFAULT '#F59E0B'
);

-- Enable Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trials ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for MVP, add auth later)
CREATE POLICY "Allow all operations on transactions" ON transactions FOR ALL USING (true);
CREATE POLICY "Allow all operations on budgets" ON budgets FOR ALL USING (true);
CREATE POLICY "Allow all operations on goals" ON goals FOR ALL USING (true);
CREATE POLICY "Allow all operations on debts" ON debts FOR ALL USING (true);
CREATE POLICY "Allow all operations on subscriptions" ON subscriptions FOR ALL USING (true);
CREATE POLICY "Allow all operations on trials" ON trials FOR ALL USING (true);

-- Insert sample data
INSERT INTO transactions (type, amount, category, description, date, icon_color) VALUES
  ('income', 3520000, 'Salary', 'ruangguru', '2026-06-22', '#006239'),
  ('expense', 100000, 'Shopping', 'Anggi Skinker', '2026-06-19', '#d0021b');

INSERT INTO budgets (category, limit_amount, spent_amount, period, icon, color) VALUES
  ('Food & Drinks', 1000000, 350000, 'monthly', '🍔', '#EF4444'),
  ('Transport', 500000, 120000, 'monthly', '🚗', '#3B82F6'),
  ('Shopping', 800000, 450000, 'monthly', '🛍️', '#AF52DE'),
  ('Entertainment', 300000, 50000, 'monthly', '🎬', '#F59E0B');

INSERT INTO goals (name, target_amount, current_amount, icon, color, deadline) VALUES
  ('Emergency Fund', 10000000, 3500000, '🏦', '#22C55E', '2026-12-31'),
  ('New Laptop', 15000000, 5000000, '💻', '#3B82F6', '2026-09-30'),
  ('Vacation', 8000000, 2000000, '✈️', '#F59E0B', '2027-01-01');

INSERT INTO debts (type, person, amount, paid_amount, due_date, description) VALUES
  ('owed', 'Budi', 500000, 200000, '2026-07-15', 'Pinjaman bulan Mei'),
  ('owing', 'Sari', 250000, 0, '2026-07-01', 'Bayar makan bareng');

INSERT INTO subscriptions (name, amount, billing_cycle, next_billing, icon, color) VALUES
  ('Netflix', 186000, 'monthly', '2026-07-01', '🎬', '#EF4444'),
  ('Spotify', 55000, 'monthly', '2026-07-05', '🎵', '#22C55E'),
  ('ruangguru', 150000, 'monthly', '2026-07-10', '📚', '#3B82F6');

INSERT INTO trials (name, start_date, end_date, will_convert, amount, icon, color) VALUES
  ('Adobe Creative Cloud', '2026-06-15', '2026-06-29', true, 599000, '🎨', '#AF52DE'),
  ('Canva Pro', '2026-06-20', '2026-06-27', false, 0, '🖼️', '#3B82F6');
