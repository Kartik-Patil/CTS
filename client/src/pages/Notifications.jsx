import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Bell, AlertTriangle, Info, Calendar, Megaphone, BookOpen, User, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const typeIcon   = { announcement: Megaphone, emergency: AlertTriangle, ptm: Calendar, circular: BookOpen, department: Info, mentor: User };
const typeColor  = { announcement: '#6366f1', emergency: '#ef4444', ptm: '#10b981', circular: '#0ea5e9', department: '#f59e0b', mentor: '#8b5cf6' };
const typeLabel  = { announcement: 'Announcement', emergency: 'Emergency', ptm: 'PTM', circular: 'Circular', department: 'Department', mentor: 'Mentor' };
const priorityBadge = { urgent: 'badge-danger', high: 'badge-warning', normal: 'badge-info', low: 'badge-purple' };

const NotifCard = ({ n }) => {
  const [expanded, setExpanded] = useState(false);
  const Icon = typeIcon[n.type] || Info;
  const color = typeColor[n.type] || '#6366f1';

  return (
    <div className={`glass p-4 notif-${n.type} cursor-pointer transition-all`} onClick={() => setExpanded(!expanded)}>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
          <Icon size={16} style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold" style={{ color }}>{typeLabel[n.type]}</span>
            <span className={`badge ${priorityBadge[n.priority] || 'badge-info'}`}>{n.priority}</span>
            <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>
              {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <p className="font-semibold text-sm mt-1" style={{ color: 'var(--text-primary)' }}>{n.title}</p>
          {expanded && (
            <p className="text-sm mt-2 leading-relaxed animate-fade-in" style={{ color: 'var(--text-secondary)' }}>
              {n.body}
            </p>
          )}
        </div>
        <ChevronDown size={15} className="flex-shrink-0 transition-transform mt-1" style={{ color: 'var(--text-muted)', transform: expanded ? 'rotate(180deg)' : 'none' }} />
      </div>
    </div>
  );
};

const Notifications = () => {
  const [filter, setFilter] = useState('all');

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get('/students/notifications').then((r) => r.data.data),
  });

  const filtered = filter === 'all' ? notifications : notifications.filter((n) => n.type === filter);

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'emergency', label: 'Emergency' },
    { key: 'announcement', label: 'Announcements' },
    { key: 'ptm', label: 'PTM' },
    { key: 'circular', label: 'Circulars' },
    { key: 'department', label: 'Department' },
  ];

  return (
    <div className="space-y-5">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Notifications</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{notifications.length} total notifications</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap animate-fade-up">
        {filters.map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${filter === key ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.375rem 1rem' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      {isLoading ? (
        <div className="flex items-center justify-center h-40"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="glass p-10 text-center">
          <Bell size={40} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <p style={{ color: 'var(--text-muted)' }}>No notifications for this category.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => <NotifCard key={n._id} n={n} />)}
        </div>
      )}
    </div>
  );
};

export default Notifications;
