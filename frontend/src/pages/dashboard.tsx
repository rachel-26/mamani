import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../hooks/useCurrency";
import { getTransactionSummary } from "../api/transactions";
import { getGoals } from "../api/goals";
import { getMe } from "../api/users";

// ─── Types ───────────────────────────────────────────────────────────────────

interface RecentTransaction {
  id: number;
  title: string;
  category: string;
  amount: number;
  is_expense: boolean;
  account: string;
  date: string;
}

interface Summary {
  net_worth: number;
  total_income: number;
  total_expenses: number;
  savings_rate: number;
  recent_transactions: RecentTransaction[];
}

interface Goal {
  id: number;
  title: string;
  saved_amount: number;
  target_amount: number;
  progress_percentage: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const glassCard: React.CSSProperties = {
  background: "#ffffff",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(0,0,0,0.05)",
  boxShadow: "0px 4px 20px rgba(0,0,0,0.03)",
};

const CATEGORY_ICONS: Record<string, { icon: string; bg: string; color: string }> = {
  Housing:       { icon: "home",            bg: "bg-orange-50",  color: "text-orange-600" },
  Food:          { icon: "restaurant",      bg: "bg-amber-50",   color: "text-amber-600"  },
  Transport:     { icon: "commute",         bg: "bg-blue-50",    color: "text-blue-600"   },
  Utilities:     { icon: "bolt",            bg: "bg-yellow-50",  color: "text-yellow-600" },
  Health:        { icon: "medical_services",bg: "bg-rose-50",    color: "text-rose-600"   },
  Shopping:      { icon: "shopping_bag",    bg: "bg-purple-50",  color: "text-purple-600" },
  Entertainment: { icon: "movie",           bg: "bg-pink-50",    color: "text-pink-600"   },
  Income:        { icon: "payments",        bg: "bg-green-50",   color: "text-green-600"  },
  Dining:        { icon: "restaurant",      bg: "bg-amber-50",   color: "text-amber-600"  },
  Electronics:   { icon: "devices",         bg: "bg-indigo-50",  color: "text-indigo-600" },
  Others:        { icon: "category",        bg: "bg-gray-50",    color: "text-gray-600"   },
};

function getCategoryMeta(category: string) {
  return CATEGORY_ICONS[category] || CATEGORY_ICONS["Others"];
}

function formatRelativeDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return `Today, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Animates a numeric value from 0 to `end` over `duration` ms. */
function useCountUp(end: number, duration = 1800): string {
  const [display, setDisplay] = useState("0");
  const frame = useRef<number>(0);

  useEffect(() => {
    if (!end && end !== 0) return;
    let start: number | null = null;

    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const value = Math.floor(progress * end);
      setDisplay(value.toLocaleString("en-US"));
      if (progress < 1) frame.current = requestAnimationFrame(step);
    };

    frame.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame.current);
  }, [end, duration]);

  return display;
}

// ─── Skeleton loaders ────────────────────────────────────────────────────────

function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-[32px] bg-white animate-pulse ${className}`} style={{ ...glassCard }}>
      <div className="p-12 space-y-4">
        <div className="h-4 bg-gray-100 rounded w-1/3" />
        <div className="h-10 bg-gray-100 rounded w-1/2" />
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-4 bg-gray-100 rounded w-3/4" />
      </div>
    </div>
  );
}

// ─── Cards ───────────────────────────────────────────────────────────────────

