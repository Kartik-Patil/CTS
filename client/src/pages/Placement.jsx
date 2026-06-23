import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import {
  Briefcase, Building, Calendar, MapPin, Trophy, Clock,
  CheckCircle, XCircle, AlertCircle, ChevronRight, Star,
} from 'lucide-react';

const statusConfig = {
  shortlisted:          { label: 'Shortlisted',           badge: 'badge-info',    icon: AlertCircle },
  interview_scheduled:  { label: 'Interview Scheduled',   badge: 'badge-warning', icon: Calendar },
  selected:             { label: 'Selected ✓',             badge: 'badge-success', icon: CheckCircle },
  rejected:             { label: 'Not Selected',           badge: 'badge-danger',  icon: XCircle },
  offer_released:       { label: 'Offer Released',         badge: 'badge-success', icon: Trophy },
  withdrawn:            { label: 'Withdrawn',              badge: 'badge-neutral', icon: XCircle },
};

const typeColor = { placement: '#6366f1', internship: '#10b981' };

const steps = [
  { key: 'shortlisted',         label: 'Shortlisted' },
  { key: 'interview_scheduled', label: 'Interview' },
  { key: 'selected',            label: 'Selected' },
  { key: 'offer_released',      label: 'Offer' },
];
const stepIndex = (status) => steps.findIndex(s => s.key === status);

const PlacementCard = ({ p }) => {
  const cfg = statusConfig[p.applicationStatus] || statusConfig.shortlisted;
  const Icon = cfg.icon;
  const color = typeColor[p.type] || '#6366f1';
  const si = stepIndex(p.applicationStatus);
  const isActive = !['rejected', 'withdrawn'].includes(p.applicationStatus);

  return (
    <div className="glass animate-fade-up" style={{ overflow: 'hidden', borderTop: `3px solid ${color}` }}>
      <div style={{ padding: '1.375rem 1.5rem' }}>
        {/* Company header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12, flexShrink: 0,
              background: `${color}18`, border: `1px solid ${color}28`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '1.125rem', color,
            }}>
              {p.company[0]}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{p.company}</h3>
                <span className={`badge ${p.type === 'internship' ? 'badge-success' : 'badge-purple'}`} style={{ textTransform: 'capitalize' }}>
                  {p.type}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{p.role}</p>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <span className={`badge ${cfg.badge}`}><Icon size={10} />{cfg.label}</span>
            {p.package && (
              <p style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981', marginTop: '0.375rem' }}>{p.package}</p>
            )}
          </div>
        </div>

        {/* Timeline stepper (only for non-rejected) */}
        {isActive && (
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.25rem' }}>
            {steps.map((step, i) => {
              const done = si >= i;
              const active = si === i;
              return (
                <div key={step.key} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: done ? color : 'var(--surface-3)',
                      border: `2px solid ${done ? color : 'rgba(255,255,255,0.1)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: active ? `0 0 12px ${color}60` : 'none',
                      transition: 'all 0.3s ease',
                    }}>
                      {done && <CheckCircle size={14} color="white" />}
                    </div>
                    <p style={{ fontSize: '0.62rem', fontWeight: 600, color: done ? color : 'var(--text-muted)', whiteSpace: 'nowrap' }}>{step.label}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <div style={{ flex: 1, height: 2, margin: '0 0.25rem', marginBottom: 16, background: si > i ? color : 'rgba(255,255,255,0.08)', borderRadius: 1, transition: 'background 0.3s ease' }} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Interview / joining info */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem 1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          {p.interviewDate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <Calendar size={13} />{new Date(p.interviewDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          )}
          {p.interviewVenue && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <MapPin size={13} />{p.interviewVenue}
            </div>
          )}
          {p.interviewRound && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <ChevronRight size={13} />{p.interviewRound}
            </div>
          )}
          {p.joiningDate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', color: '#10b981' }}>
              <Trophy size={13} />Joining: {new Date(p.joiningDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          )}
        </div>

        {p.notes && (
          <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', paddingTop: '0.625rem', borderTop: '1px solid var(--border)' }}>
            💬 {p.notes}
          </p>
        )}
      </div>
    </div>
  );
};

const Placement = () => {
  const [filter, setFilter] = useState('all');

  const { data: placements = [], isLoading } = useQuery({
    queryKey: ['placement'],
    queryFn: () => api.get('/students/placement').then(r => r.data.data),
  });

  const filtered = filter === 'all' ? placements : placements.filter(p =>
    filter === 'active' ? !['rejected', 'withdrawn'].includes(p.applicationStatus)
    : filter === 'selected' ? p.applicationStatus === 'selected' || p.applicationStatus === 'offer_released'
    : p.type === filter
  );

  const selected = placements.find(p => p.applicationStatus === 'selected' || p.applicationStatus === 'offer_released');

  if (isLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
      <div style={{ width: 36, height: 36, border: '3px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%' }} className="animate-spin" />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div className="animate-fade-up">
        <h1 className="page-title">Placement & Internship</h1>
        <p className="page-sub">Track your applications, interviews and offers</p>
      </div>

      {/* Placed banner */}
      {selected && (
        <div className="animate-fade-up" style={{
          padding: '1.375rem 1.75rem', borderRadius: 20,
          background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(14,165,233,0.1))',
          border: '1px solid rgba(16,185,129,0.3)',
          display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
        }}>
          <Trophy size={28} style={{ color: '#10b981', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: '1rem', color: '#10b981' }}>🎉 Congratulations! Placed at {selected.company}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {selected.role} · {selected.package}
              {selected.joiningDate && ` · Joining ${new Date(selected.joiningDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`}
            </p>
          </div>
        </div>
      )}

      {/* Summary stats */}
      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Total Applied', value: placements.length, color: '#6366f1' },
          { label: 'Interview Calls', value: placements.filter(p => p.interviewDate).length, color: '#f59e0b' },
          { label: 'Selected', value: placements.filter(p => ['selected', 'offer_released'].includes(p.applicationStatus)).length, color: '#10b981' },
          { label: 'Internships', value: placements.filter(p => p.type === 'internship').length, color: '#0ea5e9' },
        ].map(({ label, value, color }) => (
          <div key={label} className="stat-card animate-fade-up">
            <div className="stat-card-value" style={{ color, fontSize: '2.25rem' }}>{value}</div>
            <div className="stat-card-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }} className="animate-fade-up">
        {[
          { key: 'all', label: 'All' },
          { key: 'active', label: 'Active' },
          { key: 'placement', label: 'Placements' },
          { key: 'internship', label: 'Internships' },
          { key: 'selected', label: 'Selected' },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)}
            className={filter === key ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '0.375rem 1rem', fontSize: '0.8rem' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="glass" style={{ padding: '4rem', textAlign: 'center' }}>
          <Briefcase size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>No applications in this category.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(p => <PlacementCard key={p._id} p={p} />)}
        </div>
      )}
    </div>
  );
};

export default Placement;
