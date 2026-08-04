import React, { useState } from 'react';

interface Transaction {
  id: number;
  title: string;
  time: string;
  category: string;
  amount: number;
  type: 'expense' | 'income';
  account: string;
  icon: string;
  bgColor: string;
  iconColor: string;
}

const TransactionsPage: React.FC = () => {
  const [searchTerm, _setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'expenses' | 'income'>('all');

  const transactions: Transaction[] = [
    // Today
    {
      id: 1,
      title: 'Blue Bottle Coffee',
      time: '10:42 AM',
      category: 'Dining',
      amount: -7.50,
      type: 'expense',
      account: 'Ending in 4291',
      icon: 'restaurant',
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-700'
    },
    {
      id: 2,
      title: 'Stripe Payout',
      time: '08:15 AM',
      category: 'Income',
      amount: 2450.00,
      type: 'income',
      account: 'Business Account',
      icon: 'account_balance',
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-700'
    },
    // Yesterday
    {
      id: 3,
      title: 'Apple Store',
      time: '04:30 PM',
      category: 'Electronics',
      amount: -1299.00,
      type: 'expense',
      account: 'Visa Platinum',
      icon: 'shopping_bag',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-700'
    },
    {
      id: 4,
      title: 'Uber Trip',
      time: '09:12 AM',
      category: 'Transport',
      amount: -18.24,
      type: 'expense',
      account: 'Ending in 4291',
      icon: 'directions_car',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-700'
    },
    // October 24
    {
      id: 5,
      title: 'Equinox Gym',
      time: '07:00 AM',
      category: 'Health',
      amount: -250.00,
      type: 'expense',
      account: 'Visa Platinum',
      icon: 'fitness_center',
      bgColor: 'bg-rose-100',
      iconColor: 'text-rose-700'
    },
    {
      id: 6,
      title: 'Target Store',
      time: '06:45 PM',
      category: 'Household',
      amount: -84.20,
      type: 'expense',
      account: 'Ending in 4291',
      icon: 'home',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-700'
    }
  ];

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || 
                         (activeFilter === 'expenses' && t.type === 'expense') ||
                         (activeFilter === 'income' && t.type === 'income');
    return matchesSearch && matchesFilter;
  });

  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let groupKey = '';
    if (transaction.id <= 2) {
      groupKey = 'Today';
    } else if (transaction.id <= 4) {
      groupKey = 'Yesterday';
    } else {
      groupKey = 'October 24';
    }
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  const formatCurrency = (amount: number) => {
    const isNegative = amount < 0;
    const formatted = Math.abs(amount).toFixed(2);
    return `${isNegative ? '-' : '+'}$${formatted}`;
  };

  const getAmountColor = (amount: number) => {
    return amount < 0 ? 'text-error' : 'text-secondary';
  };

  return (
    <>
      <div className="max-w-5xl mx-auto">
        {/* Filters & Header */}
          <section className="mb-gutter flex flex-col md:flex-row md:items-end justify-between gap-gutter">
            <div>
              <h2 className="font-headline-md text-headline-md text-primary mb-1">Transactions</h2>
              <p className="font-body-md text-on-surface-variant">Review and manage your latest financial movements.</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex bg-surface-container-low p-1 rounded-xl border border-black/5">
                <button 
                  className={`px-4 py-1.5 rounded-lg text-label-bold ${activeFilter === 'all' ? 'bg-surface shadow-sm text-primary' : 'text-on-surface-variant hover:text-primary'} transition-colors`}
                  onClick={() => setActiveFilter('all')}
                >
                  All
                </button>
                <button 
                  className={`px-4 py-1.5 rounded-lg text-label-bold ${activeFilter === 'expenses' ? 'bg-surface shadow-sm text-primary' : 'text-on-surface-variant hover:text-primary'} transition-colors`}
                  onClick={() => setActiveFilter('expenses')}
                >
                  Expenses
                </button>
                <button 
                  className={`px-4 py-1.5 rounded-lg text-label-bold ${activeFilter === 'income' ? 'bg-surface shadow-sm text-primary' : 'text-on-surface-variant hover:text-primary'} transition-colors`}
                  onClick={() => setActiveFilter('income')}
                >
                  Income
                </button>
              </div>
              <button className="flex items-center gap-2 bg-surface-container-lowest border border-black/5 px-4 py-2.5 rounded-xl text-label-bold text-on-surface-variant hover:bg-surface-container-low transition-all">
                <span className="material-symbols-outlined text-[18px]">tune</span>
                Filters
              </button>
              <button className="flex items-center gap-2 bg-surface-container-lowest border border-black/5 px-4 py-2.5 rounded-xl text-label-bold text-on-surface-variant hover:bg-surface-container-low transition-all">
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                Oct 2024
              </button>
            </div>
          </section>

          {/* Transaction Groups */}
          <div className="space-y-lg">
            {Object.entries(groupedTransactions).map(([groupName, transactions]) => (
              <div key={groupName} className="space-y-4">
                <h3 className="font-label-bold text-label-bold text-on-surface-variant/60 uppercase tracking-widest px-2">
                  {groupName}
                </h3>
                <div className="space-y-2">
                  {transactions.map((transaction) => (
                    <div 
                      key={transaction.id}
                      className="glass-card flex items-center justify-between p-4 rounded-xl hover:shadow-md transition-shadow group cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${transaction.bgColor} flex items-center justify-center`}>
                          <span className={`material-symbols-outlined ${transaction.iconColor}`}>
                            {transaction.icon}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-label-bold text-on-surface group-hover:text-primary transition-colors">
                            {transaction.title}
                          </h4>
                          <p className="font-label-sm text-on-surface-variant/70">
                            {transaction.time} • {transaction.category}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`font-numbers-md ${getAmountColor(transaction.amount)}`}>
                          {formatCurrency(transaction.amount)}
                        </span>
                        <p className="font-label-sm text-on-surface-variant/50">{transaction.account}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <footer className="w-full mt-xl py-4 flex justify-between items-center border-t border-black/5 opacity-80">
            <span className="font-label-sm text-label-sm text-secondary">© 2024 Mamani Financial. All rights reserved.</span>
            <div className="flex gap-gutter">
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Security</a>
            </div>
          </footer>
      </div>
    </>
  );
};

export default TransactionsPage;