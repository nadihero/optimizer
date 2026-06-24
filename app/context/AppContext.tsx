"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
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
  error: string | null;
  refreshData: () => Promise<void>;
  addTransaction: (tx: Omit<Transaction, "id" | "created_at" | "user_id">) => Promise<{ error: string | null }>;
  updateTransaction: (id: string, tx: Partial<Transaction>) => Promise<{ error: string | null }>;
  deleteTransaction: (id: string) => Promise<{ error: string | null }>;
  addBudget: (b: Omit<Budget, "id" | "created_at" | "user_id">) => Promise<{ error: string | null }>;
  updateBudget: (id: string, b: Partial<Budget>) => Promise<{ error: string | null }>;
  deleteBudget: (id: string) => Promise<{ error: string | null }>;
  addGoal: (g: Omit<Goal, "id" | "created_at" | "user_id">) => Promise<{ error: string | null }>;
  updateGoal: (id: string, g: Partial<Goal>) => Promise<{ error: string | null }>;
  deleteGoal: (id: string) => Promise<{ error: string | null }>;
  addToGoal: (id: string, amount: number) => Promise<{ error: string | null }>;
  addDebt: (d: Omit<Debt, "id" | "created_at" | "user_id">) => Promise<{ error: string | null }>;
  updateDebt: (id: string, d: Partial<Debt>) => Promise<{ error: string | null }>;
  deleteDebt: (id: string) => Promise<{ error: string | null }>;
  payDebt: (id: string, amount: number) => Promise<{ error: string | null }>;
  addSubscription: (s: Omit<Subscription, "id" | "created_at" | "user_id">) => Promise<{ error: string | null }>;
  updateSubscription: (id: string, s: Partial<Subscription>) => Promise<{ error: string | null }>;
  deleteSubscription: (id: string) => Promise<{ error: string | null }>;
  addTrial: (t: Omit<Trial, "id" | "created_at" | "user_id">) => Promise<{ error: string | null }>;
  updateTrial: (id: string, t: Partial<Trial>) => Promise<{ error: string | null }>;
  deleteTrial: (id: string) => Promise<{ error: string | null }>;
}

