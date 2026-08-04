import React, { useState, useRef, useEffect } from 'react';

interface Category {
  id: string;
  name: string;
  icon: string;
}

const AddTransactionPage: React.FC = () => {
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('0.00');
  const [selectedCategory, setSelectedCategory] = useState<string>('Housing');
  const [date, setDate] = useState('Today, 24 May');
  const [account, setAccount] = useState('Main Savings');
  const [description, setDescription] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const categories: Category[] = [
    { id: 'Housing', name: 'Housing', icon: 'home' },
    { id: 'Food', name: 'Food', icon: 'restaurant' },
    { id: 'Transport', name: 'Transport', icon: 'directions_car' },
    { id: 'Utilities', name: 'Utilities', icon: 'bolt' },
    { id: 'Movies', name: 'Movies', icon: 'movie' },
    { id: 'Health', name: 'Health', icon: 'medical_services' },
    { id: 'Shopping', name: 'Shopping', icon: 'shopping_bag' },
    { id: 'Others', name: 'Others', icon: 'more_horiz' }
  ];

  const accounts = ['Main Savings', 'Credit Card', 'Investment Wallet'];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleTransactionTypeChange = (type: 'expense' | 'income') => {
    setTransactionType(type);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value || '0.00');
    }
  };

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
    }, 300);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  const handleSave = () => {
    // Handle save logic here
    console.log({
      type: transactionType,
      amount,
      category: selectedCategory,
      date,
      account,
      description
    });
    handleCloseModal();
  };

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isModalOpen]);

  if (!isModalOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-on-background/20 backdrop-blur-sm transition-opacity duration-300"
      onClick={handleOverlayClick}
    >
      {/* Add Transaction Modal */}
      <div 
        ref={modalRef}
        className={`relative w-full max-w-lg glass-effect rounded-xl ambient-shadow overflow-hidden flex flex-col max-h-[90vh] transition-all duration-300 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
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
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Content (Scrollable Area) */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-8">
          {/* Amount Input Section */}
          <div className="flex flex-col items-center justify-center py-4 space-y-4">
            {/* Income/Expense Toggle */}
            <div className="flex p-1 bg-surface-container-low rounded-lg w-fit">
              <button 
                className={`px-6 py-2 rounded-md font-label-bold text-label-bold transition-all duration-200 ${
                  transactionType === 'expense' 
                    ? 'bg-secondary text-white' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                onClick={() => handleTransactionTypeChange('expense')}
              >
                Expense
              </button>
              <button 
                className={`px-6 py-2 rounded-md font-label-bold text-label-bold transition-all duration-200 ${
                  transactionType === 'income' 
                    ? 'bg-secondary text-white' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                onClick={() => handleTransactionTypeChange('income')}
              >
                Income
              </button>
            </div>
            
            <div className="text-center w-full">
              <div className="relative group">
                <span className="absolute left-1/2 -translate-x-[110%] top-1/2 -translate-y-1/2 font-numbers-lg text-numbers-lg text-secondary opacity-50">
                  $
                </span>
                <input 
                  className="w-full bg-transparent border-none text-center font-numbers-lg text-numbers-lg text-on-background focus:ring-0 placeholder:text-surface-variant" 
                  placeholder="0.00" 
                  type="text" 
                  value={amount}
                  onChange={handleAmountChange}
                />
                <div className="h-0.5 w-32 bg-secondary/20 group-focus-within:bg-secondary mx-auto transition-colors mt-1 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Category Grid */}
          <div className="space-y-4">
            <label className="font-label-bold text-label-bold text-on-surface-variant block">Category</label>
            <div className="grid grid-cols-4 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`category-chip group flex flex-col items-center gap-2 p-3 rounded-xl border border-black/5 transition-all duration-200 ${
                    selectedCategory === category.id 
                      ? 'category-chip-active bg-secondary text-white shadow-lg shadow-secondary/20' 
                      : 'bg-white/50 hover:border-secondary/30'
                  }`}
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <span className={`material-symbols-outlined text-[24px] ${
                    selectedCategory === category.id ? 'text-white' : 'text-secondary'
                  }`}>
                    {category.icon}
                  </span>
                  <span className={`text-[11px] font-medium uppercase tracking-wider ${
                    selectedCategory === category.id ? 'text-white' : 'text-on-surface-variant'
                  }`}>
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Fields Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-label-bold text-label-bold text-on-surface-variant block">Date</label>
              <div className="relative">
                <input 
                  className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-secondary/20 transition-all" 
                  type="text" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
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
                  {accounts.map((acc) => (
                    <option key={acc} value={acc}>{acc}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label className="font-label-bold text-label-bold text-on-surface-variant block">Note / Description</label>
            <textarea 
              className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-secondary/20 transition-all resize-none" 
              placeholder="What was this for?" 
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Attachment */}
          <div className="space-y-2">
            <label className="font-label-bold text-label-bold text-on-surface-variant block">Attach Receipt</label>
            <button className="w-full border-2 border-dashed border-outline-variant rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-surface-container-low hover:border-secondary transition-all group">
              <span className="material-symbols-outlined text-[28px] text-on-surface-variant group-hover:text-secondary">
                cloud_upload
              </span>
              <span className="font-label-bold text-label-bold text-on-surface-variant">Tap to upload image</span>
              <span className="text-label-sm text-surface-variant">PDF, JPG or PNG (max 5MB)</span>
            </button>
          </div>
        </div>

        {/* Modal Footer (Actions) */}
        <div className="px-6 py-5 border-t border-black/5 bg-white/40 flex items-center justify-between gap-4">
          <button 
            className="px-6 py-3 rounded-lg font-label-bold text-label-bold text-on-surface-variant hover:bg-black/5 transition-all"
            onClick={handleCloseModal}
          >
            Cancel
          </button>
          <div className="flex items-center gap-4">
            <img 
              alt="Mamani Logo" 
              className="h-6 w-6 opacity-20 hidden sm:block" 
              src="https://lh3.googleusercontent.com/aida/AP1WRLugpjLuCLTGpp1lUW5gV0sJOJKgaQAgEQpiHY1JQuui6ySDvbnO4YZ0QHSRVhVd-hG-OwwggYfMsTrsrSd2KQuFrvRqxoWJmOt8gjKGA-No_W3HEumS22mhK9ClqYkVJUG_sa5Zly_4zQopwZf6KkXokO5PRHADSQ8XZf-xKApq4UdCcEwuIRf2imQ-NC2epY037chqC7-oJRJJNdq6K2E9u6Xqq76x2WiibwzE46E3-R8846YmKx-wYrSr"
            />
            <button 
              className="px-8 py-3 bg-secondary text-white rounded-lg font-label-bold text-label-bold hover:opacity-90 active:scale-95 transition-all ambient-shadow"
              onClick={handleSave}
            >
              Save Transaction
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .glass-effect {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.4);
        }
        .ambient-shadow {
          box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.08);
        }
        .custom-scrollbar::-webkit-scrollbar { 
          width: 6px; 
        }
        .custom-scrollbar::-webkit-scrollbar-track { 
          background: transparent; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: #E5E7EB; 
          border-radius: 10px; 
        }
        .category-chip {
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .category-chip:hover { 
          transform: translateY(-2px); 
        }
        .category-chip-active { 
          background: #006a61; 
          color: white; 
          box-shadow: 0 4px 12px rgba(0, 106, 97, 0.2);
        }
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .dark .glass-effect {
          background: rgba(26, 31, 46, 0.85);
        }
        .dark .bg-white/40 {
          background: rgba(26, 31, 46, 0.4);
        }
        .dark .bg-white/50 {
          background: rgba(26, 31, 46, 0.5);
        }
        .dark .bg-surface-container-low {
          background: #2a3040;
        }
        .dark .text-on-surface {
          color: #edf0ff;
        }
        .dark .text-on-surface-variant {
          color: #bfc9c3;
        }
        .dark .border-black/5 {
          border-color: rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  );
};

export default AddTransactionPage;