import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ClipboardList, Save, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

const mockStudents = [
  { id: '1', rollNumber: '01FE22BCS001', name: 'Rajan Kumar' },
  { id: '2', rollNumber: '01FE22BCS045', name: 'Ananya Reddy' },
];

const FacultyAttendance = () => {
  const { profile } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState(profile?.subjects?.[0] || '');
  const [attendance, setAttendance] = useState({
    '1': true,
    '2': true
  });

  const toggleAttendance = (id) => {
    setAttendance(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = () => {
    toast.success('Attendance records saved successfully!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Mark Attendance 📝</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Record daily student attendance sheets.</p>
      </div>

      <div className="glass p-4" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <label className="sidebar-section-label" style={{ padding: 0 }}>Select Course:</label>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="input-field" style={{ width: '220px' }}
        >
          {profile?.subjects?.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <span className="badge badge-purple">Semester 5 · Section A</span>
      </div>

      <div className="glass" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '1rem 1.5rem' }}>Roll Number</th>
              <th style={{ padding: '1rem 1.5rem' }}>Student Name</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {mockStudents.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.875rem' }}>
                <td style={{ padding: '1rem 1.5rem' }}><span className="badge badge-neutral">{s.rollNumber}</span></td>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</td>
                <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                  <button
                    onClick={() => toggleAttendance(s.id)}
                    className={attendance[s.id] ? 'badge badge-success' : 'badge badge-danger'}
                    style={{ border: 'none', cursor: 'pointer', padding: '0.4rem 0.8rem', fontSize: '0.75rem', minWidth: '80px' }}
                  >
                    {attendance[s.id] ? 'Present' : 'Absent'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-primary" onClick={handleSave}>
            <Save size={16} />
            <span>Save Attendance Sheet</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacultyAttendance;
