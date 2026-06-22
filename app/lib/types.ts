export interface Transaction {
  id: string;
  created_at: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
  icon_color: string;
}

export interface Budget {
  id: string;
  created_at: string;
  category: string;
  limit_amount: number;
  spent_amount: number;
  period: "weekly" | "monthly";
  icon: string;
  color: string;
}

export interface Goal {
  id: string;
  created_at: string;
  name: string;
  target_amount: number;
  current_amount: number;
  icon: string;
  color: string;
  deadline: string;
}

export interface Debt {
  id: string;
  created_at: string;
  type: "owed" | "owing";
  person: string;
  amount: number;
  paid_amount: number;
  due_date: string;
  description: string;
}

export interface Subscription {
  id: string;
  created_at: string;
  name: string;
  amount: number;
  billing_cycle: "weekly" | "monthly" | "yearly";
  next_billing: string;
  icon: string;
  color: string;
}

export interface Trial {
  id: string;
  created_at: string;
  name: string;
  start_date: string;
  end_date: string;
  will_convert: boolean;
  amount: number;
  icon: string;
  color: string;
}
