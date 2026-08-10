import React, { useState } from 'react';
import { useCurrency } from '../hooks/useCurrency';
import { useApi } from '../hooks/useApi';
import { getTransactions, deleteTransaction } from '../api/transactions';
import AddTransaction from '../components/AddTransaction';

interface Transaction {
  id: number;
  title: string;
  date: string;
  category: string;
  amount: number;
  is_expense: boolean;
  account: string;
  notes?: string;
}

const TransactionsPage: React.FC = () => {
  const { formatAmount } = useCurrency();
  const [activeFilter, setActiveFilter] = useState<'all' | 'expenses' | 'income'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data: transactions, loading, error, refetch } = useApi<Transaction[]>(getTransactions);

  const filtered = (transactions ?? []).filter(t => {
    if (activeFilter === 'expenses') return t.is_expense;
    if (activeFilter === 'income') return !t.is_expense;
    return true;
  });

  // Group by date
  const grouped = filtered.reduce((groups, tx) => {
    const date = new Date(tx.date);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    let key: string;
    if (diffDays === 0) key = 'Today';
    else if (diffDays === 1) key = 'Yesterday';
    else key = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    if (!groups[key]) groups[key] = [];
    groups[key].push(tx);
    return groups;
  }, {} as Record<string, Transaction[]>);

  const getAmountColor = (isExpense: boolean) =>
    isExpense ? 'text-error' : 'text-secondary';

  const CATEGORY_ICONS: Record<string, { icon: string; bg: string; color: string }> = {
    Housing:       { icon: 'home',             bg: 'bg-orange-100', color: 'text-orange-700'  },
    Food:          { icon: 'restaurant',        bg: 'bg-amber-100',  color: 'text-amber-700'   },
    Transport:     { icon: 'directions_car',    bg: 'bg-blue-100',   color: 'text-blue-700'    },
    Utilities:     { icon: 'bolt',              bg: 'bg-yellow-100', color: 'text-yellow-700'  },
    Health:        { icon: 'medical_services',  bg: 'bg-rose-100',   color: 'text-rose-700'    },
    Shopping:      { icon: 'shopping_bag',      bg: 'bg-purple-100', color: 'text-purple-700'  },
    Entertainment: { icon: 'movie',             bg: 'bg-pink-100',   color: 'text-pink-700'    },
    Income:        { icon: 'account_balance',   bg: 'bg-emerald-100',color: 'text-emerald-700' },
    Dining:        { icon: 'restaurant',        bg: 'bg-amber-100',  color: 'text-amber-700'   },
    Electronics:   { icon: 'devices',           bg: 'bg-indigo-100', color: 'text-indigo-700'  },
    Others:        { icon: 'category',          bg: 'bg-gray-100',   color: 'text-gray-700'    },
  };

  const getMeta = (tx: Transaction) =>
    CATEGORY_ICONS[tx.is_expense ? tx.category : 'Income'] || CATEGORY_ICONS['Others'];

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this transaction?')) return;
    setDeletingId(id);
    try {
      await deleteTransaction(id);
      refetch();
    } catch {
      alert('Could not delete transaction.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <section className="mb-gutter flex flex-col md:flex-row md:items-end justify-between gap-gutter">
          <div>
            <h2 className="font-headline-md text-headline-md text-primary mb-1">Transactions</h2>
            <p className="font-body-md text-on-surface-variant">Review and manage your latest financial movements.</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex bg-surface-container-low p-1 rounded-xl border border-black/5">
              {(['all', 'expenses', 'income'] as const).map(f => (
                <button
                  key={f}
                  className={`px-4 py-1.5 rounded-lg text-label-bold capitalize ${activeFilter === f ? 'bg-surface shadow-sm text-primary' : 'text-on-surface-variant hover:text-primary'} transition-colors`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
            <button
              id="add-transaction-btn"
              className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-label-bold hover:opacity-90 active:scale-95 transition-all"
              onClick={() => setIsModalOpen(true)}
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add
            </button>
          </div>
        </section>

        {/* Content */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="glass-card rounded-xl p-4 flex items-center gap-4 animate-pulse">
                <div className="w-12 h-12 rounded-xl bg-gray-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
                <div className="h-5 bg-gray-100 rounded w-20" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-4xl text-error mb-2 block">error</span>
            <p className="text-on-surface-variant">{error}</p>
            <button onClick={refetch} className="mt-4 text-primary font-label-bold hover:underline">Retry</button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-5xl text-gray-300 mb-4 block">receipt_long</span>
            <p className="text-on-surface-variant font-body-md">No transactions yet.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 px-6 py-2.5 bg-primary text-white rounded-xl font-label-bold hover:opacity-90 transition-all"
            >
              Add your first transaction
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-lg">
            {Object.entries(grouped).map(([groupName, txList]) => (
              <div key={groupName} className="space-y-4">
                <h3 className="font-label-bold text-label-bold text-on-surface-variant/60 uppercase tracking-widest px-2">
                  {groupName}
                </h3>
                <div className="space-y-2">
                  {txList.map((tx) => {
                    const meta = getMeta(tx);
                    return (
                      <div
                        key={tx.id}
                        className="glass-card flex items-center justify-between p-4 rounded-xl hover:shadow-md transition-shadow group cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl ${meta.bg} flex items-center justify-center`}>
                            <span className={`material-symbols-outlined ${meta.color}`}>{meta.icon}</span>
                          </div>
                          <div>
                            <h4 className="font-label-bold text-on-surface group-hover:text-primary transition-colors">
                              {tx.title}
                            </h4>
                            <p className="font-label-sm text-on-surface-variant/70">
                              {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {tx.category} • {tx.account}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className={`font-numbers-md ${getAmountColor(tx.is_expense)}`}>
                              {tx.is_expense ? '-' : '+'}{formatAmount(tx.amount)}
                            </span>
                          </div>
                          <button
                            className="opacity-0 group-hover:opacity-100 w-8 h-8 flex items-center justify-center rounded-full hover:bg-error/10 text-error transition-all"
                            disabled={deletingId === tx.id}
                            onClick={() => handleDelete(tx.id)}
                            title="Delete transaction"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {deletingId === tx.id ? 'hourglass_empty' : 'delete'}
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="w-full mt-xl py-4 flex justify-between items-center border-t border-black/5 opacity-80">
          <span className="font-label-sm text-label-sm text-secondary">© 2024 Mamani Financial. All rights reserved.</span>
          <div className="flex gap-gutter">
            {['Privacy Policy', 'Terms of Service', 'Security'].map(l => (
              <a key={l} className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">{l}</a>
            ))}
          </div>
        </footer>
      </div>

      <AddTransaction
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onSaved={refetch}
      />
    </>
  );
};

export default TransactionsPage;