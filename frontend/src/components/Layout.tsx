import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen text-[#141b2b] bg-[#f9f9ff] font-sans">
      <Sidebar />
      <main className="min-h-screen relative" style={{ marginLeft: "16rem", padding: "24px" }}>
        <TopBar title="Dashboard" />
        <div style={{ paddingBottom: "48px" }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
