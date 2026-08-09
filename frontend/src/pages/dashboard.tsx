import React, { useEffect, useRef, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────



interface Transaction {
  icon: string;
  iconBg: string;
  iconColor: string;
  merchant: string;
  time: string;
  amount: string;
  isIncome?: boolean;
}

interface SpendingCategory {
  label: string;
  pct: number;
  dotColor: string;
}

interface SavingsGoal {
  label: string;
  current: number;
  target: number;
  pct: number;
}

// ─── Static data ─────────────────────────────────────────────────────────────



const TRANSACTIONS: Transaction[] = [
  { icon: "restaurant",   iconBg: "bg-orange-50", iconColor: "text-orange-600", merchant: "Whole Foods Market", time: "Today, 10:45 AM",  amount: "-$152.00"    },
  { icon: "commute",      iconBg: "bg-blue-50",   iconColor: "text-blue-600",   merchant: "Uber Trip",          time: "Yesterday",         amount: "-$24.50"     },
  { icon: "payments",     iconBg: "bg-green-50",  iconColor: "text-green-600",  merchant: "Salary Deposit",     time: "Nov 25, 2024",      amount: "+$5,200.00", isIncome: true },
  { icon: "shopping_bag", iconBg: "bg-purple-50", iconColor: "text-purple-600", merchant: "Apple Store",        time: "Nov 24, 2024",      amount: "-$1,299.00"  },
];

const SPENDING: SpendingCategory[] = [
  { label: "Housing & Rent",   pct: 42, dotColor: "bg-[#006a61]"  },
  { label: "Food & Dining",    pct: 18, dotColor: "bg-[#064e3b]"  },
  { label: "Entertainment",    pct: 12, dotColor: "bg-[#80bea6]"  },
  { label: "Others",           pct: 28, dotColor: "bg-[#d3daef]"  },
];

const GOALS: SavingsGoal[] = [
  { label: "New Car",        current: 25000, target: 40000, pct: 62.5 },
  { label: "Emergency Fund", current: 12000, target: 15000, pct: 80   },
  { label: "Japan Trip 2025",current:  2400, target:  6000, pct: 40   },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const glassCard: React.CSSProperties = {
  background: "#ffffff",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border:         "1px solid rgba(0,0,0,0.05)",
  boxShadow:      "0px 4px 20px rgba(0,0,0,0.03)",
};

/** Animates a numeric value from 0 to `end` over `duration` ms. */
function useCountUp(end: number, duration = 1800): string {
  const [display, setDisplay] = useState("$0.00");
  const frame = useRef<number>(0);

  useEffect(() => {
    let start: number | null = null;

    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const value = Math.floor(progress * end);
      setDisplay(
        value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
      );
      if (progress < 1) frame.current = requestAnimationFrame(step);
    };

    frame.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame.current);
  }, [end, duration]);

  return display;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

// Sidebar and TopBar moved to shared components

/** Large hero card — Total Net Worth with animated counter. */
function NetWorthCard() {
  const displayValue = useCountUp(124592);

  return (
    <div
      className="col-span-12 lg:col-span-8 rounded-[32px] text-[#141b2b] relative overflow-hidden shadow-xl"
      style={{ ...glassCard, padding: "48px" }}
    >
      {/* Decorative blobs */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-black/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-10 bottom-0 w-32 h-32 rounded-full blur-2xl pointer-events-none"
        style={{ background: "rgba(134,242,228,0.2)" }} />

      <div className="relative z-10">
        <p className="text-xs font-semibold opacity-80 uppercase tracking-widest mb-2">
          Total Net Worth
        </p>
        <h3 className="font-bold tracking-tight mb-8" style={{ fontSize: "48px", lineHeight: "56px" }}>
          {displayValue}
        </h3>

        <div
          className="grid grid-cols-2 border-t border-black/5"
          style={{ gap: "24px", paddingTop: "48px" }}
        >
          {[
            { icon: "trending_up",   iconColor: "#006a61", label: "Income This Month",   value: "+$8,420.00"  },
            { icon: "trending_down", iconColor: "#ba1a1a", label: "Expenses This Month",  value: "-$3,150.24"  },
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

/** Circular gauge — Financial Health Score. */
function HealthScoreCard() {
  // SVG gauge: circumference of r=88 is ≈552.9; offset 110 ≈ 80% filled
  const CIRCUMFERENCE = 2 * Math.PI * 88; // ≈552.9

  return (
    <div
      className="col-span-12 lg:col-span-4 rounded-[32px] flex flex-col items-center justify-center text-center"
      style={{ ...glassCard, padding: "24px" }}
    >
      <p className="text-xs font-semibold text-[#404944] mb-6 uppercase tracking-wider">
        Financial Health Score
      </p>

      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          {/* Track */}
          <circle cx="96" cy="96" r="88" fill="transparent" stroke="#dce2f7" strokeWidth="12" />
          {/* Progress */}
          <circle
            cx="96" cy="96" r="88"
            fill="transparent"
            stroke="#006a61"
            strokeWidth="14"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={110}
            className="drop-shadow-sm"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-semibold text-[#003527]">82</span>
          <span className="text-xs font-bold text-[#006a61]">EXCELLENT</span>
        </div>
      </div>

      <p className="mt-6 text-base text-[#404944] px-4">
        Your credit utilization and saving habits are in the top 5%.
      </p>
    </div>
  );
}

/** Spending category breakdown list. */
function SpendingInsightsCard() {
  return (
    <div
      className="col-span-12 lg:col-span-4 rounded-[32px]"
      style={{ ...glassCard, padding: "48px" }}
    >
      <div className="flex justify-between items-center" style={{ marginBottom: "48px" }}>
        <h4 className="text-2xl font-semibold text-[#003527]">Spending Insights</h4>
        <span className="material-symbols-outlined text-[#404944] cursor-pointer">more_horiz</span>
      </div>

      <div className="flex flex-col gap-6">
        {SPENDING.map(({ label, pct, dotColor }) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${dotColor}`} />
              <span className="text-base text-[#404944]">{label}</span>
            </div>
            <span className="text-sm font-semibold">{pct}%</span>
          </div>
        ))}
      </div>

      <button
        className="w-full py-3 text-[#006a61] text-sm font-semibold rounded-xl hover:bg-[#006a61]/5 transition-all"
        style={{ marginTop: "48px", border: "1px solid rgba(0,106,97,0.2)" }}
      >
        View Monthly Report
      </button>
    </div>
  );
}

/** Recent transactions list. */
function RecentTransactionsCard() {
  return (
    <div
      className="col-span-12 lg:col-span-5 rounded-[32px]"
      style={{ ...glassCard, padding: "48px" }}
    >
      <div className="flex justify-between items-center" style={{ marginBottom: "48px" }}>
        <h4 className="text-2xl font-semibold text-[#003527]">Recent Transactions</h4>
        <a href="#" className="text-sm font-semibold text-[#006a61]">See All</a>
      </div>

      <div className="space-y-6">
        {TRANSACTIONS.map((tx, i) => (
          <div key={i} className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl ${tx.iconBg} flex items-center justify-center ${tx.iconColor}`}>
                <span className="material-symbols-outlined">{tx.icon}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#141b2b] group-hover:text-[#003527] transition-colors">
                  {tx.merchant}
                </p>
                <p className="text-xs text-[#404944]">{tx.time}</p>
              </div>
            </div>
            <p className={`text-xl font-semibold ${tx.isIncome ? "text-[#006a61]" : "text-[#141b2b]"}`}>
              {tx.amount}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Savings goals with glowing progress bars. */
function SavingsGoalsCard() {
  return (
    <div
      className="col-span-12 lg:col-span-3 rounded-[32px] flex flex-col"
      style={{ ...glassCard, padding: "48px" }}
    >
      <h4 className="text-2xl font-semibold text-[#003527]" style={{ marginBottom: "48px" }}>
        Savings Goals
      </h4>

      <div className="space-y-8 flex-1">
        {GOALS.map(({ label, current, target, pct }) => (
          <div key={label}>
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-sm font-semibold text-[#141b2b]">{label}</p>
                <p className="text-xs text-[#404944]">
                  ${current.toLocaleString()} / ${target.toLocaleString()}
                </p>
              </div>
              <span className="text-sm font-semibold text-[#006a61]">{Math.round(pct)}%</span>
            </div>
            <div className="w-full h-3 bg-[#dce2f7] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#006a61] rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  boxShadow: "0 0 12px rgba(134,242,228,0.4)",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <button className="mt-8 flex items-center justify-center gap-2 text-[#404944] hover:text-[#003527] transition-colors py-2">
        <span className="material-symbols-outlined">add_circle</span>
        <span className="text-sm font-semibold">Add New Goal</span>
      </button>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  return (
    <>
      {/* Greeting */}
      <section style={{ marginTop: "32px", marginBottom: "80px" }}>
        <h2 className="text-2xl font-semibold text-[#003527]">
          Good morning, Peter.
        </h2>
        <p className="text-lg text-[#404944] mt-1">
          You&apos;re on track to hit your savings goal this month! ✨
        </p>
      </section>

      {/* Bento grid */}
      <div className="grid grid-cols-12" style={{ gap: "24px" }}>
        <NetWorthCard />
        <HealthScoreCard />
        <SpendingInsightsCard />
        <RecentTransactionsCard />
        <SavingsGoalsCard />
      </div>

      {/* Footer */}
      <footer
        className="flex justify-between items-center border-t border-black/5"
        style={{ marginTop: "80px", padding: "32px 0" }}
      >
        <p className="text-xs text-[#006a61]">
          © 2024 Mamani Financial. All rights reserved.
        </p>
        <div className="flex gap-6">
          {["Privacy Policy", "Terms of Service", "Security"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-xs text-[#404944] hover:text-[#003527] transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      </footer>
    </>
  );
}