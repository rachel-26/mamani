
import { Link } from 'react-router-dom';

const TopBar = ({ title = 'Dashboard' }) => {
  return (
    <div className="flex justify-between items-center mb-8 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm hidden sm:block">
          Welcome back! Here's your financial overview.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            search
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-none rounded-xl focus:ring-2 focus:ring-primary dark:text-white outline-none"
          />
        </div>
        <button className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-on-surface-variant hover:bg-primary hover:text-white transition-colors relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <Link to="/profile" className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 p-2 pr-4 rounded-xl cursor-pointer hover:bg-primary/10 transition">
          <img
            src="https://ui-avatars.com/api/?name=User&background=003527&color=fff"
            alt="User"
            className="w-8 h-8 rounded-lg"
          />
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800 dark:text-white leading-tight">My Profile</p>
            <p className="text-xs text-gray-500">Premium Member</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default TopBar;
