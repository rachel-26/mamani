import React, { useState, useMemo } from 'react';
import { useCurrency } from '../hooks/useCurrency';
import { useApi } from '../hooks/useApi';
import { getTransactions } from '../api/transactions';


const InsightsPage: React.FC = () => {
  const { formatAmount } = useCurrency();
  const [timeRange, _setTimeRange] = useState('Last 6 Months');
  const { data: transactions } = useApi(getTransactions);

  // Compute category breakdown from real transactions
  const categoryBreakdown = useMemo(() => {
    if (!transactions) return [];
    const expenses = transactions.filter((t: any) => t.is_expense);
    const total = expenses.reduce((s: number, t: any) => s + t.amount, 0);
    const byCategory = expenses.reduce((acc: any, t: any) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
    const COLORS = ['bg-primary-container', 'bg-on-tertiary-container', 'bg-secondary'];
    return Object.entries(byCategory)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([name, amount], i) => ({
        name,
        percentage: total ? Math.round(((amount as number) / total) * 100) : 0,
        change: 0,
        color: COLORS[i] || 'bg-surface-container-high',
        amount: amount as number,
      }));
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    if (!transactions) return 0;
    return transactions.filter((t: any) => t.is_expense).reduce((s: number, t: any) => s + t.amount, 0);
  }, [transactions]);

  const totalIncome = useMemo(() => {
    if (!transactions) return 0;
    return transactions.filter((t: any) => !t.is_expense).reduce((s: number, t: any) => s + t.amount, 0);
  }, [transactions]);

  const weeklyData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const amounts = [0, 0, 0, 0, 0, 0, 0];
    if (transactions) {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      transactions
        .filter((t: any) => t.is_expense && new Date(t.date) >= oneWeekAgo)
        .forEach((t: any) => { amounts[new Date(t.date).getDay()] += t.amount; });
    }
    const max = Math.max(...amounts, 1);
    return days.map((day, i) => ({ day, amount: amounts[i], isMax: amounts[i] === max && max > 0 }));
  }, [transactions]);

  const getBarHeight = (amount: number) => {
    const maxAmount = Math.max(...weeklyData.map(d => d.amount));
    const percentage = (amount / maxAmount) * 100;
    return `${percentage}%`;
  };

  const getBarColor = (amount: number, isMax: boolean) => {
    if (isMax) return 'bg-primary-container';
    if (amount > 30) return 'bg-primary-container/80';
    if (amount > 20) return 'bg-primary-container/60';
    if (amount > 15) return 'bg-primary-container/20';
    return 'bg-surface-container-high';
  };

  return (
    <>
      <div className="text-on-surface">
        {/* Insights Content */}
        <div className="pt-8 px-gutter space-y-md">
          {/* Page Header */}
          <div className="flex justify-between items-end">
            <div>
              <h2 className="font-display-lg text-headline-md text-primary tracking-tight">Financial Insights</h2>
              <p className="font-body-md text-on-surface-variant">Analyze your growth and optimization opportunities.</p>
            </div>
            <div className="flex gap-2">
              <div className="glass-card flex items-center px-4 py-2 rounded-xl cursor-pointer hover:bg-white transition-all">
                <span className="material-symbols-outlined text-sm mr-2 text-primary">calendar_today</span>
                <span className="font-label-bold text-on-surface">{timeRange}</span>
                <span className="material-symbols-outlined ml-2 text-sm">expand_more</span>
              </div>
              <button className="bg-primary text-white p-2 px-4 rounded-xl font-label-bold flex items-center gap-2 hover:bg-primary-container transition-all">
                <span className="material-symbols-outlined text-base">download</span>
                Export
              </button>
            </div>
          </div>

          {/* Primary Chart Card */}
          <div className="glass-card p-md rounded-2xl">
            <div className="flex justify-between items-start mb-md">
              <div>
                <h3 className="font-label-bold text-lg text-on-surface">Spending vs Income</h3>
                <p className="text-label-sm text-on-surface-variant">Net cash flow performance over time</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary-container"></div>
                  <span className="text-label-sm text-on-surface-variant">Income</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-outline-variant"></div>
                  <span className="text-label-sm text-on-surface-variant">Spending</span>
                </div>
              </div>
            </div>
            {/* Mock Line Chart */}
            <div className="h-80 w-full chart-grid relative flex items-end justify-between px-md pb-base">
              <svg className="absolute inset-0 w-full h-full p-md pointer-events-none" viewBox="0 0 800 300">
                <path d="M0,240 Q100,200 200,220 T400,150 T600,100 T800,80" fill="none" stroke="#064e3b" strokeWidth="3"></path>
                <path d="M0,280 Q100,270 200,290 T400,260 T600,270 T800,250" fill="none" stroke="#bfc9c3" strokeDasharray="8 4" strokeWidth="3"></path>
              </svg>
              {/* Y-Axis Labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-outline p-2">
                <span>{formatAmount(12000)}</span>
                <span>{formatAmount(9000)}</span>
                <span>{formatAmount(6000)}</span>
                <span>{formatAmount(3000)}</span>
                <span>{formatAmount(0)}</span>
              </div>
              {/* X-Axis Labels */}
              <div className="flex justify-between w-full pt-4 border-t border-black/5">
                <span className="text-label-sm text-outline">Jan</span>
                <span className="text-label-sm text-outline">Feb</span>
                <span className="text-label-sm text-outline">Mar</span>
                <span className="text-label-sm text-outline">Apr</span>
                <span className="text-label-sm text-outline">May</span>
                <span className="text-label-sm text-on-surface font-bold">Jun</span>
              </div>
            </div>
          </div>

          {/* Bento Grid of Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            {/* Category Breakdown */}
            <div className="glass-card p-md rounded-2xl flex flex-col">
              <h3 className="font-label-bold text-on-surface mb-md">Category Breakdown</h3>
              <div className="flex-1 flex flex-col items-center justify-center space-y-md">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" fill="none" r="16" stroke="#e9edff" strokeWidth="4"></circle>
                    <circle cx="18" cy="18" fill="none" r="16" stroke="#064e3b" strokeDasharray="45, 100" strokeLinecap="round" strokeWidth="4"></circle>
                    <circle cx="18" cy="18" fill="none" r="16" stroke="#ff9939" strokeDasharray="25, 100" strokeDashoffset="-45" strokeLinecap="round" strokeWidth="4"></circle>
                    <circle cx="18" cy="18" fill="none" r="16" stroke="#006f66" strokeDasharray="15, 100" strokeDashoffset="-70" strokeLinecap="round" strokeWidth="4"></circle>
                  </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-label-bold text-primary">{formatAmount(totalExpenses)}</span>
                    <span className="text-[10px] text-outline uppercase tracking-wider">Spent</span>
                  </div>
                </div>
                <div className="w-full space-y-2">
                  {(categoryBreakdown.length > 0 ? categoryBreakdown : [{name:'No data',percentage:0,change:0,color:'bg-surface-container-high'}]).map((category) => (
                    <div key={category.name} className="flex justify-between items-center text-label-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${category.color}`}></div>
                        <span>{category.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{category.percentage}%</span>
                        <span className={`text-[10px] flex items-center ${
                          category.change > 0 ? 'text-error' : 
                          category.change < 0 ? 'text-secondary' : 'text-outline'
                        }`}>
                          {category.change !== 0 && (
                            <span className="material-symbols-outlined text-[12px]">
                              {category.change > 0 ? 'arrow_upward' : 'arrow_downward'}
                            </span>
                          )}
                          {category.change !== 0 ? Math.abs(category.change) + '%' : '--'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Weekly Spending */}
            <div className="glass-card p-md rounded-2xl flex flex-col">
              <h3 className="font-label-bold text-on-surface mb-md">Weekly Heatmap</h3>
              <div className="flex-1 grid grid-cols-7 gap-2 items-end pb-2">
                {weeklyData.map((day) => (
                  <div key={day.day} className="space-y-1 text-center">
                    <div 
                      className={`${getBarColor(day.amount, day.isMax)} w-full rounded-lg relative group`}
                      style={{ height: getBarHeight(day.amount) }}
                    >
                      {day.isMax && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-background text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Max
                        </div>
                      )}
                    </div>
                    <span className={`text-[10px] ${day.isMax ? 'text-on-surface font-bold' : 'text-outline'}`}>
                      {day.day}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-label-sm text-on-surface-variant mt-md">
                {totalIncome > 0
                  ? <>You save <span className="font-bold text-primary">{Math.round((totalIncome - totalExpenses) / totalIncome * 100)}%</span> of your income on average.</>
                  : 'Add transactions to see your spending patterns.'}
              </p>
            </div>

            {/* Savings Rate */}
            <div className="glass-card p-md rounded-2xl flex flex-col items-center text-center">
              <div className="w-full flex justify-between items-center mb-md">
                <h3 className="font-label-bold text-on-surface">Savings Rate</h3>
                <span className="material-symbols-outlined text-outline text-lg">help_outline</span>
              </div>
              <div className="circular-progress relative mb-md" style={{ '--percentage': 68 } as React.CSSProperties}>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display-lg text-headline-md text-primary">
                    {totalIncome > 0 ? `${Math.min(Math.round((totalIncome - totalExpenses) / totalIncome * 100), 100)}%` : '--'}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-label-bold text-secondary">Target Met!</p>
                <p className="text-label-sm text-on-surface-variant">You've reached your monthly savings goal of {formatAmount(2500)}.</p>
              </div>
            </div>
          </div>

          {/* Smart Tips Section */}
          <section className="space-y-md">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-on-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <h3 className="font-headline-md text-primary">Smart Tips</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card p-md rounded-2xl flex items-start gap-4 border-l-4 border-on-tertiary-container">
                <div className="bg-tertiary-fixed p-2 rounded-lg">
                  <span className="material-symbols-outlined text-on-tertiary-fixed-variant">restaurant</span>
                </div>
                <div>
                  <h4 className="font-label-bold text-on-surface">Dining Efficiency</h4>
                  <p className="text-body-md text-on-surface-variant mt-1">You spent 15% less on dining out this week! Redirecting those {formatAmount(120)} to your "Vacation" goal could shorten your timeline by 2 months.</p>
                  <button className="mt-2 text-primary font-label-bold flex items-center hover:gap-2 transition-all">
                    Move to Savings <span className="material-symbols-outlined text-sm ml-1">chevron_right</span>
                  </button>
                </div>
              </div>
              <div className="glass-card p-md rounded-2xl flex items-start gap-4 border-l-4 border-secondary">
                <div className="bg-secondary-fixed p-2 rounded-lg">
                  <span className="material-symbols-outlined text-on-secondary-fixed-variant">subscriptions</span>
                </div>
                <div>
                  <h4 className="font-label-bold text-on-surface">Subscription Audit</h4>
                  <p className="text-body-md text-on-surface-variant mt-1">We found 3 overlapping media subscriptions costing {formatAmount(45)}/mo. Canceling 2 could save you {formatAmount(540)} annually.</p>
                  <button className="mt-2 text-primary font-label-bold flex items-center hover:gap-2 transition-all">
                    Review Subscriptions <span className="material-symbols-outlined text-sm ml-1">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <style>{`
        .glass-card {
          background: #ffffff;
          backdrop-filter: blur(12px);
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.03);
          transition: transform 0.3s ease;
        }
        .glass-card:hover {
          transform: translateY(-2px);
        }
        .chart-grid { 
          background-image: radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px); 
          background-size: 24px 24px; 
        }
        .circular-progress { 
          --percentage: 68; 
          width: 120px; 
          height: 120px; 
          border-radius: 50%; 
          background: radial-gradient(closest-side, white 79%, transparent 80% 100%), 
                      conic-gradient(#064e3b calc(var(--percentage) * 1%), #e9edff 0); 
        }
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
    </>
  );
};

export default InsightsPage;