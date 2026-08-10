import { useState, useEffect } from 'react';

export const getCurrencySymbol = (currencyString: string) => {
  if (currencyString.includes('$')) return '$';
  if (currencyString.includes('€')) return '€';
  if (currencyString.includes('£')) return '£';
  if (currencyString.includes('TSh')) return 'TSh ';
  return '$';
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
    window.dispatchEvent(new Event('currencyChange'));
  };

  const symbol = getCurrencySymbol(currency);
  
  const formatAmount = (amount: number) => {
    const formatted = Math.abs(amount).toLocaleString();
    const isNegative = amount < 0;
    
    // For TSh, put space after. For others, put right next to number.
    const displayStr = symbol.trim() === 'TSh' ? `${symbol}${formatted}` : `${symbol}${formatted}`;
    
    return isNegative ? `-${displayStr}` : displayStr;
  };

  return { currency, symbol, updateCurrency, formatAmount };
};