const AppContext = createContext<AppState | undefined>(undefined);

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object") {
    const e = error as Record<string, unknown>;
    if (typeof e.message === "string") return e.message;
    if (typeof e.details === "string") return e.details;
    if (typeof e.hint === "string") return e.hint;
    return JSON.stringify(error);
  }
  return String(error);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
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
    setError(null);
    try {
      console.log("[AppContext] Fetching data for user:", user.id);

      const [txRes, budgetRes, goalRes, debtRes, subRes, trialRes] = await Promise.all([
        supabase.from("transactions").select("*").eq("user_id", user.id).order("date", { ascending: false }),
        supabase.from("budgets").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("goals").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("debts").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("subscriptions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("trials").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);

      if (txRes.error) {
        console.error("[AppContext] Transactions error:", txRes.error);
        setError(`Transactions: ${getErrorMessage(txRes.error)}`);
      }
      if (budgetRes.error) console.error("[AppContext] Budgets error:", budgetRes.error);
      if (goalRes.error) console.error("[AppContext] Goals error:", goalRes.error);
      if (debtRes.error) console.error("[AppContext] Debts error:", debtRes.error);
      if (subRes.error) console.error("[AppContext] Subscriptions error:", subRes.error);
      if (trialRes.error) console.error("[AppContext] Trials error:", trialRes.error);

      if (txRes.data) setTransactions(txRes.data as Transaction[]);
      if (budgetRes.data) setBudgets(budgetRes.data as Budget[]);
      if (goalRes.data) setGoals(goalRes.data as Goal[]);
      if (debtRes.data) setDebts(debtRes.data as Debt[]);
      if (subRes.data) setSubscriptions(subRes.data as Subscription[]);
      if (trialRes.data) setTrials(trialRes.data as Trial[]);

      console.log("[AppContext] Data fetched:", {
        transactions: txRes.data?.length || 0,
        budgets: budgetRes.data?.length || 0,
        goals: goalRes.data?.length || 0,
        debts: debtRes.data?.length || 0,
        subscriptions: subRes.data?.length || 0,
        trials: trialRes.data?.length || 0,
      });
    } catch (err) {
      console.error("[AppContext] Error fetching data:", err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addTransaction = async (tx: Omit<Transaction, "id" | "created_at" | "user_id">) => {
    if (!user) return { error: "Not authenticated" };
    console.log("[AppContext] Adding transaction:", tx);
    const { data, error } = await supabase.from("transactions").insert({ ...tx, user_id: user.id }).select().single();
    if (error) { console.error("[AppContext] Add transaction error:", error); return { error: getErrorMessage(error) }; }
    if (data) setTransactions((prev) => [data as Transaction, ...prev]);
    return { error: null };
  };

  const updateTransaction = async (id: string, tx: Partial<Transaction>) => {
    if (!user) return { error: "Not authenticated" };
    console.log("[AppContext] Updating transaction:", id, tx);
    const { error } = await supabase.from("transactions").update(tx).eq("id", id).eq("user_id", user.id);
    if (error) { console.error("[AppContext] Update transaction error:", error); return { error: getErrorMessage(error) }; }
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...tx } : t)));
    return { error: null };
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return { error: "Not authenticated" };
    console.log("[AppContext] Deleting transaction:", id);
    const { error } = await supabase.from("transactions").delete().eq("id", id).eq("user_id", user.id);
    if (error) { console.error("[AppContext] Delete transaction error:", error); return { error: getErrorMessage(error) }; }
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    return { error: null };
  };

  const addBudget = async (b: Omit<Budget, "id" | "created_at" | "user_id">) => {
    if (!user) return { error: "Not authenticated" };
    console.log("[AppContext] Adding budget:", b);
    const { data, error } = await supabase.from("budgets").insert({ ...b, user_id: user.id }).select().single();
    if (error) { console.error("[AppContext] Add budget error:", error); return { error: getErrorMessage(error) }; }
    if (data) setBudgets((prev) => [data as Budget, ...prev]);
    return { error: null };
  };

  const updateBudget = async (id: string, b: Partial<Budget>) => {
    if (!user) return { error: "Not authenticated" };
    console.log("[AppContext] Updating budget:", id, b);
    const { error } = await supabase.from("budgets").update(b).eq("id", id).eq("user_id", user.id);
    if (error) { console.error("[AppContext] Update budget error:", error); return { error: getErrorMessage(error) }; }
    setBudgets((prev) => prev.map((item) => (item.id === id ? { ...item, ...b } : item)));
    return { error: null };
  };

  const deleteBudget = async (id: string) => {
    if (!user) return { error: "Not authenticated" };
    console.log("[AppContext] Deleting budget:", id);
    const { error } = await supabase.from("budgets").delete().eq("id", id).eq("user_id", user.id);
    if (error) { console.error("[AppContext] Delete budget error:", error); return { error: getErrorMessage(error) }; }
    setBudgets((prev) => prev.filter((item) => item.id !== id));
    return { error: null };
  };

  const addGoal = async (g: Omit<Goal, "id" | "created_at" | "user_id">) => {
    if (!user) return { error: "Not authenticated" };
    console.log("[AppContext] Adding goal:", g);
    const { data, error } = await supabase.from("goals").insert({ ...g, user_id: user.id }).select().single();
    if (error) { console.error("[AppContext] Add goal error:", error); return { error: getErrorMessage(error) }; }
    if (data) setGoals((prev) => [data as Goal, ...prev]);
    return { error: null };
  };

  const updateGoal = async (id: string, g: Partial<Goal>) => {
    if (!user) return { error: "Not authenticated" };
    console.log("[AppContext] Updating goal:", id, g);
    const { error } = await supabase.from("goals").update(g).eq("id", id).eq("user_id", user.id);
    if (error) { console.error("[AppContext] Update goal error:", error); return { error: getErrorMessage(error) }; }
    setGoals((prev) => prev.map((item) => (item.id === id ? { ...item, ...g } : item)));
    return { error: null };
  };

  const deleteGoal = async (id: string) => {
    if (!user) return { error: "Not authenticated" };
    console.log("[AppContext] Deleting goal:", id);
    const { error } = await supabase.from("goals").delete().eq("id", id).eq("user_id", user.id);
    if (error) { console.error("[AppContext] Delete goal error:", error); return { error: getErrorMessage(error) }; }
    setGoals((prev) => prev.filter((item) => item.id !== id));
    return { error: null };
  };

  const addToGoal = async (id: string, amount: number) => {
    if (!user) return { error: "Not authenticated" };
    const goal = goals.find((g) => g.id === id);
    if (!goal) return { error: "Goal not found" };
    const newAmount = goal.current_amount + amount;
    console.log("[AppContext] Adding to goal:", id, amount, "new total:", newAmount);
    const { error } = await supabase.from("goals").update({ current_amount: newAmount }).eq("id", id).eq("user_id", user.id);
    if (error) { console.error("[AppContext] Add to goal error:", error); return { error: getErrorMessage(error) }; }
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, current_amount: newAmount } : g)));
    return { error: null };
  };

  const addDebt = async (d: Omit<Debt, "id" | "created_at" | "user_id">) => {
    if (!user) return { error: "Not authenticated" };
    console.log("[AppContext] Adding debt:", d);
    const { data, error } = await supabase.from("debts").insert({ ...d, user_id: user.id }).select().single();
    if (error) { console.error("[AppContext] Add debt error:", error); return { error: getErrorMessage(error) }; }
    if (data) setDebts((prev) => [data as Debt, ...prev]);
    return { error: null };
  };

  const updateDebt = async (id: string, d: Partial<Debt>) => {
    if (!user) return { error: "Not authenticated" };
    console.log("[AppContext] Updating debt:", id, d);
    const { error } = await supabase.from("debts").update(d).eq("id", id).eq("user_id", user.id);
    if (error) { console.error("[AppContext] Update debt error:", error); return { error: getErrorMessage(error) }; }
    setDebts((prev) => prev.map((item) => (item.id === id ? { ...item, ...d } : item)));
    return { error: null };
  };

  const deleteDebt = async (id: string) => {
    if (!user) return { error: "Not authenticated" };
    console.log("[AppContext] Deleting debt:", id);
    const { error } = await supabase.from("debts").delete().eq("id", id).eq("user_id", user.id);
    if (error) { console.error("[AppContext] Delete debt error:", error); return { error: getErrorMessage(error) }; }
    setDebts((prev) => prev.filter((item) => item.id !== id));
    return { error: null };
  };

  const payDebt = async (id: string, amount: number) => {
    if (!user) return { error: "Not authenticated" };
    const debt = debts.find((d) => d.id === id);
    if (!debt) return { error: "Debt not found" };
    const newPaid = debt.paid_amount + amount;
    console.log("[AppContext] Paying debt:", id, amount, "new paid:", newPaid);
    const { error } = await supabase.from("debts").update({ paid_amount: newPaid }).eq("id", id).eq("user_id", user.id);
    if (error) { console.error("[AppContext] Pay debt error:", error); return { error: getErrorMessage(error) }; }
    setDebts((prev) => prev.map((d) => (d.id === id ? { ...d, paid_amount: newPaid } : d)));
    return { error: null };
  };

  const addSubscription = async (s: Omit<Subscription, "id" | "created_at" | "user_id">) => {
    if (!user) return { error: "Not authenticated" };
    console.log("[AppContext] Adding subscription:", s);
    const { data, error } = await supabase.from("subscriptions").insert({ ...s, user_id: user.id }).select().single();
    if (error) { console.error("[AppContext] Add subscription error:", error); return { error: getErrorMessage(error) }; }
    if (data) setSubscriptions((prev) => [data as Subscription, ...prev]);
    return { error: null };
  };

  const updateSubscription = async (id: string, s: Partial<Subscription>) => {
    if (!user) return { error: "Not authenticated" };
    console.log("[AppContext] Updating subscription:", id, s);
    const { error } = await supabase.from("subscriptions").update(s).eq("id", id).eq("user_id", user.id);
    if (error) { console.error("[AppContext] Update subscription error:", error); return { error: getErrorMessage(error) }; }
    setSubscriptions((prev) => prev.map((item) => (item.id === id ? { ...item, ...s } : item)));
    return { error: null };
  };

  const deleteSubscription = async (id: string) => {
    if (!user) return { error: "Not authenticated" };
    console.log("[AppContext] Deleting subscription:", id);
    const { error } = await supabase.from("subscriptions").delete().eq("id", id).eq("user_id", user.id);
    if (error) { console.error("[AppContext] Delete subscription error:", error); return { error: getErrorMessage(error) }; }
    setSubscriptions((prev) => prev.filter((item) => item.id !== id));
    return { error: null };
  };

  const addTrial = async (t: Omit<Trial, "id" | "created_at" | "user_id">) => {
    if (!user) return { error: "Not authenticated" };
    console.log("[AppContext] Adding trial:", t);
    const { data, error } = await supabase.from("trials").insert({ ...t, user_id: user.id }).select().single();
    if (error) { console.error("[AppContext] Add trial error:", error); return { error: getErrorMessage(error) }; }
    if (data) setTrials((prev) => [data as Trial, ...prev]);
    return { error: null };
  };

  const updateTrial = async (id: string, t: Partial<Trial>) => {
    if (!user) return { error: "Not authenticated" };
    console.log("[AppContext] Updating trial:", id, t);
    const { error } = await supabase.from("trials").update(t).eq("id", id).eq("user_id", user.id);
    if (error) { console.error("[AppContext] Update trial error:", error); return { error: getErrorMessage(error) }; }
    setTrials((prev) => prev.map((item) => (item.id === id ? { ...item, ...t } : item)));
    return { error: null };
  };

  const deleteTrial = async (id: string) => {
    if (!user) return { error: "Not authenticated" };
    console.log("[AppContext] Deleting trial:", id);
    const { error } = await supabase.from("trials").delete().eq("id", id).eq("user_id", user.id);
    if (error) { console.error("[AppContext] Delete trial error:", error); return { error: getErrorMessage(error) }; }
    setTrials((prev) => prev.filter((item) => item.id !== id));
    return { error: null };
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
        error,
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
