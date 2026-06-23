import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Users, UserCheck, Activity, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ label, value, color, icon: Icon, to }) => {
  const navigate = useNavigate();
  return (
    <div className="stat-card animate-fade-up" onClick={() => to && navigate(to)}
      style={{ cursor: to ? 'pointer' : 'default', minHeight: '140px' }}>
      <div className="stat-card-icon" style={{ background: `${color}18`, border: `1px solid ${color}28` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div className="stat-card-value" style={{ color, fontSize: '2rem' }}>{value}</div>
      <div className="stat-card-label" style={{ marginTop: '0.5rem' }}>{label}</div>
    </div>
  );
};

const AdminDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['adminSummary'],
    queryFn: () => api.get('/admin/analytics/summary').then(r => r.data.data),
  });

  if (isLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%' }} className="animate-spin" />
    </div>
  );

  if (error) return (
    <div className="glass p-6 text-center animate-fade-in" style={{ borderColor: 'rgba(239,68,68,0.2)' }}>
      <AlertTriangle size={32} style={{ color: '#ef4444', margin: '0 auto 0.75rem' }} />
      <p style={{ color: '#f87171' }}>Failed to load admin analytics.</p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="animate-fade-up">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Admin Dashboard 🛠️
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
          System-wide summary of college operations and status metrics.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <StatCard
          label="Total Enrolled Students"
          value={data?.totalStudents || 0}
          color="#6366f1"
          icon={Users}
          to="/admin/students"
        />
        <StatCard
          label="Active Faculty Members"
          value={data?.totalFaculty || 0}
          color="#0ea5e9"
          icon={UserCheck}
          to="/admin/faculty"
        />
        <StatCard
          label="System Average Attendance"
          value={`${data?.avgAttendance || 0}%`}
          color="#10b981"
          icon={Activity}
        />
        <StatCard
          label="Students At-Risk (<75%)"
          value={data?.atRiskStudents || 0}
          color={data?.atRiskStudents > 0 ? '#ef4444' : '#64748b'}
          icon={AlertTriangle}
          to="/admin/students"
        />
      </div>

      <div className="glass p-6 animate-fade-up" style={{ minHeight: '180px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          System Access Controls
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          Welcome to the administrative control center. You have permission to manage student admissions, assign faculty parameters, review portal attendance logs, publish notifications, and inspect dashboard logs. Use the sidebar navigation menu to access management panels.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
