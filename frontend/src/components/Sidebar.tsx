
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'grid_view' },
    { name: 'Transactions', path: '/transactions', icon: 'receipt_long' },
    { name: 'Insights', path: '/insights', icon: 'insights' },
    { name: 'Goals', path: '/goals', icon: 'track_changes' },
    { name: 'Settings', path: '/profile', icon: 'settings' }
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg hidden md:flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-primary dark:text-accent flex items-center gap-2">
          <span className="material-symbols-outlined">payments</span>
          Mamani
        </h2>
      </div>
      <nav className="flex-1 mt-6">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-6 py-4 mx-4 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-primary text-white shadow-md transform scale-105'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-accent'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-semibold">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-6 mt-auto">
        <div className="bg-primary/10 dark:bg-accent/10 rounded-2xl p-4 text-center">
          <h3 className="font-semibold text-primary dark:text-accent mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Contact our support team 24/7</p>
          <button className="w-full py-2 bg-primary dark:bg-accent text-white dark:text-primary rounded-lg text-sm font-semibold hover:opacity-90 transition">
            Support Center
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
