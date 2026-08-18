import React, { useState, useEffect } from 'react';
import { useCurrency } from '../hooks/useCurrency';
import { useApi } from '../hooks/useApi';
import { getMe, updateMe } from '../api/users';
import { logout } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { currency, updateCurrency } = useCurrency();
  const { data: user, loading } = useApi(getMe);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    currency: currency,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [isPushNotificationsEnabled, setIsPushNotificationsEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('Personal Info');

  // Populate from API
  useEffect(() => {
    if (user) {
      setProfile({
        name:     user.full_name || '',
        email:    user.email || '',
        phone:    user.phone || '',
        currency: user.currency || 'USD ($)',
      });
      // Sync currency to hook/localStorage
      if (user.currency) updateCurrency(user.currency);
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveMsg('');
    try {
      await updateMe({
        full_name: profile.name,
        phone:     profile.phone,
        currency:  profile.currency,
      });
      updateCurrency(profile.currency);
      setSaveMsg('Profile saved successfully!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err: any) {
      setSaveMsg(err?.response?.data?.detail || 'Failed to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const tabs = [
    { id: 'Personal Info', icon: 'badge' },
    { id: 'Security',      icon: 'security' },
    { id: 'Preferences',   icon: 'tune' },
    { id: 'Subscription',  icon: 'card_membership' },
    { id: 'Help & Support',icon: 'help' },
  ];

  const { currencies } = useCurrency();
  const currencyOptions = currencies.map(c => `${c.code} (${c.symbol})`);

  return (
    <>
      <div className="max-w-6xl mx-auto py-lg">
        {/* Profile Header */}
        <section className="mb-lg">
          <div className="bg-surface shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-black/5 rounded-xl p-lg flex flex-col md:flex-row items-center gap-lg">
            <div className="relative">
              <div className="h-32 w-32 rounded-full overflow-hidden ring-4 ring-primary-container/20 bg-primary/10 flex items-center justify-center">
                {user?.avatar_url ? (
                  <img className="w-full h-full object-cover" alt="Profile" src={user.avatar_url} />
                ) : (
                  <span className="material-symbols-outlined text-5xl text-primary/30">person</span>
                )}
              </div>
              <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              </button>
            </div>
            <div className="text-center md:text-left flex-1">
              {loading ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-6 bg-gray-100 rounded w-48" />
                  <div className="h-4 bg-gray-100 rounded w-32" />
                </div>
              ) : (
                <>
                  <h2 className="font-headline-md text-headline-md text-on-background mb-1">{profile.name || 'Your Name'}</h2>
                  <p className="text-on-surface-variant font-label-sm">{profile.email}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 items-center mt-2">
                    <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-label-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      Active Member
                    </span>
                    {user?.created_at && (
                      <span className="text-on-surface-variant font-label-sm">
                        Joined {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-3">
              <button
                className="px-6 py-2.5 bg-primary text-white font-label-bold rounded-lg shadow-sm hover:opacity-90 active:scale-98 transition-all disabled:opacity-60"
                onClick={handleSaveProfile}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
          {saveMsg && (
            <p className={`mt-2 px-4 py-2 rounded-lg text-label-bold text-sm ${saveMsg.includes('success') ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error'}`}>
              {saveMsg}
            </p>
          )}
        </section>

        {/* Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {/* Sub-nav */}
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

          {/* Content panels */}
          <div className="md:col-span-9 space-y-gutter">
            {/* Personal Info */}
            <div className="bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-black/5 rounded-xl p-lg">
              <h3 className="font-headline-md text-numbers-md text-on-background mb-lg">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="space-y-1.5">
                  <label className="font-label-bold text-on-surface-variant ml-1">Full Name</label>
                  <input
                    className="w-full bg-[#F3F4F6] border-none rounded-lg px-4 py-3 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all text-body-md"
                    type="text"
                    value={profile.name}
                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-label-bold text-on-surface-variant ml-1">Email Address</label>
                  <input
                    className="w-full bg-[#F3F4F6] border-none rounded-lg px-4 py-3 text-body-md text-on-surface-variant cursor-not-allowed"
                    type="email"
                    value={profile.email}
                    readOnly
                    title="Email cannot be changed"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-label-bold text-on-surface-variant ml-1">Phone Number</label>
                  <input
                    className="w-full bg-[#F3F4F6] border-none rounded-lg px-4 py-3 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all text-body-md"
                    type="tel"
                    value={profile.phone}
                    onChange={e => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-label-bold text-on-surface-variant ml-1">Preferred Currency</label>
                  <select
                    className="w-full bg-[#F3F4F6] border-none rounded-lg px-4 py-3 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all text-body-md appearance-none"
                    value={profile.currency}
                    onChange={e => {
                      setProfile({ ...profile, currency: e.target.value });
                      updateCurrency(e.target.value);
                    }}
                  >
                    {currencyOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-black/5 rounded-xl p-lg">
              <h3 className="font-headline-md text-numbers-md text-on-background mb-lg">Security & Privacy</h3>
              <div className="space-y-md">
                {[
                  { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security to your account.', state: isTwoFactorEnabled, toggle: () => setIsTwoFactorEnabled(!isTwoFactorEnabled) },
                  { label: 'Biometric Login', desc: 'Use FaceID or Fingerprint to unlock.', state: isBiometricEnabled, toggle: () => setIsBiometricEnabled(!isBiometricEnabled) },
                ].map((item, i) => (
                  <div key={item.label} className={`flex items-center justify-between py-2 ${i > 0 ? 'border-t border-black/5' : ''}`}>
                    <div>
                      <p className="font-label-bold text-on-background">{item.label}</p>
                      <p className="text-label-sm text-on-surface-variant">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input checked={item.state} className="sr-only peer" type="checkbox" onChange={item.toggle} />
                      <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                    </label>
                  </div>
                ))}
                <div className="pt-2">
                  <button className="text-primary font-label-bold flex items-center gap-2 hover:underline">
                    <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                    Change Password
                  </button>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-black/5 rounded-xl p-lg">
              <h3 className="font-headline-md text-numbers-md text-on-background mb-lg">Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-md">
                {[
                  { label: 'Dark Mode', state: isDarkMode, toggle: () => setIsDarkMode(!isDarkMode) },
                  { label: 'Push Notifications', state: isPushNotificationsEnabled, toggle: () => setIsPushNotificationsEnabled(!isPushNotificationsEnabled) },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <p className="font-label-bold text-on-background">{item.label}</p>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input checked={item.state} className="sr-only peer" type="checkbox" onChange={item.toggle} />
                      <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Danger zone */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-md">
              <button
                className="w-full md:w-auto px-10 py-3 bg-error text-white font-label-bold rounded-lg shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                onClick={handleLogout}
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                Log Out
              </button>
              <button className="text-error font-label-sm hover:underline opacity-60 hover:opacity-100 transition-opacity">
                Delete Account Permanently
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;