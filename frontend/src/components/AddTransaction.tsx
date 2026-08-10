import React, { useState, useRef, useEffect } from 'react';
import { useCurrency } from '../hooks/useCurrency';
import { createTransaction } from '../api/transactions';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: (v: boolean) => void;
  onSaved?: () => void;
}

const AddTransaction: React.FC<Props> = ({ isModalOpen, setIsModalOpen, onSaved }) => {
  const { symbol } = useCurrency();
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Housing');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [account, setAccount] = useState('Main Savings');
  const [description, setDescription] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  const categories: Category[] = [
    { id: 'Housing',       name: 'Housing',   icon: 'home'              },
    { id: 'Food',          name: 'Food',       icon: 'restaurant'        },
    { id: 'Transport',     name: 'Transport',  icon: 'directions_car'    },
    { id: 'Utilities',     name: 'Utilities',  icon: 'bolt'              },
    { id: 'Entertainment', name: 'Movies',     icon: 'movie'             },
    { id: 'Health',        name: 'Health',     icon: 'medical_services'  },
    { id: 'Shopping',      name: 'Shopping',   icon: 'shopping_bag'      },
    { id: 'Others',        name: 'Others',     icon: 'more_horiz'        },
  ];

  const accounts = ['Main Savings', 'Credit Card', 'Investment Wallet'];

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
      // Reset form
      setAmount('');
      setDescription('');
      setSaveError('');
      setSelectedCategory('Housing');
      setDate(new Date().toISOString().split('T')[0]);
    }, 300);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleCloseModal();
  };

  const handleSave = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setSaveError('Please enter a valid amount.');
      return;
    }
    setSaveError('');
    setIsSaving(true);
    try {
      await createTransaction({
        title: description.trim() || selectedCategory,
        category: selectedCategory,
        amount: parseFloat(amount),
        is_expense: transactionType === 'expense',
        notes: description.trim() || undefined,
        account,
        date: new Date(date).toISOString(),
      });
      onSaved?.();
      handleCloseModal();
    } catch (err: any) {
      setSaveError(err?.response?.data?.detail || 'Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) handleCloseModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-on-background/20 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      ref={modalRef}
      onClick={handleOverlayClick}
    >
      <div
        className={`relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all duration-300 transform ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center bg-secondary-container rounded-lg">
              <span className="material-symbols-outlined text-on-secondary-container text-[20px]">add_card</span>
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface">Add New Transaction</h2>
          </div>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors text-on-surface-variant"
            onClick={handleCloseModal}
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8" style={{ scrollbarWidth: 'thin' }}>

          {/* Amount + Toggle */}
          <div className="flex flex-col items-center justify-center py-4 space-y-4">
            <div className="flex p-1 bg-surface-container-low rounded-lg w-fit">
              <button
                className={`px-6 py-2 rounded-md font-label-bold text-label-bold transition-all duration-200 ${transactionType === 'expense' ? 'bg-secondary text-white' : 'text-on-surface-variant hover:text-on-surface'}`}
                onClick={() => setTransactionType('expense')}
              >
                Expense
              </button>
              <button
                className={`px-6 py-2 rounded-md font-label-bold text-label-bold transition-all duration-200 ${transactionType === 'income' ? 'bg-secondary text-white' : 'text-on-surface-variant hover:text-on-surface'}`}
                onClick={() => setTransactionType('income')}
              >
                Income
              </button>
            </div>

            <div className="text-center w-full">
              <div className="relative group">
                <span className="absolute left-1/2 -translate-x-[110%] top-1/2 -translate-y-1/2 font-numbers-lg text-numbers-lg text-secondary opacity-50">
                  {symbol}
                </span>
                <input
                  className="w-full bg-transparent border-none text-center font-numbers-lg text-numbers-lg text-on-background focus:ring-0 placeholder:text-surface-variant"
                  placeholder="0.00"
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === '' || /^\d*\.?\d*$/.test(v)) setAmount(v);
                  }}
                  autoFocus
                />
                <div className="h-0.5 w-32 bg-secondary/20 group-focus-within:bg-secondary mx-auto transition-colors mt-1 rounded-full" />
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-4">
            <label className="font-label-bold text-label-bold text-on-surface-variant block">Category</label>
            <div className="grid grid-cols-4 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 ${
                    selectedCategory === cat.id
                      ? 'bg-secondary text-white border-secondary shadow-lg shadow-secondary/20'
                      : 'bg-white/50 border-black/5 hover:border-secondary/30'
                  }`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <span className={`material-symbols-outlined text-[24px] ${selectedCategory === cat.id ? 'text-white' : 'text-secondary'}`}>
                    {cat.icon}
                  </span>
                  <span className={`text-[11px] font-medium uppercase tracking-wider ${selectedCategory === cat.id ? 'text-white' : 'text-on-surface-variant'}`}>
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Date + Account */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-label-bold text-label-bold text-on-surface-variant block">Date</label>
              <div className="relative">
                <input
                  id="transaction-date"
                  className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-secondary/20 transition-all"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <span
                  className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] cursor-pointer"
                  onClick={() => (document.getElementById('transaction-date') as any)?.showPicker()}
                >
                  calendar_today
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-label-bold text-label-bold text-on-surface-variant block">Account</label>
              <div className="relative">
                <select
                  className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-secondary/20 appearance-none transition-all"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                >
                  {accounts.map(a => <option key={a}>{a}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="font-label-bold text-label-bold text-on-surface-variant block">Note / Description</label>
            <textarea
              className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-secondary/20 transition-all resize-none"
              placeholder="What was this for?"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-black/5 bg-white/40 space-y-3">
          {saveError && (
            <p className="text-error font-label-bold text-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">error</span>
              {saveError}
            </p>
          )}
          <div className="flex items-center justify-between gap-4">
            <button
              className="px-6 py-3 rounded-lg font-label-bold text-label-bold text-on-surface-variant hover:bg-black/5 transition-all"
              onClick={handleCloseModal}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              id="save-transaction-btn"
              className="px-8 py-3 bg-secondary text-white rounded-lg font-label-bold text-label-bold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-secondary/20 disabled:opacity-60"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Transaction'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;