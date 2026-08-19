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
  const [activeType, setActiveType] = useState<'normal' | 'fixed'>('normal');
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

  // Normal Form State
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Housing');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [account, setAccount] = useState('Main Savings');
  const [description, setDescription] = useState('');

  // Fixed Form State
  const [fixedIsExpense, setFixedIsExpense] = useState(true);
  const [fixedItemName, setFixedItemName] = useState('');
  const [fixedAmount, setFixedAmount] = useState('');
  const [fixedFrequency, setFixedFrequency] = useState('Monthly');
  const [fixedDueDate, setFixedDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [fixedCategory, setFixedCategory] = useState('Housing');
  const [fixedAccount, setFixedAccount] = useState('Main Savings');
  const [fixedNote, setFixedNote] = useState('');

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
  const frequencies = ['Monthly', 'Weekly', 'Daily', 'Yearly'];

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
      setIsTypeDropdownOpen(false);
      // Reset normal form
      setAmount('');
      setDescription('');
      setSaveError('');
      setSelectedCategory('Housing');
      setDate(new Date().toISOString().split('T')[0]);
      // Reset fixed form
      setFixedItemName('');
      setFixedAmount('');
      setFixedNote('');
    }, 250);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleCloseModal();
  };

  const handleSave = async () => {
    setSaveError('');

    if (activeType === 'normal') {
      if (!amount || parseFloat(amount) <= 0) {
        setSaveError('Please enter a valid amount.');
        return;
      }
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
          is_fixed: false,
        });
        onSaved?.();
        handleCloseModal();
      } catch (err: any) {
        setSaveError(err?.response?.data?.detail || 'Failed to save. Please try again.');
      } finally {
        setIsSaving(false);
      }
    } else {
      if (!fixedItemName.trim()) {
        setSaveError('Please enter an item name (e.g. Rent, Salary).');
        return;
      }
      if (!fixedAmount || parseFloat(fixedAmount) <= 0) {
        setSaveError('Please enter a valid amount.');
        return;
      }
      setIsSaving(true);
      try {
        await createTransaction({
          title: fixedItemName.trim(),
          category: fixedCategory,
          amount: parseFloat(fixedAmount),
          is_expense: fixedIsExpense,
          notes: fixedNote.trim() || `Recurring ${fixedFrequency}`,
          account: fixedAccount,
          date: new Date(fixedDueDate).toISOString(),
          is_fixed: true,
          frequency: fixedFrequency,
        });
        onSaved?.();
        handleCloseModal();
      } catch (err: any) {
        setSaveError(err?.response?.data?.detail || 'Failed to add fixed item. Please try again.');
      } finally {
        setIsSaving(false);
      }
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
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 relative">
          <div className="relative flex items-center gap-3">
            {/* Type Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container border border-black/5 text-on-surface transition-all focus:ring-2 focus:ring-secondary/20 shadow-sm group"
                onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
              >
                <div className={`w-7 h-7 flex items-center justify-center rounded-lg ${activeType === 'normal' ? 'bg-secondary-container' : 'bg-amber-100'}`}>
                  <span className={`material-symbols-outlined text-[18px] ${activeType === 'normal' ? 'text-on-secondary-container' : 'text-amber-800'}`}>
                    {activeType === 'normal' ? 'receipt_long' : 'push_pin'}
                  </span>
                </div>
                <div className="text-left">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-on-surface-variant/70 -mb-0.5">Type of Transaction</span>
                  <span className="font-bold text-sm text-primary">
                    {activeType === 'normal' ? 'Normal Transaction' : 'Fixed Transaction'}
                  </span>
                </div>
                <span className={`material-symbols-outlined text-on-surface-variant text-[20px] transition-transform duration-200 ml-1 ${isTypeDropdownOpen ? 'rotate-180 text-primary' : ''}`}>
                  expand_more
                </span>
              </button>

              {/* Dropdown Menu */}
              {isTypeDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-black/10 p-2 z-50 animate-fadeIn">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                    Select Transaction Type
                  </div>
                  <button
                    type="button"
                    className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group ${activeType === 'normal' ? 'bg-surface-container-low/80' : 'hover:bg-surface-container-low'}`}
                    onClick={() => {
                      setActiveType('normal');
                      setIsTypeDropdownOpen(false);
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">Normal Transaction</p>
                      <p className="text-[11px] text-on-surface-variant">One-off expense or income</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group mt-1 ${activeType === 'fixed' ? 'bg-surface-container-low/80' : 'hover:bg-surface-container-low'}`}
                    onClick={() => {
                      setActiveType('fixed');
                      setIsTypeDropdownOpen(false);
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[18px]">push_pin</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">Fixed Transaction</p>
                      <p className="text-[11px] text-on-surface-variant">Recurring rent, bills, salary</p>
                    </div>
                  </button>
                </div>
              )}
            </div>
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ scrollbarWidth: 'thin' }}>
          {activeType === 'normal' ? (
            /* ── Normal Transaction Form ── */
            <>
              {/* Amount + Toggle */}
              <div className="flex flex-col items-center justify-center py-2 space-y-4">
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
              <div className="space-y-3">
                <label className="font-label-bold text-label-bold text-on-surface-variant block">Category</label>
                <div className="grid grid-cols-4 gap-2.5">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all duration-200 ${
                        selectedCategory === cat.id
                          ? 'bg-secondary text-white border-secondary shadow-lg shadow-secondary/20'
                          : 'bg-white/50 border-black/5 hover:border-secondary/30'
                      }`}
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      <span className={`material-symbols-outlined text-[22px] ${selectedCategory === cat.id ? 'text-white' : 'text-secondary'}`}>
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
                <div className="space-y-1.5">
                  <label className="font-label-bold text-label-bold text-on-surface-variant block">Date</label>
                  <div className="relative">
                    <input
                      id="transaction-date"
                      className="w-full bg-surface-container-low border-none rounded-lg px-4 py-2.5 font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-secondary/20 transition-all"
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
                <div className="space-y-1.5">
                  <label className="font-label-bold text-label-bold text-on-surface-variant block">Account</label>
                  <div className="relative">
                    <select
                      className="w-full bg-surface-container-low border-none rounded-lg px-4 py-2.5 font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-secondary/20 appearance-none transition-all"
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
              <div className="space-y-1.5">
                <label className="font-label-bold text-label-bold text-on-surface-variant block">Note / Description</label>
                <textarea
                  className="w-full bg-surface-container-low border-none rounded-lg px-4 py-2.5 font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-secondary/20 transition-all resize-none"
                  placeholder="What was this for?"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </>
          ) : (
            /* ── Fixed Transaction Form ── */
            <>
              {/* Type Toggle */}
              <div className="flex bg-surface-container-low rounded-lg p-1">
                <button
                  type="button"
                  className={`flex-1 py-2 rounded-[6px] font-label-bold text-label-bold transition-colors text-center ${fixedIsExpense ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                  onClick={() => setFixedIsExpense(true)}
                >
                  Fixed Expense
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 rounded-[6px] font-label-bold text-label-bold transition-colors text-center ${!fixedIsExpense ? 'bg-secondary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                  onClick={() => setFixedIsExpense(false)}
                >
                  Fixed Income
                </button>
              </div>

              {/* Item Name */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-bold text-label-bold text-on-surface">Item Name</label>
                <input
                  className="w-full bg-[#F3F4F6] text-on-surface font-body-md text-body-md rounded-lg px-4 py-2.5 border-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all outline-none shadow-inner placeholder-on-surface-variant/50"
                  placeholder="e.g., Rent, Primary Salary, Internet"
                  type="text"
                  value={fixedItemName}
                  onChange={(e) => setFixedItemName(e.target.value)}
                  autoFocus
                />
              </div>

              {/* Amount */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-bold text-label-bold text-on-surface">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-body-md text-on-surface-variant">
                    {symbol}
                  </span>
                  <input
                    className="w-full bg-[#F3F4F6] text-on-surface font-numbers-md text-numbers-md rounded-lg pl-10 pr-4 py-2.5 border-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all outline-none shadow-inner"
                    placeholder="0.00"
                    type="text"
                    inputMode="decimal"
                    value={fixedAmount}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === '' || /^\d*\.?\d*$/.test(v)) setFixedAmount(v);
                    }}
                  />
                </div>
              </div>

              {/* Frequency and Due Date Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-bold text-label-bold text-on-surface">Frequency</label>
                  <div className="relative">
                    <select
                      className="w-full bg-[#F3F4F6] text-on-surface font-body-md text-body-md rounded-lg px-4 py-2.5 border-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all outline-none appearance-none shadow-inner cursor-pointer"
                      value={fixedFrequency}
                      onChange={(e) => setFixedFrequency(e.target.value)}
                    >
                      {frequencies.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-bold text-label-bold text-on-surface">Next Due Date</label>
                  <div className="relative">
                    <input
                      id="fixed-due-date"
                      className="w-full bg-[#F3F4F6] text-on-surface font-body-md text-body-md rounded-lg px-4 py-2.5 border-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all outline-none shadow-inner cursor-pointer"
                      type="date"
                      value={fixedDueDate}
                      onChange={(e) => setFixedDueDate(e.target.value)}
                    />
                    <span
                      className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] cursor-pointer"
                      onClick={() => (document.getElementById('fixed-due-date') as any)?.showPicker()}
                    >
                      calendar_today
                    </span>
                  </div>
                </div>
              </div>

              {/* Category and Account Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-bold text-label-bold text-on-surface">Category</label>
                  <div className="relative">
                    <select
                      className="w-full bg-[#F3F4F6] text-on-surface font-body-md text-body-md rounded-lg px-4 py-2.5 border-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all outline-none appearance-none shadow-inner cursor-pointer"
                      value={fixedCategory}
                      onChange={(e) => setFixedCategory(e.target.value)}
                    >
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-bold text-label-bold text-on-surface">Account</label>
                  <div className="relative">
                    <select
                      className="w-full bg-[#F3F4F6] text-on-surface font-body-md text-body-md rounded-lg px-4 py-2.5 border-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all outline-none appearance-none shadow-inner cursor-pointer"
                      value={fixedAccount}
                      onChange={(e) => setFixedAccount(e.target.value)}
                    >
                      {accounts.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>

              {/* Note / Description */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-bold text-label-bold text-on-surface">Note / Description (Optional)</label>
                <textarea
                  className="w-full bg-[#F3F4F6] text-on-surface font-body-md text-body-md rounded-lg px-4 py-2.5 border-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all outline-none shadow-inner resize-none placeholder-on-surface-variant/50"
                  placeholder="e.g., Due on the 1st of every month"
                  rows={2}
                  value={fixedNote}
                  onChange={(e) => setFixedNote(e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-black/5 bg-surface-bright/50 space-y-3">
          {saveError && (
            <p className="text-error font-label-bold text-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">error</span>
              {saveError}
            </p>
          )}
          <div className="flex items-center justify-between gap-4">
            <button
              className="px-6 py-2.5 rounded-lg font-label-bold text-label-bold text-on-surface-variant hover:bg-black/5 transition-all"
              onClick={handleCloseModal}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              id="save-transaction-btn"
              className="px-8 py-2.5 bg-primary text-white rounded-lg font-label-bold text-label-bold hover:opacity-90 active:scale-95 transition-all shadow-sm disabled:opacity-60"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : activeType === 'normal' ? 'Save Transaction' : 'Add Fixed Item'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;