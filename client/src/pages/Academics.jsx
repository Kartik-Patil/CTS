import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, BookOpen, Award, AlertTriangle } from 'lucide-react';

const gradeColor = { 'A+': '#10b981', 'A': '#34d399', 'B+': '#38bdf8', 'B': '#60a5fa', 'C': '#f59e0b', 'D': '#f97316', 'F': '#ef4444' };

const Academics = () => {
  const { data: marks, isLoading: ml } = useQuery({
    queryKey: ['marks'],
    queryFn: () => api.get('/students/marks').then(r => r.data.data),
  });
  const { data: history, isLoading: hl } = useQuery({
    queryKey: ['marks-history'],
    queryFn: () => api.get('/students/marks/history').then(r => r.data.data),
  });

  if (ml || hl) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
      <div style={{ width: 36, height: 36, border: '3px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%' }} className="animate-spin" />
    </div>
  );

  const chartData = history?.map(h => ({ sem: `Sem ${h.semester}`, sgpa: h.sgpa, cgpa: h.cgpa })) || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

      {/* Header */}
      <div className="animate-fade-up">
        <h1 className="page-title">Academic Performance</h1>
        <p className="page-sub">Semester {marks?.semester} · {marks?.academicYear}</p>
      </div>

      {/* Summary stats */}
      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1.25rem' }}>
        {[
          { label: 'SGPA', value: marks?.sgpa?.toFixed(2) || '—', color: '#10b981', icon: TrendingUp },
          { label: 'CGPA', value: marks?.cgpa?.toFixed(2) || '—', color: '#6366f1', icon: Award },
          { label: 'Total Credits', value: marks?.totalCredits || 0, color: '#0ea5e9', icon: BookOpen },
          { label: 'Earned Credits', value: marks?.earnedCredits || 0, color: '#8b5cf6', icon: BookOpen },
          { label: 'Backlogs', value: marks?.backlogs || 0, color: marks?.backlogs > 0 ? '#ef4444' : '#10b981', icon: marks?.backlogs > 0 ? AlertTriangle : Award },
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

      {/* SGPA/CGPA Chart */}
      {chartData.length > 0 && (
        <div className="glass animate-fade-up" style={{ padding: '1.75rem 2rem' }}>
          <div className="section-header">
            <span className="section-title">
              <TrendingUp size={16} style={{ color: '#6366f1' }} />
              Academic Progress
            </span>
            <div style={{ display: 'flex', gap: '1.25rem' }}>
              {[{ color: '#6366f1', label: 'SGPA' }, { color: '#0ea5e9', label: 'CGPA' }].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <div style={{ width: 20, height: 2.5, background: color, borderRadius: 1 }} />
                  {label}
                </div>
              ))}
            </div>
          </div>
          <div style={{ height: 240, marginTop: '0.5rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="sem" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[5, 10]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#252538', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f1f5f9', fontSize: 13 }}
                  labelStyle={{ color: '#a5b4fc', fontWeight: 600, marginBottom: 4 }}
                />
                <ReferenceLine y={7} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: '7.0 min', fill: '#f59e0b', fontSize: 10, position: 'right' }} />
                <Line type="monotone" dataKey="sgpa" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 5, strokeWidth: 0 }} activeDot={{ r: 7 }} name="SGPA" />
                <Line type="monotone" dataKey="cgpa" stroke="#0ea5e9" strokeWidth={2.5} dot={{ fill: '#0ea5e9', r: 5, strokeWidth: 0 }} activeDot={{ r: 7 }} name="CGPA" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Marks Table */}
      {marks?.subjects?.length > 0 && (
        <div className="glass animate-fade-up" style={{ padding: '1.5rem 1.75rem' }}>
          <div className="section-header">
            <span className="section-title">Internal Assessment Marks</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th style={{ textAlign: 'center' }}>Credits</th>
                  <th style={{ textAlign: 'center' }}>IA‑1</th>
                  <th style={{ textAlign: 'center' }}>IA‑2</th>
                  <th style={{ textAlign: 'center' }}>IA‑3</th>
                  <th style={{ textAlign: 'center' }}>Internal</th>
                  <th style={{ textAlign: 'center' }}>Lab</th>
                  <th style={{ textAlign: 'center' }}>Grade</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {marks.subjects.map(s => (
                  <tr key={s.subjectCode}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span className="badge badge-purple" style={{ width: 'fit-content' }}>{s.subjectCode}</span>
                        <span style={{ fontSize: '0.825rem', fontWeight: 500, color: 'var(--text-primary)' }}>{s.subjectName}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{s.credits}</td>
                    <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{s.ia1 ?? '—'}</td>
                    <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{s.ia2 ?? '—'}</td>
                    <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{s.ia3 ?? '—'}</td>
                    <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text-primary)' }}>{s.totalInternal ?? '—'}</td>
                    <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{s.labMarks ?? '—'}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: gradeColor[s.grade] || 'var(--text-muted)' }}>{s.grade || '—'}</span>
                    </td>
                    <td>
                      {s.result === 'pass'    && <span className="badge badge-success">Pass</span>}
                      {s.result === 'fail'    && <span className="badge badge-danger">Fail</span>}
                      {s.result === 'pending' && <span className="badge badge-neutral">Pending</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Academics;
