import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Download, AlertTriangle, CheckCircle, TrendingDown } from 'lucide-react';

const Attendance = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['attendance'],
    queryFn: () => api.get('/students/attendance').then(r => r.data.data),
  });

  const handleDownloadPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Attendance Report', 14, 20);
    doc.setFontSize(10);
    doc.text(`Semester: ${data?.semester}  |  Academic Year: ${data?.academicYear}  |  Overall: ${data?.overallPercentage}%`, 14, 30);
    autoTable(doc, {
      startY: 38,
      head: [['Code', 'Subject', 'Conducted', 'Attended', 'Percentage']],
      body: data?.subjects?.map(s => [s.subjectCode, s.subjectName, s.totalClasses, s.attendedClasses, `${s.percentage}%`]) || [],
      styles: { fontSize: 9 },
      headStyles: { fillColor: [99, 102, 241] },
    });
    doc.save(`Attendance_Sem${data?.semester}_${data?.academicYear}.pdf`);
  };

  if (isLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
      <div style={{ width: 36, height: 36, border: '3px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%' }} className="animate-spin" />
    </div>
  );

  if (!data) return (
    <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
      <AlertTriangle size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
      <p style={{ color: 'var(--text-muted)' }}>No attendance data available for this semester.</p>
    </div>
  );

  const belowThreshold = data.subjects?.filter(s => s.percentage < 75) || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

      {/* Header */}
      <div className="animate-fade-up" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 className="page-title">Attendance</h1>
          <p className="page-sub">Semester {data.semester} · {data.academicYear}</p>
        </div>
        <button onClick={handleDownloadPDF} className="btn-secondary" id="download-attendance-pdf">
          <Download size={15} /> Download PDF
        </button>
      </div>

      {/* Overall card */}
      <div className="glass animate-fade-up" style={{ padding: '1.75rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>Overall Attendance</p>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Across {data.subjects?.length || 0} subjects
            </p>
          </div>
          <span style={{
            fontSize: '2.5rem', fontWeight: 800,
            color: data.overallPercentage >= 75 ? '#10b981' : data.overallPercentage >= 65 ? '#f59e0b' : '#ef4444',
          }}>
            {data.overallPercentage}%
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ position: 'relative' }}>
          <div className="attendance-bar" style={{ height: 12 }}>
            <div
              className={`attendance-fill ${data.overallPercentage >= 75 ? 'good' : data.overallPercentage >= 65 ? 'ok' : 'low'}`}
              style={{ width: `${data.overallPercentage}%` }}
            />
          </div>
          {/* 75% marker */}
          <div style={{ position: 'absolute', left: '75%', top: '-6px', transform: 'translateX(-50%)' }}>
            <div style={{ width: 2, height: 24, background: '#f59e0b', borderRadius: 1 }} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>0%</span>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#f59e0b', marginLeft: '0%' }}>75% required</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>100%</span>
        </div>

        {/* Warning */}
        {belowThreshold.length > 0 && (
          <div style={{
            marginTop: '1.25rem', padding: '0.875rem 1rem', borderRadius: 12,
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
            display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
          }}>
            <TrendingDown size={16} style={{ color: '#f87171', flexShrink: 0, marginTop: 1 }} />
            <div>
              <p style={{ fontSize: '0.825rem', fontWeight: 600, color: '#f87171' }}>Shortage Warning</p>
              <p style={{ fontSize: '0.78rem', color: '#fca5a5', marginTop: 2 }}>
                {belowThreshold.map(s => s.subjectCode).join(', ')} — attendance below 75%. Contact your mentor immediately.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="glass animate-fade-up" style={{ padding: '1.5rem 1.75rem' }}>
        <div className="section-header">
          <span className="section-title">Subject-wise Breakdown</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Subject Name</th>
                <th style={{ textAlign: 'center' }}>Conducted</th>
                <th style={{ textAlign: 'center' }}>Attended</th>
                <th>Status</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {data.subjects?.map(s => {
                const color = s.percentage >= 75 ? '#10b981' : s.percentage >= 65 ? '#f59e0b' : '#ef4444';
                const cls   = s.percentage >= 75 ? 'good' : s.percentage >= 65 ? 'ok' : 'low';
                return (
                  <tr key={s.subjectCode}>
                    <td><span className="badge badge-purple">{s.subjectCode}</span></td>
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{s.subjectName}</td>
                    <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{s.totalClasses}</td>
                    <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{s.attendedClasses}</td>
                    <td>
                      {s.percentage >= 75
                        ? <span className="badge badge-success"><CheckCircle size={10} />Good</span>
                        : s.percentage >= 65
                        ? <span className="badge badge-warning"><AlertTriangle size={10} />At Risk</span>
                        : <span className="badge badge-danger"><AlertTriangle size={10} />Shortage</span>}
                    </td>
                    <td style={{ minWidth: 180 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="attendance-bar" style={{ flex: 1, height: 6 }}>
                          <div className={`attendance-fill ${cls}`} style={{ width: `${s.percentage}%` }} />
                        </div>
                        <span style={{ fontSize: '0.825rem', fontWeight: 700, width: 36, textAlign: 'right', color, flexShrink: 0 }}>
                          {s.percentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
