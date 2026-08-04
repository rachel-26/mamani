import React, { useState } from 'react';

const SignUpPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign up logic here
    console.log('Sign up:', { name, email, password });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-0 md:p-6 lg:p-12 overflow-x-hidden">
      <main className="w-full max-w-[1440px] min-h-[800px] flex flex-col md:flex-row bg-surface-container-lowest rounded-none md:rounded-xl overflow-hidden shadow-sm">
        {/* Left Side: Financial Imagery & Value Prop */}
        <section className="hidden md:flex md:w-1/2 relative overflow-hidden group">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent"></div>
          <div 
            className="absolute inset-0 w-full h-full transform transition-transform duration-1000 group-hover:scale-105"
            style={{
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCgeEa_1GhNHiPHBEQrOCxyjgkYLXOeZ0xH1nvysgHT3eHMr5rvD8K86FGauqcx-j4RTGLMsWhn0YAtcqXb8NzWTAjvCj0XUK7Xc06_Z5l-xlynYFJ_Omp-W3Ea0TrXyFEi4_i27Ra33SkEJ0xMbUSodrPNaNWqwZAEyOuW7FwekizUgR-UUtLmrleehWzZN3vsQ9kbMX8gwqDfybUK8A9cu-UTvv8lEkNNbuBwJ-QJfSfExbKA6NJoZ6vFPXvU1lK8HsnXUHfI_zJy')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          ></div>
          
          {/* Content Overlay */}
          <div className="relative z-20 flex flex-col justify-between h-full p-12 lg:p-16 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary-fixed rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  account_balance
                </span>
              </div>
              <span className="font-display-lg text-display-lg tracking-tight">Mamani</span>
            </div>
            
            <div className="max-w-md">
              <h1 className="font-display-lg text-display-lg mb-4">Prosperity &amp; Security</h1>
              <p className="font-body-lg text-body-lg text-on-primary-container opacity-90 leading-relaxed mb-8">
                Join thousands of others building their legacy with Mamani. Our platform transforms wealth management into a humanized, editorial experience designed for your future.
              </p>
              
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  <div 
                    className="w-10 h-10 rounded-full border-2 border-primary bg-surface-container"
                    style={{
                      backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB5Pkv4yKgE0QI7q3OWNanozLDsg-Gbc7vLd8rMdzfQBRPIUu1WxTrLqZ1ygajk3q0iw7Hq_6hGNnJ-_2PzMVXKqMxQ8esorIgGfPUlo6ES1UlyTuxxHPWFbsstw-2wvBzqdEJNPMDoiRGHQ5cnAKs_nkMoKZ67qryVT1Xm1odvd4nKDLOftUXCQHrdt3d19GPPJkT9ev5EOWf0SPt9fJLNQE6xACzUXOG5rp7Mfh4xADnOq77VRjOfM74KwwZigMOSxhpF5CYBFX1V')",
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  ></div>
                  <div 
                    className="w-10 h-10 rounded-full border-2 border-primary bg-surface-container"
                    style={{
                      backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDFnf72lZU4kPwr275oCcYyplmLz8WCPO-TBL6MePYHo6t478GU0T_oZxG_RYPSo4FYvIesYhpZ3AeBKMEVq5QOxoKPLF3MK4Jd_2rvx23fbecGQPPf02IHaayYLOo07ntFYvnKbrrK0aPGihBaF7OQlL7o1m5BrgCHakRaosj-hU4EIhMwsYaok7UjFD278ReVPUMAEM0r6YJPYGW59BKBZKjmi9Upc5t90HGR76DjD2nMOq8srr3Y7prDpidjQuwM8jW2ofSUAo0p')",
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  ></div>
                  <div 
                    className="w-10 h-10 rounded-full border-2 border-primary bg-surface-container"
                    style={{
                      backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBqROuX5dxHFIWV0sL-Liz5mqWzBTmOPaZENISLOy6407bLP-S2HDX8IuzfOa1jLdrWTuCLsUT_--za7dAZ6n2k1hxo8zMiZWHqa74R10tvCjJQXSJ56_kYIrW-sSNrZZ5Ld_c3avmf2YfNg_Ear2C6Piv69wz0CABeUxozpx5Ga6qwi8-IDQuzEXPNgD82X9AxJSdmrmAr0Krh7VZR9pvqO1UXwkOONkrY7Y925F2Vo26dgxaBiGpN1Zm-0qWcHFltZ3uZW4UZi-Yt')",
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  ></div>
                </div>
                <span className="font-label-sm text-label-sm text-secondary-fixed">Join 50k+ Members</span>
              </div>
            </div>
            
            <footer className="font-label-sm text-label-sm text-on-primary-container/60">
              © 2024 Mamani Wealth Management. All rights reserved.
            </footer>
          </div>
        </section>

        {/* Right Side: Sign Up Form */}
        <section className="flex-1 flex flex-col justify-center items-center p-8 md:p-12 lg:p-24 bg-surface-container-lowest">
          <div className="w-full max-w-md">
            {/* Mobile Logo (Hidden on Desktop) */}
            <div className="flex md:hidden items-center gap-2 mb-12">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  account_balance
                </span>
              </div>
              <span className="font-display-lg text-headline-md text-primary">Mamani</span>
            </div>

            <header className="mb-10 text-center md:text-left">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Create Account</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Secure your financial future today.</p>
            </header>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="space-y-2">
                <label className="font-label-bold text-label-bold text-on-surface-variant" htmlFor="name">
                  Full Name
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                    person
                  </span>
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-transparent rounded-lg font-body-md text-body-md text-on-surface input-focus transition-all"
                    id="name"
                    placeholder="John Doe"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="font-label-bold text-label-bold text-on-surface-variant" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                    mail
                  </span>
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-transparent rounded-lg font-body-md text-body-md text-on-surface input-focus transition-all"
                    id="email"
                    placeholder="john@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="font-label-bold text-label-bold text-on-surface-variant" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                    lock
                  </span>
                  <input
                    className="w-full pl-10 pr-12 py-3 bg-surface-container-low border border-transparent rounded-lg font-body-md text-body-md text-on-surface input-focus transition-all"
                    id="password"
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                    type="button"
                    onClick={togglePasswordVisibility}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                <p className="font-label-sm text-label-sm text-outline px-1">Must be at least 8 characters.</p>
              </div>

              {/* Submit Button */}
              <button
                className="w-full py-4 primary-btn text-white font-label-bold text-body-md rounded-lg shadow-sm hover:opacity-95 flex items-center justify-center gap-2"
                type="submit"
              >
                Create Account
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant"></div>
              </div>
              <div className="relative flex justify-center text-label-sm">
                <span className="px-4 bg-surface-container-lowest text-outline font-label-sm">Or continue with</span>
              </div>
            </div>

            {/* Social Sign Up */}
            <button className="w-full py-4 border border-outline-variant bg-surface-container-lowest rounded-lg font-label-bold text-body-md text-on-surface flex items-center justify-center gap-3 hover:bg-surface-container-low transition-colors active:scale-[0.98]">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              Sign up with Google
            </button>

            <footer className="mt-10 text-center">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Already have an account? 
                <a className="text-secondary font-label-bold hover:underline ml-1" href="#">
                  Log in
                </a>
              </p>
            </footer>
          </div>
        </section>
      </main>

      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-fixed-dim blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-fixed blur-[120px] rounded-full"></div>
      </div>
    </div>
  );
};

export default SignUpPage;