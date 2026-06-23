import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, ClipboardList, BookOpen, FileText,
  CalendarClock, Bell, Briefcase, Building2, BarChart3,
  MessageSquareWarning, LogOut, GraduationCap,
} from 'lucide-react';

const navSections = [
  {
    label: 'Overview',
    items: [
      { to: '/dashboard',    label: 'Dashboard',   icon: LayoutDashboard },
    ],
  },
  {
    label: 'Academics',
    items: [
      { to: '/attendance',   label: 'Attendance',  icon: ClipboardList },
      { to: '/academics',    label: 'Academics',   icon: BookOpen },
      { to: '/examination',  label: 'Examination', icon: FileText },
    ],
  },
  {
    label: 'Student Life',
    items: [
      { to: '/leave',        label: 'Leave & Permission', icon: CalendarClock },
      { to: '/hostel',       label: 'Hostel',      icon: Building2 },
      { to: '/placement',    label: 'Placement',   icon: Briefcase },
    ],
  },
  {
    label: 'Communication',
    items: [
      { to: '/notifications',label: 'Notices',     icon: Bell },
      { to: '/complaints',   label: 'Complaints',  icon: MessageSquareWarning },
      { to: '/analytics',    label: 'Analytics',   icon: BarChart3 },
    ],
  },
];

const Sidebar = ({ mobileOpen, onClose }) => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
      )}

      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        {/* Brand */}
        <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div className="animate-pulse-glow" style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1, #0ea5e9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <GraduationCap size={17} color="white" />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>Parent Portal</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 1 }}>Student Dashboard</p>
            </div>
          </div>
        </div>

        {/* Student chip */}
        {profile && (
          <div style={{ margin: '0.75rem 0.625rem', padding: '0.75rem', borderRadius: 12, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                background: 'linear-gradient(135deg, #6366f1, #0ea5e9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.875rem', color: 'white',
              }}>
                {profile.name?.[0]}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile.name}</p>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 1 }}>{profile.rollNumber}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4, marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-neutral" style={{ fontSize: '0.6rem' }}>Sem {profile.semester}</span>
              <span className="badge badge-neutral" style={{ fontSize: '0.6rem' }}>{profile.section}</span>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', paddingBottom: '0.5rem' }}>
          {navSections.map(({ label, items }) => (
            <div key={label}>
              <div className="sidebar-section-label">{label}</div>
              {items.map(({ to, label: lbl, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <Icon className="icon" />
                  <span>{lbl}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid var(--border)', padding: '0.75rem' }}>
          <div style={{ padding: '0 0.25rem', marginBottom: '0.5rem' }}>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Signed in as</p>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{user?.username}</p>
          </div>
          <button onClick={handleLogout} className="sidebar-link" style={{ color: '#f87171', margin: 0, width: '100%', cursor: 'pointer', background: 'none', border: 'none' }}>
            <LogOut className="icon" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
