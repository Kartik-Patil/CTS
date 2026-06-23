import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import {
  ClipboardList, BookOpen, CalendarClock, TrendingUp,
  Phone, Mail, GraduationCap, Building2, Award, Activity,
  Bell, ChevronRight, AlertTriangle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ── Stat Card ──────────────────────────────────────────── */
const StatCard = ({ label, value, sub, color, icon: Icon, to }) => {
  const navigate = useNavigate();
  return (
    <div className="stat-card animate-fade-up" onClick={() => to && navigate(to)}
      style={{ cursor: to ? 'pointer' : 'default' }}>
      <div className="stat-card-icon" style={{ background: `${color}18`, border: `1px solid ${color}28` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div className="stat-card-value" style={{ color }}>{value}</div>
      <div className="stat-card-label">{label}</div>
      {sub && <div className="stat-card-sub">{sub}</div>}
      {to && (
        <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}>
          <ChevronRight size={15} style={{ color: 'var(--text-muted)' }} />
        </div>
      )}
    </div>
  );
};

/* ── Priority badge ─────────────────────────────────────── */
const priorityBadge = { urgent: 'badge-danger', high: 'badge-warning', normal: 'badge-info', low: 'badge-neutral' };

/* ── Info line ──────────────────────────────────────────── */
const InfoLine = ({ icon: Icon, children, href }) => {
  const content = (
    <div className="info-row">
      <Icon size={13} />
      <span>{children}</span>
    </div>
  );
  return href ? <a href={href} style={{ textDecoration: 'none' }}>{content}</a> : content;
};

/* ── Dashboard ──────────────────────────────────────────── */
const Dashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/students/dashboard').then(r => r.data.data),
  });

  if (isLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%' }} className="animate-spin" />
    </div>
  );

  const { student, quickStats, recentNotifications } = data || {};
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="animate-fade-up">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          {greeting} 👋
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
          Here's {student?.name?.split(' ')[0]}'s academic snapshot for Semester {student?.semester}
        </p>
      </div>

      {/* ── Student Card ─────────────────────────────────────── */}
      <div className="glass animate-fade-up" style={{ padding: '1.75rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div style={{
            width: 68, height: 68, borderRadius: 16, flexShrink: 0,
            background: 'linear-gradient(135deg, #6366f1, #0ea5e9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.625rem', fontWeight: 800, color: 'white',
          }}>
            {student?.name?.[0]}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{student?.name}</h2>
              <span className="badge badge-purple">{student?.rollNumber}</span>
              {student?.hostelResident && <span className="badge badge-info">Hostel Resident</span>}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem 1.75rem', marginTop: '0.375rem' }}>
              <InfoLine icon={GraduationCap}>{student?.branch}</InfoLine>
              <InfoLine icon={Award}>Semester {student?.semester} · Section {student?.section}</InfoLine>
              <InfoLine icon={Activity}>AY {student?.academicYear}</InfoLine>
              <InfoLine icon={Building2}>{student?.department}</InfoLine>
            </div>
          </div>

          {/* CGPA / SGPA */}
          <div style={{
            display: 'flex', gap: '2rem', flexShrink: 0,
            padding: '0.875rem 1.375rem', borderRadius: 14,
            background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.15)',
          }}>
            {[
              { label: 'CGPA', value: student?.cgpa?.toFixed(2) },
              { label: 'SGPA', value: student?.currentSgpa?.toFixed(2) },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</p>
                <p className="gradient-text" style={{ fontSize: '1.625rem', fontWeight: 800, marginTop: '0.125rem' }}>{value || '—'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats Grid ───────────────────────────────────────── */}
      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <StatCard
          label="Overall Attendance" icon={ClipboardList} color="#6366f1" to="/attendance"
          value={`${quickStats?.overallAttendance || 0}%`}
          sub={quickStats?.subjectsBelowThreshold > 0
            ? `${quickStats.subjectsBelowThreshold} subject${quickStats.subjectsBelowThreshold > 1 ? 's' : ''} below 75%`
            : 'All subjects above 75%'}
        />
        <StatCard
          label="Current SGPA" icon={TrendingUp} color="#10b981" to="/academics"
          value={quickStats?.currentSgpa?.toFixed(2) || '—'}
          sub="This semester"
        />
        <StatCard
          label="CGPA" icon={BookOpen} color="#0ea5e9" to="/academics"
          value={quickStats?.cgpa?.toFixed(2) || '—'}
          sub="Cumulative"
        />
        <StatCard
          label="Active Leaves" icon={CalendarClock} to="/leave"
          color={quickStats?.activeLeaves > 0 ? '#f59e0b' : '#64748b'}
          value={quickStats?.activeLeaves || 0}
          sub="Pending approval"
        />
      </div>

      {/* ── Bottom two-column ─────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' }}>

        {/* Notifications */}
        <div className="glass animate-fade-up" style={{ padding: '1.5rem' }}>
          <div className="section-header">
            <span className="section-title">
              <Bell size={16} style={{ color: '#6366f1' }} />
              Recent Notifications
            </span>
            <button onClick={() => navigate('/notifications')}
              style={{ fontSize: '0.8rem', fontWeight: 600, color: '#a5b4fc', background: 'none', border: 'none', cursor: 'pointer' }}>
              View all →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {recentNotifications?.length > 0 ? recentNotifications.map((n, i) => (
              <div key={n._id}
                className={`glass-light notif-${n.type}`}
                style={{ padding: '0.875rem 1rem', animationDelay: `${i * 0.05}s`, cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>{n.title}</p>
                  <span className={`badge ${priorityBadge[n.priority] || 'badge-info'}`} style={{ flexShrink: 0 }}>{n.priority}</span>
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>
                  {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '2.5rem 0' }}>
                <Bell size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 0.75rem' }} />
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No notifications yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Right column — Parent & Mentor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Parent */}
          <div className="card animate-fade-up" style={{ padding: '1.375rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Parent / Guardian
            </p>
            <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              {student?.parent?.fatherName || '—'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <InfoLine icon={Phone} href={`tel:${student?.parent?.mobile}`}>{student?.parent?.mobile || '—'}</InfoLine>
              <InfoLine icon={Mail} href={`mailto:${student?.parent?.email}`}>{student?.parent?.email || '—'}</InfoLine>
            </div>
          </div>

          {/* Mentor */}
          <div className="card animate-fade-up" style={{ padding: '1.375rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Faculty Mentor
            </p>
            {student?.mentor ? (
              <>
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  {student.mentor.name}
                </p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  {student.mentor.designation}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  {student.mentor.mobile && <InfoLine icon={Phone} href={`tel:${student.mentor.mobile}`}>{student.mentor.mobile}</InfoLine>}
                  {student.mentor.email  && <InfoLine icon={Mail}  href={`mailto:${student.mentor.email}`}>{student.mentor.email}</InfoLine>}
                </div>
              </>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No mentor assigned</p>
            )}
          </div>

          {/* Backlogs warning */}
          {quickStats?.backlogs > 0 && (
            <div className="animate-fade-up" style={{
              padding: '1rem', borderRadius: 14,
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
            }}>
              <AlertTriangle size={16} style={{ color: '#f87171', flexShrink: 0, marginTop: 1 }} />
              <div>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f87171' }}>Active Backlogs</p>
                <p style={{ fontSize: '0.75rem', color: '#fca5a5', marginTop: 2 }}>{quickStats.backlogs} subject(s) pending clearance</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