function NetWorthCard({ summary }: { summary: Summary | null }) {
  const { symbol } = useCurrency();
  const displayValue = useCountUp(summary?.net_worth ?? 0);

  return (
    <div
      className="col-span-12 lg:col-span-8 rounded-[32px] text-[#141b2b] relative overflow-hidden shadow-xl"
      style={{ ...glassCard, padding: "48px" }}
    >
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-black/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-10 bottom-0 w-32 h-32 rounded-full blur-2xl pointer-events-none"
        style={{ background: "rgba(134,242,228,0.2)" }} />

      <div className="relative z-10">
        <p className="text-xs font-semibold opacity-80 uppercase tracking-widest mb-2">Total Net Worth</p>
        <h3 className="font-bold tracking-tight mb-8" style={{ fontSize: "48px", lineHeight: "56px" }}>
          {symbol}{displayValue}
        </h3>

        <div className="grid grid-cols-2 border-t border-black/5" style={{ gap: "24px", paddingTop: "48px" }}>
          {[
            { icon: "trending_up",   iconColor: "#006a61", label: "Income This Month",  value: `+${symbol}${(summary?.total_income ?? 0).toLocaleString()}` },
            { icon: "trending_down", iconColor: "#ba1a1a", label: "Expenses This Month", value: `-${symbol}${(summary?.total_expenses ?? 0).toLocaleString()}` },
          ].map(({ icon, iconColor, label, value }) => (
            <div key={label} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined" style={{ color: iconColor }}>{icon}</span>
              </div>
              <div>
                <p className="text-xs opacity-80">{label}</p>
                <p className="text-xl font-semibold">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HealthScoreCard({ savingsRate }: { savingsRate: number }) {
  const CIRCUMFERENCE = 2 * Math.PI * 88;
  const score = Math.min(Math.round(savingsRate), 100);
  const label = score >= 70 ? "EXCELLENT" : score >= 40 ? "GOOD" : "NEEDS WORK";
  const strokeColor = score >= 70 ? "#006a61" : score >= 40 ? "#4caf50" : "#ba1a1a";
  const offset = CIRCUMFERENCE * (1 - score / 100);

  return (
    <div className="col-span-12 lg:col-span-4 rounded-[32px] flex flex-col items-center justify-center text-center"
      style={{ ...glassCard, padding: "24px" }}>
      <p className="text-xs font-semibold text-[#404944] mb-6 uppercase tracking-wider">Savings Rate</p>

      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          <circle cx="96" cy="96" r="88" fill="transparent" stroke="#dce2f7" strokeWidth="12" />
          <circle cx="96" cy="96" r="88" fill="transparent" stroke={strokeColor}
            strokeWidth="14" strokeDasharray={CIRCUMFERENCE} strokeDashoffset={offset}
            className="drop-shadow-sm transition-all duration-1000" />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-semibold text-[#003527]">{score}%</span>
          <span className="text-xs font-bold" style={{ color: strokeColor }}>{label}</span>
        </div>
      </div>

      <p className="mt-6 text-base text-[#404944] px-4">
        {score >= 70 ? "Great job! Your saving habits are excellent." : "Keep saving consistently to improve your score."}
      </p>
    </div>
  );
}

function RecentTransactionsCard({ transactions }: { transactions: RecentTransaction[] }) {
  const { symbol } = useCurrency();
  const navigate = useNavigate();

  return (
    <div className="col-span-12 lg:col-span-5 rounded-[32px]" style={{ ...glassCard, padding: "48px" }}>
      <div className="flex justify-between items-center" style={{ marginBottom: "48px" }}>
        <h4 className="text-2xl font-semibold text-[#003527]">Recent Transactions</h4>
        <Link to="/transactions" className="text-sm font-semibold text-[#006a61] hover:underline">See All</Link>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-8">
          <span className="material-symbols-outlined text-4xl text-gray-300 mb-2 block">receipt_long</span>
          <p className="text-sm text-[#404944]">No transactions yet.</p>
          <button
            onClick={() => navigate('/transactions')}
            className="mt-4 text-sm text-[#006a61] font-semibold hover:underline"
          >
            Add your first transaction →
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {transactions.map((tx) => {
            const meta = getCategoryMeta(tx.is_expense ? tx.category : "Income");
            return (
              <div key={tx.id} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${meta.bg} flex items-center justify-center ${meta.color}`}>
                    <span className="material-symbols-outlined">{meta.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#141b2b] group-hover:text-[#003527] transition-colors">{tx.title}</p>
                    <p className="text-xs text-[#404944]">{formatRelativeDate(tx.date)}</p>
                  </div>
                </div>
                <p className={`text-xl font-semibold ${tx.is_expense ? "text-[#141b2b]" : "text-[#006a61]"}`}>
                  {tx.is_expense ? "-" : "+"}{symbol}{tx.amount.toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SavingsGoalsCard({ goals }: { goals: Goal[] }) {
  const { symbol } = useCurrency();
  const navigate = useNavigate();
  const displayGoals = goals.slice(0, 3);

  return (
    <div className="col-span-12 lg:col-span-3 rounded-[32px] flex flex-col" style={{ ...glassCard, padding: "48px" }}>
      <h4 className="text-2xl font-semibold text-[#003527]" style={{ marginBottom: "48px" }}>Savings Goals</h4>

      {displayGoals.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">track_changes</span>
          <p className="text-sm text-[#404944]">No goals yet.</p>
        </div>
      ) : (
        <div className="space-y-8 flex-1">
          {displayGoals.map((goal) => (
            <div key={goal.id}>
              <div className="flex justify-between items-end mb-2">
                <div>
                  <p className="text-sm font-semibold text-[#141b2b]">{goal.title}</p>
                  <p className="text-xs text-[#404944]">
                    {symbol}{goal.saved_amount.toLocaleString()} / {symbol}{goal.target_amount.toLocaleString()}
                  </p>
                </div>
                <span className="text-sm font-semibold text-[#006a61]">{Math.round(goal.progress_percentage)}%</span>
              </div>
              <div className="w-full h-3 bg-[#dce2f7] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#006a61] rounded-full transition-all duration-700"
                  style={{ width: `${goal.progress_percentage}%`, boxShadow: "0 0 12px rgba(134,242,228,0.4)" }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => navigate('/goals')}
        className="mt-8 flex items-center justify-center gap-2 text-[#404944] hover:text-[#003527] transition-colors py-2"
      >
        <span className="material-symbols-outlined">add_circle</span>
        <span className="text-sm font-semibold">Add New Goal</span>
      </button>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { data: summary, loading: summaryLoading } = useApi<Summary>(getTransactionSummary);
  const { data: goals, loading: goalsLoading } = useApi<Goal[]>(getGoals);
  const { data: user } = useApi(getMe);

  const firstName = user?.full_name?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const loading = summaryLoading || goalsLoading;

  return (
    <>
      {/* Greeting */}
      <section style={{ marginTop: "32px", marginBottom: "80px" }}>
        <h2 className="text-2xl font-semibold text-[#003527]">
          {greeting}, {firstName}.
        </h2>
        <p className="text-lg text-[#404944] mt-1">
          {summary && summary.savings_rate >= 20
            ? "You're on track to hit your savings goal this month! ✨"
            : "Let's keep building toward your financial goals. 💪"}
        </p>
      </section>

      {/* Bento grid */}
      {loading ? (
        <div className="grid grid-cols-12" style={{ gap: "24px" }}>
          <SkeletonCard className="col-span-12 lg:col-span-8" />
          <SkeletonCard className="col-span-12 lg:col-span-4" />
          <SkeletonCard className="col-span-12 lg:col-span-5" />
          <SkeletonCard className="col-span-12 lg:col-span-3" />
        </div>
      ) : (
        <div className="grid grid-cols-12" style={{ gap: "24px" }}>
          <NetWorthCard summary={summary} />
          <HealthScoreCard savingsRate={summary?.savings_rate ?? 0} />
          <RecentTransactionsCard transactions={summary?.recent_transactions ?? []} />
          <SavingsGoalsCard goals={goals ?? []} />
        </div>
      )}

      {/* Footer */}
      <footer className="flex justify-between items-center border-t border-black/5" style={{ marginTop: "80px", padding: "32px 0" }}>
        <p className="text-xs text-[#006a61]">© 2024 Mamani Financial. All rights reserved.</p>
        <div className="flex gap-6">
          {["Privacy Policy", "Terms of Service", "Security"].map((link) => (
            <a key={link} href="#" className="text-xs text-[#404944] hover:text-[#003527] transition-colors">{link}</a>
          ))}
        </div>
      </footer>
    </>
  );
}