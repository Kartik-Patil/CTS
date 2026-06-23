import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

const mockStudents = [
  { id: '1', rollNumber: '01FE22BCS001', name: 'Rajan Kumar' },
  { id: '2', rollNumber: '01FE22BCS045', name: 'Ananya Reddy' },
];

const FacultyMarks = () => {
  const { profile } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState(profile?.subjects?.[0] || '');
  const [selectedIa, setSelectedIa] = useState('ia1');
  const [marks, setMarks] = useState({
    '1': '28',
    '2': '29'
  });

  const handleMarkChange = (id, val) => {
    setMarks(prev => ({ ...prev, [id]: val }));
  };

  const handleSave = () => {
    toast.success('Internal Marks updated successfully!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Enter Internal Marks 📊</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Record Internal Assessment (IA) grades.</p>
      </div>

      <div className="glass p-4" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <label className="sidebar-section-label" style={{ padding: 0 }}>Course:</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="input-field" style={{ width: '220px' }}
          >
            {profile?.subjects?.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <label className="sidebar-section-label" style={{ padding: 0 }}>Test Category:</label>
          <select
            value={selectedIa}
            onChange={(e) => setSelectedIa(e.target.value)}
            className="input-field" style={{ width: '180px' }}
          >
            <option value="ia1">Internal Assessment 1 (IA-1)</option>
            <option value="ia2">Internal Assessment 2 (IA-2)</option>
            <option value="ia3">Internal Assessment 3 (IA-3)</option>
          </select>
        </div>
      </div>

      <div className="glass" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '1rem 1.5rem' }}>Roll Number</th>
              <th style={{ padding: '1rem 1.5rem' }}>Student Name</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>Score (Max: 30)</th>
            </tr>
          </thead>
          <tbody>
            {mockStudents.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.875rem' }}>
                <td style={{ padding: '1rem 1.5rem' }}><span className="badge badge-neutral">{s.rollNumber}</span></td>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</td>
                <td style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={marks[s.id]}
                    onChange={(e) => handleMarkChange(s.id, e.target.value)}
                    className="input-field"
                    style={{ width: '80px', textAlign: 'center' }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-primary" onClick={handleSave}>
            <Save size={16} />
            <span>Save Marks Log</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacultyMarks;
