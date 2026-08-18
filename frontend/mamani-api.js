/**
 * mamani-api.js
 * Shared API helper for all Mamani HTML pages.
 * Drop-in: <script src="mamani-api.js"></script>
 */

const API_BASE = 'http://localhost:8000';

const MamaniAPI = {
  // ── Auth ─────────────────────────────────────────────────────────
  getToken() {
    return localStorage.getItem('access_token');
  },

  isLoggedIn() {
    return !!this.getToken();
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_currency');
    window.location.href = 'login.html';
  },

  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.replace('login.html');
    }
  },

  _authHeaders() {
    return {
      'Authorization': `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json',
    };
  },

  async _handleResponse(res) {
    if (res.status === 401) {
      this.logout();
      throw new Error('Unauthorized');
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(err.detail || 'Request failed');
    }
    if (res.status === 204) return null;
    return res.json();
  },

  // ── Login ─────────────────────────────────────────────────────────
  async login(email, password) {
    // FastAPI OAuth2PasswordRequestForm requires form data
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });
    return this._handleResponse(res);
  },

  async signup(fullName, email, password) {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: fullName, email, password }),
    });
    return this._handleResponse(res);
  },

  // ── User ──────────────────────────────────────────────────────────
  async getMe() {
    const res = await fetch(`${API_BASE}/users/me`, { headers: this._authHeaders() });
    const user = await this._handleResponse(res);
    if (user && user.currency) {
      this.setCurrency(user.currency, false);
    }
    if (user && user.full_name) localStorage.setItem('user_name', user.full_name);
    if (user && user.email) localStorage.setItem('user_email', user.email);
    return user;
  },

  async updateMe(payload) {
    const res = await fetch(`${API_BASE}/users/me`, {
      method: 'PUT',
      headers: this._authHeaders(),
      body: JSON.stringify(payload),
    });
    const updated = await this._handleResponse(res);
    if (updated && updated.currency) {
      this.setCurrency(updated.currency);
    }
    if (updated && updated.full_name) localStorage.setItem('user_name', updated.full_name);
    if (updated && updated.email) localStorage.setItem('user_email', updated.email);
    return updated;
  },

  // ── Transactions ──────────────────────────────────────────────────
  async getTransactions({ skip = 0, limit = 50, is_expense, category } = {}) {
    const params = new URLSearchParams({ skip, limit });
    if (is_expense !== undefined) params.append('is_expense', is_expense);
    if (category) params.append('category', category);
    const res = await fetch(`${API_BASE}/transactions?${params}`, { headers: this._authHeaders() });
    return this._handleResponse(res);
  },

  async getTransactionSummary() {
    const res = await fetch(`${API_BASE}/transactions/summary`, { headers: this._authHeaders() });
    return this._handleResponse(res);
  },

  async createTransaction(payload) {
    const res = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: this._authHeaders(),
      body: JSON.stringify(payload),
    });
    return this._handleResponse(res);
  },

  async deleteTransaction(txId) {
    const res = await fetch(`${API_BASE}/transactions/${txId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${this.getToken()}` },
    });
    if (res.status === 204) return true;
    return this._handleResponse(res);
  },

  async uploadReceipt(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/transactions/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.getToken()}` },
      body: formData
    });
    return this._handleResponse(res);
  },

  // ── Goals ─────────────────────────────────────────────────────────
  async getGoals() {
    const res = await fetch(`${API_BASE}/goals`, { headers: this._authHeaders() });
    return this._handleResponse(res);
  },

  async createGoal(payload) {
    const res = await fetch(`${API_BASE}/goals`, {
      method: 'POST',
      headers: this._authHeaders(),
      body: JSON.stringify(payload),
    });
    return this._handleResponse(res);
  },

  async depositToGoal(id, amount) {
    const res = await fetch(`${API_BASE}/goals/${id}/deposit`, {
      method: 'PATCH',
      headers: this._authHeaders(),
      body: JSON.stringify({ amount }),
    });
    return this._handleResponse(res);
  },

  async deleteGoal(id) {
    const res = await fetch(`${API_BASE}/goals/${id}`, {
      method: 'DELETE',
      headers: this._authHeaders(),
    });
    return this._handleResponse(res);
  },

  // ── Helpers ───────────────────────────────────────────────────────
  CURRENCIES: [
    { code: "USD", symbol: "$" }, { code: "EUR", symbol: "€" }, { code: "GBP", symbol: "£" }, { code: "JPY", symbol: "¥" },
    { code: "AUD", symbol: "A$" }, { code: "CAD", symbol: "C$" }, { code: "CHF", symbol: "CHF" }, { code: "CNY", symbol: "¥" },
    { code: "SEK", symbol: "kr" }, { code: "NZD", symbol: "NZ$" }, { code: "MXN", symbol: "$" }, { code: "SGD", symbol: "S$" },
    { code: "HKD", symbol: "HK$" }, { code: "NOK", symbol: "kr" }, { code: "KRW", symbol: "₩" }, { code: "TRY", symbol: "₺" },
    { code: "RUB", symbol: "₽" }, { code: "INR", symbol: "₹" }, { code: "BRL", symbol: "R$" }, { code: "ZAR", symbol: "R" },
    { code: "TZS", symbol: "TSh" }, { code: "KES", symbol: "KSh" }, { code: "UGX", symbol: "USh" }, { code: "NGN", symbol: "₦" },
    { code: "GHS", symbol: "GH₵" }, { code: "RWF", symbol: "FRw" }, { code: "ZMW", symbol: "ZK" }, { code: "AED", symbol: "د.إ" },
    { code: "SAR", symbol: "﷼" }, { code: "THB", symbol: "฿" }, { code: "MYR", symbol: "RM" }, { code: "PHP", symbol: "₱" },
    { code: "IDR", symbol: "Rp" }, { code: "VND", symbol: "₫" }, { code: "PLN", symbol: "zł" }, { code: "DKK", symbol: "kr" }
  ],

  getCurrency() {
    return localStorage.getItem('user_currency') || 'USD ($)';
  },

  setCurrency(currencyStr, dispatch = true) {
    if (!currencyStr) return;
    localStorage.setItem('user_currency', currencyStr);
    if (dispatch && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('currencyChange', { detail: { currency: currencyStr } }));
    }
  },

  getCurrencySymbol(currencyString) {
    const raw = currencyString || this.getCurrency();
    const match = raw.match(/\(([^)]+)\)/);
    if (match && match[1]) {
      return match[1].trim();
    }
    const found = this.CURRENCIES.find(c => c.code.toUpperCase() === raw.trim().toUpperCase());
    if (found) return found.symbol;
    return raw.trim() || '$';
  },

  formatAmount(amount, symbol) {
    const sym = symbol || this.getCurrencySymbol();
    const num = Math.abs(Number(amount) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const isNegative = Number(amount) < 0;
    const needsSpace = sym.length > 1 && !sym.endsWith('$');
    const formatted = needsSpace ? `${sym} ${num}` : `${sym}${num}`;
    return isNegative ? `-${formatted}` : formatted;
  },

  onCurrencyChange(callback) {
    if (typeof window === 'undefined') return;
    window.addEventListener('currencyChange', callback);
    window.addEventListener('storage', (e) => {
      if (e.key === 'user_currency') callback(e);
    });
  },

  formatRelativeDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  },

  CATEGORY_ICONS: {
    Housing:       { icon: 'home',             bg: 'bg-orange-100', color: 'text-orange-700'   },
    Food:          { icon: 'restaurant',        bg: 'bg-amber-100',  color: 'text-amber-700'    },
    Transport:     { icon: 'directions_car',    bg: 'bg-blue-100',   color: 'text-blue-700'     },
    Utilities:     { icon: 'bolt',              bg: 'bg-yellow-100', color: 'text-yellow-700'   },
    Health:        { icon: 'medical_services',  bg: 'bg-rose-100',   color: 'text-rose-700'     },
    Shopping:      { icon: 'shopping_bag',      bg: 'bg-purple-100', color: 'text-purple-700'   },
    Entertainment: { icon: 'movie',             bg: 'bg-pink-100',   color: 'text-pink-700'     },
    Dining:        { icon: 'restaurant',        bg: 'bg-amber-100',  color: 'text-amber-700'    },
    Electronics:   { icon: 'devices',           bg: 'bg-indigo-100', color: 'text-indigo-700'   },
    Income:        { icon: 'account_balance',   bg: 'bg-emerald-100',color: 'text-emerald-700'  },
    Others:        { icon: 'category',          bg: 'bg-gray-100',   color: 'text-gray-700'     },
  },

  getCategoryMeta(category, isExpense) {
    if (!isExpense) return this.CATEGORY_ICONS['Income'];
    return this.CATEGORY_ICONS[category] || this.CATEGORY_ICONS['Others'];
  },
};
