import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/auth';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const data = await login({ email, password });
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('access_token', data.access_token); // for HTML pages
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'Invalid email or password.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      {/* Main Container */}
      <main className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[32px] overflow-hidden shadow-2xl min-h-[720px]">
        {/* Left Column: Visual/Branding (Split Screen Layout) */}
        <section className="hidden lg:flex flex-col justify-between p-lg relative overflow-hidden bg-primary-container text-white">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
            <svg className="w-full h-full scale-150" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="none" r="40" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="50" cy="50" fill="none" r="30" stroke="currentColor" strokeWidth="0.5" />
              <path d="M10,50 Q50,0 90,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>
          
          <div className="z-10">
            <h1 className="font-display-lg text-display-lg tracking-tighter mb-4">Mamani</h1>
            <p className="font-body-lg text-body-lg text-primary-fixed/80 max-w-sm">
              Secure your financial future with precision and intelligent growth.
            </p>
          </div>
          
          <div className="z-10 mt-auto">
            <div className="glass-card rounded-xl p-md bg-white/10 border-white/20 backdrop-blur-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary-fixed">shield_lock</span>
                </div>
                <div>
                  <p className="font-label-bold text-label-bold text-white">Military-Grade Encryption</p>
                  <p className="font-label-sm text-label-sm text-white/60">Your data remains private and secure.</p>
                </div>
              </div>
              <div className="h-[1px] w-full bg-white/10 my-4" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary-fixed">monitoring</span>
                </div>
                <div>
                  <p className="font-label-bold text-label-bold text-white">Intelligent Insights</p>
                  <p className="font-label-sm text-label-sm text-white/60">Smart tracking for every transaction.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Login Form */}
        <section className="flex flex-col items-center justify-center p-gutter lg:p-lg bg-surface">
          <div className="w-full max-w-md">
            {/* Brand Anchor: Logo */}
            <div className="flex flex-col items-center mb-10">
              <img
                alt="Mamani Primary Logo"
                className="w-20 h-20 mb-6 drop-shadow-sm"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDreS92pO8MxnoAUpQNjB94riDb2fM3qjYcPSMKACP3Mnd8zVMbcvx7ol7kwRuVgpPDGVxoUgwaK2cLse4zVqzZuTnJQG8QcwEDpNMYBieIzXu13BBJ46zE4IJyC6mosgLGaOayD4TZgzGHofqbZg9lZdHoUM4PCSmlIQq3LQNclsIQVD_bmZfiAeBA9NaRblpN_TldfOnHqTRYIiN86DgQKKLj0rI6CbtZTzPzRFuuAJhLYPrew-glw1fe8LJP_dC87C2GqPnG-Qle"
              />
              <h2 className="font-headline-md text-headline-md text-on-background">Welcome back</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">Sign in to manage your prosperity</p>
            </div>

            {/* Login Fields */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="font-label-bold text-label-bold text-on-surface ml-1" htmlFor="email">
                  Email Address
                </label>
                <div className="relative emerald-focus border border-black/5 bg-[#F3F4F6] rounded-xl transition-all">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-on-surface-variant text-xl">alternate_email</span>
                  </div>
                  <input
                    className="block w-full pl-12 pr-4 py-4 bg-transparent border-none focus:ring-0 text-on-surface font-body-md placeholder:text-outline-variant"
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="font-label-bold text-label-bold text-on-surface" htmlFor="password">
                    Password
                  </label>
                  <a className="font-label-bold text-label-bold text-secondary hover:underline transition-all" href="#">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative emerald-focus border border-black/5 bg-[#F3F4F6] rounded-xl transition-all">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-on-surface-variant text-xl">lock</span>
                  </div>
                  <input
                    className="block w-full pl-12 pr-12 py-4 bg-transparent border-none focus:ring-0 text-on-surface font-body-md placeholder:text-outline-variant"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-on-surface-variant hover:text-primary transition-colors"
                    type="button"
                    onClick={togglePasswordVisibility}
                  >
                    <span className="material-symbols-outlined" id="passwordIcon">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* CTA Button */}
              <button
                className={`w-full py-4 bg-primary text-white font-label-bold text-lg rounded-xl btn-hover shadow-lg shadow-primary/20 hover:bg-primary-container ${
                  isLoading ? 'opacity-80' : ''
                }`}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Sign In'}
              </button>
            </form>

            {/* Social Login */}
            <div className="mt-8">
              <div className="relative flex items-center justify-center mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-black/5" />
                </div>
                <span className="relative px-4 bg-surface font-label-sm text-label-sm text-outline-variant">
                  OR CONTINUE WITH
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-3 py-3 border border-black/5 bg-white rounded-xl font-label-bold text-on-surface btn-hover hover:bg-surface-container-low">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Google
                </button>

                <button className="flex items-center justify-center gap-3 py-3 border border-black/5 bg-white rounded-xl font-label-bold text-on-surface btn-hover hover:bg-surface-container-low">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.96.95-2.21 1.72-3.6 1.72-1.39 0-2.31-.69-3.7-.69s-2.31.69-3.7.69c-1.39 0-2.64-.77-3.6-1.72-3.23-3.14-3.23-8.27 0-11.4 1.71-1.66 3.99-2.03 5.46-2.03.96 0 1.94.31 2.64.31s1.68-.31 2.64-.31c1.47 0 3.75.37 5.46 2.03 1.14 1.11 1.9 2.5 2.25 3.94-.35.15-2.04.87-2.04 3.1 0 2.22 1.69 3.01 2.04 3.16-.35 1.44-1.11 2.83-2.25 3.94zM12.03 7.25c-.21-2.02 1.34-4.14 3.26-4.75.21 2.02-1.34 4.14-3.26 4.75z" />
                  </svg>
                  Apple
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 px-4 py-3 bg-error/10 border border-error/20 rounded-xl">
                <p className="text-error font-label-bold text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  {error}
                </p>
              </div>
            )}

            {/* Footer Link */}
            <div className="mt-12 text-center">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Don't have an account?
                <Link className="font-label-bold text-label-bold text-secondary hover:underline transition-all ml-1" to="/signup">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Copyright */}
      <footer className="fixed bottom-4 left-0 w-full text-center pointer-events-none">
        <p className="font-label-sm text-label-sm text-outline-variant opacity-60">
          © 2024 Mamani Financial. All rights reserved.
        </p>
      </footer>

      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.04);
        }
        .btn-hover {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-hover:active {
          transform: scale(0.98);
        }
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .emerald-focus:focus-within {
          box-shadow: 0 0 0 4px rgba(6, 78, 59, 0.1);
          border-color: #064e3b;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;