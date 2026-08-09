import React, { useState } from 'react';

interface Goal {
  id: number;
  title: string;
  currentAmount: number;
  targetAmount: number;
  progress: number;
  targetDate: string;
  status: 'Ahead of Schedule' | 'On Track' | 'Needs Focus';
  image: string;
  statusColor: string;
}

interface Investment {
  name: string;
  description: string;
  amount: number;
  target: string;
  icon: string;
}

interface CompletedGoal {
  id: number;
  title: string;
  completedDate: string;
  amount: number;
}

const GoalsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Short-term' | 'Long-term'>('All');

  const goals: Goal[] = [
    {
      id: 1,
      title: 'Emergency Fund',
      currentAmount: 18500,
      targetAmount: 25000,
      progress: 74,
      targetDate: 'October 2024',
      status: 'Ahead of Schedule',
      statusColor: 'bg-primary/90',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9LgBCqY1PP6966CzQzPt3FOU9oXRdAq7H30JmH8K47Pn6AfTTyFabwcQKLR2RNhiM99yUOENdlnaJ4kR6rYA-8y7XonKWWR0J3SHoq6ClCkEUg8Dal3ikQeaiOYfaZHjq6vYLmYLxHe0p_ag7K6JFRSN6dXvXfVUeq1j99NOmfqlEopbKZZDo8lpkudLWdiJQMFbKj-fXb3fxD2U0ozgfDnpMEGrU953c6HAPMduRzqizAB_y6jwj-njsHh9eKbDqtzP1tm2UMlxz'
    },
    {
      id: 2,
      title: 'Japan Expedition',
      currentAmount: 6200,
      targetAmount: 12000,
      progress: 52,
      targetDate: 'April 2025',
      status: 'On Track',
      statusColor: 'bg-secondary/90',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6XaStfqh4nivd680_1y2a5dqTDjEUe-JhJjwY5mpIPc5viNriEJ41-6hAe03DV5cWQnFr__71CzHb09sMhou3TK905J4pPGVbHmS8Y6AtkVuxKOonAf6EtKTX-K-u3tG9UYq4znhidqiwbDJCBuH2vQH_XVmHXVA_9unvm7piHzlCWUWz74Fk6fRwYLKQIcl9HP94UCXNhONC2Wdj7L7PVzqcg6ckVFzXWSbxtXAqYcYbe2laPxClCZLEheme61NWWyOq_-rUWfC7'
    },
    {
      id: 3,
      title: 'Luxury Sedan',
      currentAmount: 12000,
      targetAmount: 55000,
      progress: 22,
      targetDate: 'Jan 2026',
      status: 'Needs Focus',
      statusColor: 'bg-tertiary-container',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByHZL_v5keHEqiDTey5ut1cgsD4IBVtS8cdo3T70VteU1CtpZ2y7r6O-MRnynslA6FBwUCujJcUSnw81Z5Bec7mbBrA2uj1PPhPYbct4sTykOD8QAEXF7PBfWco6Ok0RWevbl0Xf6Mi4B4kAXAKDhobzrVmllHt3KKj9Jj0Ov-e8W1jH49RXRVaVuBDvR1lsizp7cw4ku5q_XRKrLbyEzsxaroU94ZLK55IwZp5finT2UrhkmQrlIKEmCzq4XAAzedspZlIw0iybTv'
    }
  ];

  const investments: Investment[] = [
    {
      name: 'Retirement Fund',
      description: 'S&P 500 Index Focus',
      amount: 342100,
      target: '$2.5M',
      icon: 'landscape'
    },
    {
      name: 'Venture Portfolio',
      description: 'Tech Equity',
      amount: 84000,
      target: 'High Growth',
      icon: 'query_stats'
    }
  ];

  const completedGoals: CompletedGoal[] = [
    {
      id: 1,
      title: 'Debt Free',
      completedDate: 'June 2024',
      amount: 45000
    },
    {
      id: 2,
      title: 'Down Payment',
      completedDate: 'Jan 2024',
      amount: 120000
    }
  ];

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-primary';
    if (progress >= 50) return 'bg-secondary';
    return 'bg-tertiary-container';
  };

  return (
    <>
      <div className="pt-20 pb-10 px-margin-desktop space-y-lg">

        <div className="pt-20 pb-10 px-margin-desktop space-y-lg">
          {/* Greeting and Intro */}
          <section className="flex justify-between items-end pt-lg">
            <div>
              <h1 className="font-display-lg text-display-lg text-primary">Your Prosperity Path</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">Every dollar saved is a step toward your security. You're currently tracking 6 active goals.</p>
            </div>
            <button className="bg-primary text-on-primary px-6 py-3 rounded-xl font-label-bold flex items-center gap-2 shadow-lg hover:scale-98 active:scale-95 transition-all">
              <span className="material-symbols-outlined text-[20px]">add</span>
              Create Goal
            </button>
          </section>

          {/* Overview Stats Grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <div className="glass-card p-md rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-label-bold text-on-surface-variant uppercase tracking-wider">Total Saved</span>
                <div className="w-10 h-10 rounded-lg bg-secondary-container/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary">account_balance</span>
                </div>
              </div>
              <div>
                <div className="font-numbers-lg text-numbers-lg text-primary">$42,850.00</div>
                <p className="text-label-sm text-secondary flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  +12% from last month
                </p>
              </div>
            </div>

            <div className="glass-card p-md rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-label-bold text-on-surface-variant uppercase tracking-wider">Month's Contributions</span>
                <div className="w-10 h-10 rounded-lg bg-primary-fixed/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary-container">savings</span>
                </div>
              </div>
              <div>
                <div className="font-numbers-lg text-numbers-lg text-primary">$3,400.00</div>
                <p className="text-label-sm text-on-surface-variant mt-1">Automated: $2,500</p>
              </div>
            </div>

            <div className="glass-card p-md rounded-2xl border-l-4 border-secondary/50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-label-bold text-on-surface-variant uppercase tracking-wider">Next Milestone</span>
                <div className="w-10 h-10 rounded-lg bg-tertiary-fixed/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-tertiary-container">flag</span>
                </div>
              </div>
              <div>
                <div className="font-headline-md text-headline-md text-primary">Emergency Fund</div>
                <p className="text-body-md text-on-surface-variant mt-1 italic">Expected Completion: Oct 2024</p>
              </div>
            </div>
          </section>

          {/* Active Goals Bento Grid */}
          <section>
            <div className="flex items-center justify-between mb-md">
              <h2 className="font-headline-md text-headline-md text-primary">Priority Goals</h2>
              <div className="flex gap-2">
                {['All', 'Short-term', 'Long-term'].map((filter) => (
                  <button
                    key={filter}
                    className={`px-4 py-1.5 rounded-full text-label-bold ${
                      activeFilter === filter
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                    } transition-colors`}
                    onClick={() => setActiveFilter(filter as any)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {goals.map((goal) => (
                <div key={goal.id} className="glass-card rounded-[32px] overflow-hidden group hover:shadow-xl transition-all duration-500 flex flex-col">
                  <div className="h-48 relative overflow-hidden">
                    <img 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      alt={`${goal.title} goal visualization`}
                      src={goal.image}
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`${goal.statusColor} text-white px-3 py-1 rounded-full text-label-sm font-label-bold backdrop-blur-md`}>
                        {goal.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-md flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-headline-md text-headline-md text-primary">{goal.title}</h3>
                      <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">more_horiz</span>
                    </div>
                    <div className="mt-auto pt-md">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-numbers-md text-numbers-md text-primary">
                          {formatCurrency(goal.currentAmount)} <span className="text-on-surface-variant text-body-md font-normal">/ {formatCurrency(goal.targetAmount)}</span>
                        </span>
                        <span className="text-label-bold text-secondary">{goal.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                        <div className={`h-full ${getProgressColor(goal.progress)} rounded-full`} style={{ width: `${goal.progress}%` }}></div>
                      </div>
                      <p className="text-label-sm text-on-surface-variant mt-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                        Target: {goal.targetDate}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Investments Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
            <div className="glass-card p-lg rounded-[32px] bg-white text-on-surface border border-black/5 overflow-hidden relative">
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary-container/5 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-[32px]">auto_graph</span>
                  <h2 className="font-headline-md text-headline-md">Investment Engine</h2>
                </div>
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-sm">Your market-linked goals are growing at an average of 8.4% APY this quarter.</p>
                <div className="space-y-6">
                  {investments.map((investment, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <span className="material-symbols-outlined">{investment.icon}</span>
                        </div>
                        <div>
                          <p className="font-label-bold">{investment.name}</p>
                          <p className="text-label-sm opacity-70">{investment.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-numbers-md text-numbers-md">{formatCurrency(investment.amount)}</p>
                        <p className="text-label-sm text-primary-fixed-dim">Target: {investment.target}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-10 w-full py-4 bg-primary text-white rounded-xl font-label-bold hover:bg-primary-fixed transition-colors">
                  Portfolio Analysis
                </button>
              </div>
            </div>

            {/* Smart Suggestions */}
            <div className="space-y-gutter">
              <h2 className="font-headline-md text-headline-md text-primary">Smart Accelerators</h2>
              <div className="space-y-4">
                <div className="glass-card p-md rounded-2xl flex gap-4 hover:border-secondary/30 transition-all cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex-shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary">bolt</span>
                  </div>
                  <div>
                    <h4 className="font-label-bold text-primary">Shave 2 Months off Luxury Sedan</h4>
                    <p className="text-body-md text-on-surface-variant mt-1">Increasing your monthly contribution by just $125 will reach your target 8 weeks earlier.</p>
                    <button className="mt-3 text-secondary font-label-bold text-label-sm flex items-center gap-1 hover:gap-2 transition-all">
                      Apply Change <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>

                <div className="glass-card p-md rounded-2xl flex gap-4 hover:border-secondary/30 transition-all cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-primary-fixed/30 flex-shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">redeem</span>
                  </div>
                  <div>
                    <h4 className="font-label-bold text-primary">Tax Refund Opportunity</h4>
                    <p className="text-body-md text-on-surface-variant mt-1">Your $2,400 refund has been detected. Allocate it to 'Emergency Fund' to hit 90% today?</p>
                    <button className="mt-3 text-primary font-label-bold text-label-sm flex items-center gap-1 hover:gap-2 transition-all">
                      Allocate Funds <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>

                <div className="glass-card p-md rounded-2xl flex gap-4 opacity-75 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-on-surface-variant/10 flex-shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface-variant">auto_fix_high</span>
                  </div>
                  <div>
                    <h4 className="font-label-bold text-primary">Round-up Enrollment</h4>
                    <p className="text-body-md text-on-surface-variant mt-1">Enabling merchant round-ups could add approximately $85/mo to your Japan trip.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Recently Completed */}
          <section className="pb-10">
            <h2 className="font-headline-md text-headline-md text-primary mb-md">Completed Legacies</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {completedGoals.map((goal) => (
                <div key={goal.id} className="glass-card p-md rounded-2xl min-w-[280px] flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                  <div>
                    <p className="font-label-bold text-primary">{goal.title}</p>
                    <p className="text-label-sm text-on-surface-variant">Cleared {goal.completedDate}</p>
                    <p className="font-numbers-md text-primary mt-1">{formatCurrency(goal.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

      </div>
    </>
  );
};

export default GoalsPage;