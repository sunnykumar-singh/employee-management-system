import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar.jsx';
import Sidebar from '../components/sidebar/Sidebar.jsx';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-dvh bg-[#f8fafc] text-[#101828]">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className="min-h-dvh lg:pl-60">
        <Navbar onMenuToggle={() => setIsSidebarOpen(true)} />
        <main className="min-h-[calc(100dvh-78px)] p-4 sm:p-6 lg:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
