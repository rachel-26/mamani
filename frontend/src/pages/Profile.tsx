import React, { useState } from 'react';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  currency: string;
  joinDate: string;
  plan: string;
  planActiveSince: string;
  nextBilling: string;
  cardEnding: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Peter Parker',
    email: 'peter.parker@dailybugle.com',
    phone: '+1 (555) 012-3456',
    currency: 'USD ($)',
    joinDate: 'June 2023',
    plan: 'Prosperity Plan',
    planActiveSince: 'July 2023',
    nextBilling: 'Oct 12, 2024',
    cardEnding: '4242'
  });

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(true);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [isPushNotificationsEnabled, setIsPushNotificationsEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('Personal Info');

  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const tabs = [
    { id: 'Personal Info', icon: 'badge' },
    { id: 'Security', icon: 'security' },
    { id: 'Preferences', icon: 'tune' },
    { id: 'Subscription', icon: 'card_membership' },
    { id: 'Help & Support', icon: 'help' }
  ];

  return (
    <>
      <div className="max-w-6xl mx-auto py-lg">
          {/* Profile Header Card */}
          <section className="mb-lg">
            <div className="bg-surface shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-black/5 rounded-xl p-lg flex flex-col md:flex-row items-center gap-lg">
              <div className="relative">
                <div className="h-32 w-32 rounded-full overflow-hidden ring-4 ring-primary-container/20">
                  <img 
                    className="w-full h-full object-cover" 
                    alt="Close-up avatar of Peter Parker" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_wvbCTDowqPyuFTs9-QwjFPYM7KzCYFB6eiFckkZ7IxxbEhms4pPAdJj2gDYJA97ofWrjqrI11mC3OsabQSfUIPvkzRCDHH-VOMWtClUQB2IryeKyClnRWT1tiFnn2Edcty-qcUQoNNgcOquTv9raXyIROE8BR_KOA8fU-d5D9DySS_JmWZvQ1-pAe3qcc5qPg4yhcdgtDoNg3gjNOeNAn70NAfLGK6cVk9vpRHrDCJUt-mwEfvFo3xQ0CyF3kWdb6KjZ050jnekC"
                  />
                </div>
                <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform">
                  <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                </button>
              </div>
              <div className="text-center md:text-left flex-1">
                <h2 className="font-headline-md text-headline-md text-on-background mb-1">{profile.name}</h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 items-center">
                  <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-label-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    Premium Member
                  </span>
                  <span className="text-on-surface-variant font-label-sm">Joined {profile.joinDate}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-6 py-2.5 bg-primary text-white font-label-bold rounded-lg shadow-sm hover:opacity-90 active:scale-98 transition-all">Edit Profile</button>
                <button className="px-4 py-2.5 border border-outline-variant text-on-surface font-label-bold rounded-lg hover:bg-surface-container transition-colors">Share</button>
              </div>
            </div>
          </section>

          {/* Settings Layout: Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            {/* Sub-Navigation Sidebar */}
            <nav className="md:col-span-3 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-white shadow-sm border border-black/5 text-primary font-label-bold relative after:absolute after:right-4 after:w-1.5 after:h-1.5 after:bg-primary after:rounded-full'
                      : 'text-on-surface-variant font-body-md hover:bg-white hover:shadow-sm'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="material-symbols-outlined">{tab.icon}</span>
                  {tab.id}
                </button>
              ))}
            </nav>

            {/* Settings Panels Content */}
            <div className="md:col-span-9 space-y-gutter">
              {/* Personal Info Section */}
              <div className="bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-black/5 rounded-xl p-lg">
                <h3 className="font-headline-md text-numbers-md text-on-background mb-lg">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <div className="space-y-1.5">
                    <label className="font-label-bold text-on-surface-variant ml-1">Full Name</label>
                    <input 
                      className="w-full bg-[#F3F4F6] border-none rounded-lg px-4 py-3 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all text-body-md" 
                      type="text" 
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-label-bold text-on-surface-variant ml-1">Email Address</label>
                    <input 
                      className="w-full bg-[#F3F4F6] border-none rounded-lg px-4 py-3 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all text-body-md" 
                      type="email" 
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-label-bold text-on-surface-variant ml-1">Phone Number</label>
                    <input 
                      className="w-full bg-[#F3F4F6] border-none rounded-lg px-4 py-3 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all text-body-md" 
                      type="tel" 
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-label-bold text-on-surface-variant ml-1">Preferred Currency</label>
                    <select 
                      className="w-full bg-[#F3F4F6] border-none rounded-lg px-4 py-3 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all text-body-md appearance-none"
                      value={profile.currency}
                      onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
                    >
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Security Section */}
              <div className="bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-black/5 rounded-xl p-lg">
                <h3 className="font-headline-md text-numbers-md text-on-background mb-lg">Security &amp; Privacy</h3>
                <div className="space-y-md">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-label-bold text-on-background">Two-Factor Authentication</p>
                      <p className="text-label-sm text-on-surface-variant">Add an extra layer of security to your account.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        checked={isTwoFactorEnabled} 
                        className="sr-only peer" 
                        type="checkbox"
                        onChange={() => setIsTwoFactorEnabled(!isTwoFactorEnabled)}
                      />
                      <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-black/5">
                    <div>
                      <p className="font-label-bold text-on-background">Biometric Login</p>
                      <p className="text-label-sm text-on-surface-variant">Use FaceID or Fingerprint to unlock.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        checked={isBiometricEnabled} 
                        className="sr-only peer" 
                        type="checkbox"
                        onChange={() => setIsBiometricEnabled(!isBiometricEnabled)}
                      />
                      <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="pt-2">
                    <button className="text-primary font-label-bold flex items-center gap-2 hover:underline">
                      <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                      Change Password
                    </button>
                  </div>
                </div>
              </div>

              {/* Preferences Section */}
              <div className="bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-black/5 rounded-xl p-lg">
                <h3 className="font-headline-md text-numbers-md text-on-background mb-lg">Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-md">
                  <div className="flex items-center justify-between">
                    <p className="font-label-bold text-on-background">Dark Mode</p>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        checked={isDarkMode} 
                        className="sr-only peer" 
                        type="checkbox"
                        onChange={handleDarkModeToggle}
                      />
                      <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-label-bold text-on-background">Push Notifications</p>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        checked={isPushNotificationsEnabled} 
                        className="sr-only peer" 
                        type="checkbox"
                        onChange={() => setIsPushNotificationsEnabled(!isPushNotificationsEnabled)}
                      />
                      <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="space-y-1.5 col-span-1 md:col-span-2 mt-2">
                    <label className="font-label-bold text-on-surface-variant ml-1">Language</label>
                    <select className="w-full bg-[#F3F4F6] border-none rounded-lg px-4 py-3 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all text-body-md appearance-none">
                      <option>English (US)</option>
                      <option>Spanish (ES)</option>
                      <option>French (FR)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Subscription Plan Card */}
              <div className="bg-gradient-to-br from-primary to-on-primary-container text-white shadow-xl rounded-xl p-lg relative overflow-hidden group">
                <div className="absolute -right-8 -top-8 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-headline-md text-headline-md mb-1 text-white">{profile.plan}</h3>
                      <p className="text-white/80 font-label-sm">Active since {profile.planActiveSince}</p>
                    </div>
                    <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-label-bold uppercase tracking-wider text-[11px]">Premium</span>
                  </div>
                  <div className="flex items-end gap-2 mb-8">
                    <span className="text-numbers-lg font-numbers-lg">$19.99</span>
                    <span className="text-white/60 font-body-md pb-1">/ month</span>
                  </div>
                  <div className="flex items-center gap-4 text-white/90 mb-8 text-label-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px]">event</span>
                      Next Billing: {profile.nextBilling}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px]">credit_card</span>
                      Ending in {profile.cardEnding}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-6 py-2.5 bg-white text-primary font-label-bold rounded-lg hover:bg-surface-bright transition-colors shadow-lg">Manage Plan</button>
                    <button className="px-6 py-2.5 bg-white/10 border border-white/20 text-white font-label-bold rounded-lg hover:bg-white/20 transition-colors">Compare Plans</button>
                  </div>
                </div>
              </div>

              {/* Danger Zone / Actions */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-md">
                <button className="w-full md:w-auto px-10 py-3 bg-error text-white font-label-bold rounded-lg shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                  Log Out
                </button>
                <button className="text-error font-label-sm hover:underline opacity-60 hover:opacity-100 transition-opacity">Delete Account Permanently</button>
              </div>
            </div>
          </div>
      </div>
    </>
  );
};

export default ProfilePage;