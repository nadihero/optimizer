"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/app/lib/supabase";
import { Transaction, Budget, Goal, Debt, Subscription, Trial } from "@/app/lib/types";

interface AppState {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  debts: Debt[];
  subscriptions: Subscription[];
  trials: Trial[];
  loading: boolean;
  refreshData: () => Promise<void>;
  addTransaction: (tx: Omit<Transaction, "id" | "created_at">) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addBudget: (b: Omit<Budget, "id" | "created_at">) => Promise<void>;
  updateBudgetSpent: (id: string, spent: number) => Promise<void>;
  addGoal: (g: Omit<Goal, "id" | "created_at">) => Promise<void>;
  addToGoal: (id: string, amount: number) => Promise<void>;
  addDebt: (d: Omit<Debt, "id" | "created_at">) => Promise<void>;
  payDebt: (id: string, amount: number) => Promise<void>;
  addSubscription: (s: Omit<Subscription, "id" | "created_at">) => Promise<void>;
  addTrial: (t: Omit<Trial, "id" | "created_at">) => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [txRes, budgetRes, goalRes, debtRes, subRes, trialRes] = await Promise.all([
        supabase.from("transactions").select("*").order("date", { ascending: false }),
        supabase.from("budgets").select("*").order("created_at", { ascending: false }),
        supabase.from("goals").select("*").order("created_at", { ascending: false }),
        supabase.from("debts").select("*").order("created_at", { ascending: false }),
        supabase.from("subscriptions").select("*").order("created_at", { ascending: false }),
        supabase.from("trials").select("*").order("created_at", { ascending: false }),
      ]);

      if (txRes.data) setTransactions(txRes.data as Transaction[]);
      if (budgetRes.data) setBudgets(budgetRes.data as Budget[]);
      if (goalRes.data) setGoals(goalRes.data as Goal[]);
      if (debtRes.data) setDebts(debtRes.data as Debt[]);
      if (subRes.data) setSubscriptions(subRes.data as Subscription[]);
      if (trialRes.data) setTrials(trialRes.data as Trial[]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addTransaction = async (tx: Omit<Transaction, "id" | "created_at">) => {
    const { data, error } = await supabase.from("transactions").insert(tx).select().single();
    if (!error && data) {
      setTransactions((prev) => [data as Transaction, ...prev]);
    }
  };

  const deleteTransaction = async (id: string) => {
    await supabase.from("transactions").delete().eq("id", id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const addBudget = async (b: Omit<Budget, "id" | "created_at">) => {
    const { data, error } = await supabase.from("budgets").insert(b).select().single();
    if (!error && data) {
      setBudgets((prev) => [data as Budget, ...prev]);
    }
  };

  const updateBudgetSpent = async (id: string, spent: number) => {
    await supabase.from("budgets").update({ spent_amount: spent }).eq("id", id);
    setBudgets((prev) => prev.map((b) => (b.id === id ? { ...b, spent_amount: spent } : b)));
  };

  const addGoal = async (g: Omit<Goal, "id" | "created_at">) => {
    const { data, error } = await supabase.from("goals").insert(g).select().single();
    if (!error && data) {
      setGoals((prev) => [data as Goal, ...prev]);
    }
  };

  const addToGoal = async (id: string, amount: number) => {
    const goal = goals.find((g) => g.id === id);
    if (!goal) return;
    const newAmount = goal.current_amount + amount;
    await supabase.from("goals").update({ current_amount: newAmount }).eq("id", id);
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, current_amount: newAmount } : g)));
  };

  const addDebt = async (d: Omit<Debt, "id" | "created_at">) => {
    const { data, error } = await supabase.from("debts").insert(d).select().single();
    if (!error && data) {
      setDebts((prev) => [data as Debt, ...prev]);
    }
  };

  const payDebt = async (id: string, amount: number) => {
    const debt = debts.find((d) => d.id === id);
    if (!debt) return;
    const newPaid = debt.paid_amount + amount;
    await supabase.from("debts").update({ paid_amount: newPaid }).eq("id", id);
    setDebts((prev) => prev.map((d) => (d.id === id ? { ...d, paid_amount: newPaid } : d)));
  };

  const addSubscription = async (s: Omit<Subscription, "id" | "created_at">) => {
    const { data, error } = await supabase.from("subscriptions").insert(s).select().single();
    if (!error && data) {
      setSubscriptions((prev) => [data as Subscription, ...prev]);
    }
  };

  const addTrial = async (t: Omit<Trial, "id" | "created_at">) => {
    const { data, error } = await supabase.from("trials").insert(t).select().single();
    if (!error && data) {
      setTrials((prev) => [data as Trial, ...prev]);
    }
  };

  return (
    <AppContext.Provider
      value={{
        transactions,
        budgets,
        goals,
        debts,
        subscriptions,
        trials,
        loading,
        refreshData: fetchData,
        addTransaction,
        deleteTransaction,
        addBudget,
        updateBudgetSpent,
        addGoal,
        addToGoal,
        addDebt,
        payDebt,
        addSubscription,
        addTrial,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
