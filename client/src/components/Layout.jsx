import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile } = useAuth();

  return (
    <div style={{ minHeight: '100vh', background: '#111122' }}>
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="page-wrapper">
        {/* Top bar */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 30,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.875rem 2.5rem',
          background: 'rgba(17,17,34,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
        }}>
          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            style={{ padding: '0.5rem', borderRadius: 8, background: 'var(--surface-2)', border: 'none', cursor: 'pointer' }}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={18} style={{ color: 'var(--text-primary)' }} />
          </button>

          {/* Breadcrumb / title placeholder (desktop) */}
          <div className="hidden md:block" />

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button style={{
              position: 'relative', padding: '0.5rem 0.625rem', borderRadius: 10,
              background: 'var(--surface-2)', border: '1px solid var(--border)', cursor: 'pointer',
            }}>
              <Bell size={17} style={{ color: 'var(--text-secondary)', display: 'block' }} />
              <span style={{
                position: 'absolute', top: 5, right: 5,
                width: 7, height: 7, borderRadius: '50%',
                background: '#6366f1', border: '1.5px solid #111122',
              }} />
            </button>

            {/* Avatar */}
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1, #0ea5e9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.875rem', color: 'white', flexShrink: 0,
            }}>
              {profile?.name?.[0] || 'S'}
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
