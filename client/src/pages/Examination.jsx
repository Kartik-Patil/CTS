import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import {
  FileText, Calendar, Clock, MapPin, Download,
  CheckCircle, AlertCircle, ChevronDown, ChevronUp, BookOpen,
} from 'lucide-react';

const examTypeLabel = { internal: 'Internal Examination', semester: 'Semester Examination', practical: 'Practical Examination', supplementary: 'Supplementary Examination' };
const examTypeColor = { internal: '#6366f1', semester: '#10b981', practical: '#0ea5e9', supplementary: '#f59e0b' };
const revalStatusBadge = { applied: 'badge-warning', under_review: 'badge-info', completed: 'badge-success' };

const ExamCard = ({ exam }) => {
  const [open, setOpen] = useState(false);
  const color = examTypeColor[exam.examType] || '#6366f1';
  const upcoming = exam.timetable.filter(t => new Date(t.date) >= new Date());
  const past = exam.timetable.filter(t => new Date(t.date) < new Date());

  return (
    <div className="glass animate-fade-up" style={{ overflow: 'hidden' }}>
      {/* Header */}
      <div
        style={{ padding: '1.25rem 1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: `4px solid ${color}` }}
        onClick={() => setOpen(!open)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}18`, border: `1px solid ${color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={18} style={{ color }} />
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{examTypeLabel[exam.examType]}</p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Semester {exam.semester} · {exam.academicYear} · {exam.timetable.length} paper{exam.timetable.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {exam.hallTicketIssued && (
            <span className="badge badge-success"><CheckCircle size={10} />Hall Ticket Issued</span>
          )}
          {open ? <ChevronUp size={16} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />}
        </div>
      </div>

      {/* Expanded timetable */}
      {open && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '0 1.5rem 1.5rem' }}>
          {upcoming.length > 0 && (
            <div style={{ marginTop: '1.25rem' }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: color, marginBottom: '0.75rem' }}>Upcoming</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {upcoming.map((t, i) => <TimetableRow key={i} t={t} upcoming />)}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div style={{ marginTop: '1.25rem' }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Completed</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {past.map((t, i) => <TimetableRow key={i} t={t} />)}
              </div>
            </div>
          )}

          {/* Revaluation */}
          {exam.revaluation?.length > 0 && (
            <div style={{ marginTop: '1.5rem', padding: '1rem 1.25rem', borderRadius: 12, background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Revaluation Applications
              </p>
              {exam.revaluation.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>{r.subjectCode}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {r.status === 'completed' && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {r.originalMarks} → <strong style={{ color: '#10b981' }}>{r.revisedMarks}</strong> marks
                      </span>
                    )}
                    <span className={`badge ${revalStatusBadge[r.status] || 'badge-neutral'}`}>{r.status.replace('_', ' ')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const TimetableRow = ({ t, upcoming }) => {
  const dateObj = new Date(t.date);
  const day = dateObj.toLocaleDateString('en-IN', { weekday: 'short' });
  const date = dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const daysLeft = Math.ceil((dateObj - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
      padding: '0.875rem 1rem', borderRadius: 12,
      background: upcoming ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.02)',
      border: `1px solid ${upcoming ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.05)'}`,
      opacity: upcoming ? 1 : 0.6,
    }}>
      {/* Date box */}
      <div style={{ textAlign: 'center', minWidth: 52, flexShrink: 0 }}>
        <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: upcoming ? '#a5b4fc' : 'var(--text-muted)' }}>{day}</p>
        <p style={{ fontSize: '1rem', fontWeight: 800, color: upcoming ? '#f1f5f9' : 'var(--text-muted)', lineHeight: 1 }}>{dateObj.getDate()}</p>
        <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{dateObj.toLocaleDateString('en-IN', { month: 'short' })}</p>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 36, background: 'var(--border)', flexShrink: 0 }} />

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {t.subjectName}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', marginTop: '0.25rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Clock size={11} />{t.time} · {t.duration}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <MapPin size={11} />{t.venue}
          </span>
        </div>
      </div>

      {/* Days left */}
      {upcoming && daysLeft > 0 && (
        <span className={`badge ${daysLeft <= 3 ? 'badge-danger' : daysLeft <= 7 ? 'badge-warning' : 'badge-info'}`} style={{ flexShrink: 0 }}>
          {daysLeft}d left
        </span>
      )}
      {!upcoming && <span className="badge badge-neutral" style={{ flexShrink: 0 }}>Done</span>}
    </div>
  );
};

const Examination = () => {
  const [activeTab, setActiveTab] = useState('all');

  const { data: exams = [], isLoading } = useQuery({
    queryKey: ['examination'],
    queryFn: () => api.get('/students/examination').then(r => r.data.data),
  });

  const tabs = ['all', 'internal', 'semester', 'practical', 'supplementary'];
  const filtered = activeTab === 'all' ? exams : exams.filter(e => e.examType === activeTab);

  if (isLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
      <div style={{ width: 36, height: 36, border: '3px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%' }} className="animate-spin" />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div className="animate-fade-up">
        <h1 className="page-title">Examination</h1>
        <p className="page-sub">Timetables, hall tickets and revaluation status</p>
      </div>

      {/* Summary stats */}
      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Total Exams', value: exams.length, color: '#6366f1', icon: FileText },
          { label: 'Hall Tickets', value: exams.filter(e => e.hallTicketIssued).length, color: '#10b981', icon: CheckCircle },
          { label: 'Upcoming Papers', value: exams.reduce((sum, e) => sum + e.timetable.filter(t => new Date(t.date) >= new Date()).length, 0), color: '#f59e0b', icon: Calendar },
          { label: 'Revaluations', value: exams.reduce((sum, e) => sum + (e.revaluation?.length || 0), 0), color: '#8b5cf6', icon: AlertCircle },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="stat-card animate-fade-up">
            <div className="stat-card-icon" style={{ background: `${color}18`, border: `1px solid ${color}28` }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div className="stat-card-value" style={{ color }}>{value}</div>
            <div className="stat-card-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }} className="animate-fade-up">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '0.375rem 1rem', textTransform: 'capitalize', fontSize: '0.8rem' }}>
            {tab === 'all' ? 'All Exams' : examTypeLabel[tab]?.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Exam cards */}
      {filtered.length === 0 ? (
        <div className="glass" style={{ padding: '4rem', textAlign: 'center' }}>
          <BookOpen size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>No examinations found for this filter.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(exam => <ExamCard key={exam._id} exam={exam} />)}
        </div>
      )}
    </div>
  );
};

export default Examination;
