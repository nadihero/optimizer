"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/app/lib/supabase";
import { useAuth } from "./AuthContext";
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
  addTransaction: (tx: Omit<Transaction, "id" | "created_at" | "user_id">) => Promise<void>;
  updateTransaction: (id: string, tx: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addBudget: (b: Omit<Budget, "id" | "created_at" | "user_id">) => Promise<void>;
  updateBudget: (id: string, b: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  addGoal: (g: Omit<Goal, "id" | "created_at" | "user_id">) => Promise<void>;
  updateGoal: (id: string, g: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addToGoal: (id: string, amount: number) => Promise<void>;
  addDebt: (d: Omit<Debt, "id" | "created_at" | "user_id">) => Promise<void>;
  updateDebt: (id: string, d: Partial<Debt>) => Promise<void>;
  deleteDebt: (id: string) => Promise<void>;
  payDebt: (id: string, amount: number) => Promise<void>;
  addSubscription: (s: Omit<Subscription, "id" | "created_at" | "user_id">) => Promise<void>;
  updateSubscription: (id: string, s: Partial<Subscription>) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
  addTrial: (t: Omit<Trial, "id" | "created_at" | "user_id">) => Promise<void>;
  updateTrial: (id: string, t: Partial<Trial>) => Promise<void>;
  deleteTrial: (id: string) => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) {
      setTransactions([]);
      setBudgets([]);
      setGoals([]);
      setDebts([]);
      setSubscriptions([]);
      setTrials([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [txRes, budgetRes, goalRes, debtRes, subRes, trialRes] = await Promise.all([
        supabase.from("transactions").select("*").eq("user_id", user.id).order("date", { ascending: false }),
        supabase.from("budgets").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("goals").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("debts").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("subscriptions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("trials").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
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
  }, [user]);

  const addTransaction = async (tx: Omit<Transaction, "id" | "created_at" | "user_id">) => {
    if (!user) return;
    const { data, error } = await supabase.from("transactions").insert({ ...tx, user_id: user.id }).select().single();
    if (!error && data) setTransactions((prev) => [data as Transaction, ...prev]);
  };

  const updateTransaction = async (id: string, tx: Partial<Transaction>) => {
    await supabase.from("transactions").update(tx).eq("id", id).eq("user_id", user?.id);
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...tx } : t)));
  };

  const deleteTransaction = async (id: string) => {
    await supabase.from("transactions").delete().eq("id", id).eq("user_id", user?.id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const addBudget = async (b: Omit<Budget, "id" | "created_at" | "user_id">) => {
    if (!user) return;
    const { data, error } = await supabase.from("budgets").insert({ ...b, user_id: user.id }).select().single();
    if (!error && data) setBudgets((prev) => [data as Budget, ...prev]);
  };

  const updateBudget = async (id: string, b: Partial<Budget>) => {
    await supabase.from("budgets").update(b).eq("id", id).eq("user_id", user?.id);
    setBudgets((prev) => prev.map((item) => (item.id === id ? { ...item, ...b } : item)));
  };

  const deleteBudget = async (id: string) => {
    await supabase.from("budgets").delete().eq("id", id).eq("user_id", user?.id);
    setBudgets((prev) => prev.filter((item) => item.id !== id));
  };

  const addGoal = async (g: Omit<Goal, "id" | "created_at" | "user_id">) => {
    if (!user) return;
    const { data, error } = await supabase.from("goals").insert({ ...g, user_id: user.id }).select().single();
    if (!error && data) setGoals((prev) => [data as Goal, ...prev]);
  };

  const updateGoal = async (id: string, g: Partial<Goal>) => {
    await supabase.from("goals").update(g).eq("id", id).eq("user_id", user?.id);
    setGoals((prev) => prev.map((item) => (item.id === id ? { ...item, ...g } : item)));
  };

  const deleteGoal = async (id: string) => {
    await supabase.from("goals").delete().eq("id", id).eq("user_id", user?.id);
    setGoals((prev) => prev.filter((item) => item.id !== id));
  };

  const addToGoal = async (id: string, amount: number) => {
    const goal = goals.find((g) => g.id === id);
    if (!goal) return;
    const newAmount = goal.current_amount + amount;
    await supabase.from("goals").update({ current_amount: newAmount }).eq("id", id).eq("user_id", user?.id);
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, current_amount: newAmount } : g)));
  };

  const addDebt = async (d: Omit<Debt, "id" | "created_at" | "user_id">) => {
    if (!user) return;
    const { data, error } = await supabase.from("debts").insert({ ...d, user_id: user.id }).select().single();
    if (!error && data) setDebts((prev) => [data as Debt, ...prev]);
  };

  const updateDebt = async (id: string, d: Partial<Debt>) => {
    await supabase.from("debts").update(d).eq("id", id).eq("user_id", user?.id);
    setDebts((prev) => prev.map((item) => (item.id === id ? { ...item, ...d } : item)));
  };

  const deleteDebt = async (id: string) => {
    await supabase.from("debts").delete().eq("id", id).eq("user_id", user?.id);
    setDebts((prev) => prev.filter((item) => item.id !== id));
  };

  const payDebt = async (id: string, amount: number) => {
    const debt = debts.find((d) => d.id === id);
    if (!debt) return;
    const newPaid = debt.paid_amount + amount;
    await supabase.from("debts").update({ paid_amount: newPaid }).eq("id", id).eq("user_id", user?.id);
    setDebts((prev) => prev.map((d) => (d.id === id ? { ...d, paid_amount: newPaid } : d)));
  };

  const addSubscription = async (s: Omit<Subscription, "id" | "created_at" | "user_id">) => {
    if (!user) return;
    const { data, error } = await supabase.from("subscriptions").insert({ ...s, user_id: user.id }).select().single();
    if (!error && data) setSubscriptions((prev) => [data as Subscription, ...prev]);
  };

  const updateSubscription = async (id: string, s: Partial<Subscription>) => {
    await supabase.from("subscriptions").update(s).eq("id", id).eq("user_id", user?.id);
    setSubscriptions((prev) => prev.map((item) => (item.id === id ? { ...item, ...s } : item)));
  };

  const deleteSubscription = async (id: string) => {
    await supabase.from("subscriptions").delete().eq("id", id).eq("user_id", user?.id);
    setSubscriptions((prev) => prev.filter((item) => item.id !== id));
  };

  const addTrial = async (t: Omit<Trial, "id" | "created_at" | "user_id">) => {
    if (!user) return;
    const { data, error } = await supabase.from("trials").insert({ ...t, user_id: user.id }).select().single();
    if (!error && data) setTrials((prev) => [data as Trial, ...prev]);
  };

  const updateTrial = async (id: string, t: Partial<Trial>) => {
    await supabase.from("trials").update(t).eq("id", id).eq("user_id", user?.id);
    setTrials((prev) => prev.map((item) => (item.id === id ? { ...item, ...t } : item)));
  };

  const deleteTrial = async (id: string) => {
    await supabase.from("trials").delete().eq("id", id).eq("user_id", user?.id);
    setTrials((prev) => prev.filter((item) => item.id !== id));
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
        updateTransaction,
        deleteTransaction,
        addBudget,
        updateBudget,
        deleteBudget,
        addGoal,
        updateGoal,
        deleteGoal,
        addToGoal,
        addDebt,
        updateDebt,
        deleteDebt,
        payDebt,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        addTrial,
        updateTrial,
        deleteTrial,
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
