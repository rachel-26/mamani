import { useState, useEffect } from 'react';

export const CURRENCIES = [
  { code: "USD", symbol: "$" }, { code: "EUR", symbol: "€" }, { code: "GBP", symbol: "£" }, { code: "JPY", symbol: "¥" },
  { code: "AUD", symbol: "A$" }, { code: "CAD", symbol: "C$" }, { code: "CHF", symbol: "CHF" }, { code: "CNY", symbol: "¥" },
  { code: "SEK", symbol: "kr" }, { code: "NZD", symbol: "NZ$" }, { code: "MXN", symbol: "$" }, { code: "SGD", symbol: "S$" },
  { code: "HKD", symbol: "HK$" }, { code: "NOK", symbol: "kr" }, { code: "KRW", symbol: "₩" }, { code: "TRY", symbol: "₺" },
  { code: "RUB", symbol: "₽" }, { code: "INR", symbol: "₹" }, { code: "BRL", symbol: "R$" }, { code: "ZAR", symbol: "R" },
  { code: "TZS", symbol: "TSh" }, { code: "KES", symbol: "KSh" }, { code: "UGX", symbol: "USh" }, { code: "NGN", symbol: "₦" },
  { code: "GHS", symbol: "GH₵" }, { code: "RWF", symbol: "FRw" }, { code: "ZMW", symbol: "ZK" }, { code: "AED", symbol: "د.إ" },
  { code: "SAR", symbol: "﷼" }, { code: "THB", symbol: "฿" }, { code: "MYR", symbol: "RM" }, { code: "PHP", symbol: "₱" },
  { code: "IDR", symbol: "Rp" }, { code: "VND", symbol: "₫" }, { code: "PLN", symbol: "zł" }, { code: "DKK", symbol: "kr" }
];

export const getCurrencySymbol = (currencyString: string) => {
  if (!currencyString) return '$';
  const match = currencyString.match(/\(([^)]+)\)/);
  if (match && match[1]) {
    return match[1].trim();
  }
  const found = CURRENCIES.find(c => c.code.toUpperCase() === currencyString.trim().toUpperCase());
  if (found) return found.symbol;
  return currencyString.trim() || '$';
};

export const useCurrency = () => {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('user_currency') || 'USD ($)';
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setCurrency(localStorage.getItem('user_currency') || 'USD ($)');
    };
    
    // Listen to custom event for same-tab updates
    window.addEventListener('currencyChange', handleStorageChange);
    // Listen to storage event for cross-tab updates
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('currencyChange', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const updateCurrency = (newCurrency: string) => {
    localStorage.setItem('user_currency', newCurrency);
    setCurrency(newCurrency);
    window.dispatchEvent(new CustomEvent('currencyChange', { detail: { currency: newCurrency } }));
  };

  const symbol = getCurrencySymbol(currency);
  
  const formatAmount = (amount: number) => {
    const formatted = Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const isNegative = amount < 0;
    const needsSpace = symbol.length > 1 && !symbol.endsWith('$');
    const displayStr = needsSpace ? `${symbol} ${formatted}` : `${symbol}${formatted}`;
    return isNegative ? `-${displayStr}` : displayStr;
  };

  return { currency, symbol, updateCurrency, formatAmount, currencies: CURRENCIES };
};
