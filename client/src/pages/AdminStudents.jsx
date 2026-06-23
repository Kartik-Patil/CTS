import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Search, UserPlus, Trash2, ShieldAlert, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminStudents = () => {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ department: '', semester: '', section: '' });
  const [formData, setFormData] = useState({
    rollNumber: '', name: '', dateOfBirth: '', branch: '', department: '',
    semester: 1, section: 'A', academicYear: '2024-25', admissionYear: 2024, batch: '2024-2028',
    parentName: '', parentMobile: '', parentEmail: '', parentAddress: ''
  });

  const { data, isLoading } = useQuery({
    queryKey: ['adminStudents', filters, search],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters.department) params.append('department', filters.department);
      if (filters.semester) params.append('semester', filters.semester);
      if (filters.section) params.append('section', filters.section);
      if (search) params.append('search', search);
      return api.get(`/admin/students?${params.toString()}`).then(r => r.data.data);
    }
  });

  const createStudentMutation = useMutation({
    mutationFn: (newStudent) => api.post('/admin/students', newStudent),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminStudents']);
      queryClient.invalidateQueries(['adminSummary']);
      toast.success('Student registered successfully!');
      setShowAddForm(false);
      setFormData({
        rollNumber: '', name: '', dateOfBirth: '', branch: '', department: '',
        semester: 1, section: 'A', academicYear: '2024-25', admissionYear: 2024, batch: '2024-2028',
        parentName: '', parentMobile: '', parentEmail: '', parentAddress: ''
      });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to register student');
    }
  });

  const deleteStudentMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/students/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminStudents']);
      queryClient.invalidateQueries(['adminSummary']);
      toast.success('Student account deactivated.');
    },
    onError: () => {
      toast.error('Failed to deactivate student.');
    }
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      parent: {
        fatherName: formData.parentName,
        mobile: formData.parentMobile,
        email: formData.parentEmail,
        address: formData.parentAddress
      }
    };
    createStudentMutation.mutate(payload);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Student Profiles 🎓</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Register and manage student profiles.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddForm(true)}>
          <UserPlus size={16} />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="glass p-4" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by student name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={filters.department}
          onChange={(e) => setFilters({ ...filters, department: e.target.value })}
          className="input-field" style={{ width: '180px' }}
        >
          <option value="">All Departments</option>
          <option value="Computer Science & Engineering">CSE</option>
          <option value="Information Science & Engineering">ISE</option>
          <option value="Electronics & Communication">ECE</option>
        </select>
        <select
          value={filters.semester}
          onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
          className="input-field" style={{ width: '120px' }}
        >
          <option value="">All Semesters</option>
          {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
        </select>
      </div>

      {/* Students list */}
      <div className="glass" style={{ overflowX: 'auto' }}>
        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
            <div style={{ width: 30, height: 30, border: '2px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%' }} className="animate-spin" />
          </div>
        ) : data?.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '1rem 1.5rem' }}>Student Detail</th>
                <th style={{ padding: '1rem 1.5rem' }}>Roll Number</th>
                <th style={{ padding: '1rem 1.5rem' }}>Department & Semester</th>
                <th style={{ padding: '1rem 1.5rem' }}>Parent Detail</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(s => (
                <tr key={s._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.875rem' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</td>
                  <td style={{ padding: '1rem 1.5rem' }}><span className="badge badge-purple">{s.rollNumber}</span></td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ color: 'var(--text-secondary)' }}>{s.department}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Semester {s.semester} · Sec {s.section}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ color: 'var(--text-secondary)' }}>{s.parent?.fatherName || '—'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.parent?.mobile || '—'}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                    <button
                      onClick={() => { if(confirm(`Are you sure you want to deactivate ${s.name}?`)) deleteStudentMutation.mutate(s._id); }}
                      style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '0.5rem' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            <ShieldAlert size={36} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)' }} />
            <p>No students found matching filters.</p>
          </div>
        )}
      </div>

      {/* Add student overlay */}
      {showAddForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="glass p-6 animate-fade-up" style={{ width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>Register New Student</h2>
              <button onClick={() => setShowAddForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-grid-2">
                <div>
                  <label className="sidebar-section-label" style={{ padding: 0, marginBottom: '0.3rem' }}>Roll Number / USN</label>
                  <input type="text" required value={formData.rollNumber} onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value.toUpperCase() })} className="input-field" placeholder="e.g. 01FE22BCS001" />
                </div>
                <div>
                  <label className="sidebar-section-label" style={{ padding: 0, marginBottom: '0.3rem' }}>Full Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" placeholder="e.g. Rajan Kumar" />
                </div>
              </div>

              <div className="form-grid-2">
                <div>
                  <label className="sidebar-section-label" style={{ padding: 0, marginBottom: '0.3rem' }}>Date of Birth</label>
                  <input type="date" required value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="sidebar-section-label" style={{ padding: 0, marginBottom: '0.3rem' }}>Department</label>
                  <select required value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value, branch: `B.E. ${e.target.value.split(' ')[0]}` })} className="input-field">
                    <option value="">Select Dept</option>
                    <option value="Computer Science & Engineering">CSE</option>
                    <option value="Information Science & Engineering">ISE</option>
                    <option value="Electronics & Communication">ECE</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-3">
                <div>
                  <label className="sidebar-section-label" style={{ padding: 0, marginBottom: '0.3rem' }}>Semester</label>
                  <input type="number" min="1" max="8" required value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })} className="input-field" />
                </div>
                <div>
                  <label className="sidebar-section-label" style={{ padding: 0, marginBottom: '0.3rem' }}>Section</label>
                  <input type="text" maxLength="1" required value={formData.section} onChange={(e) => setFormData({ ...formData, section: e.target.value.toUpperCase() })} className="input-field" placeholder="A" />
                </div>
                <div>
                  <label className="sidebar-section-label" style={{ padding: 0, marginBottom: '0.3rem' }}>Admission Year</label>
                  <input type="number" required value={formData.admissionYear} onChange={(e) => setFormData({ ...formData, admissionYear: parseInt(e.target.value), batch: `${e.target.value}-${parseInt(e.target.value)+4}` })} className="input-field" />
                </div>
              </div>

              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#6366f1', marginTop: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.3rem' }}>Parent & Guardian Details</h3>

              <div className="form-grid-2">
                <div>
                  <label className="sidebar-section-label" style={{ padding: 0, marginBottom: '0.3rem' }}>Father Name</label>
                  <input type="text" required value={formData.parentName} onChange={(e) => setFormData({ ...formData, parentName: e.target.value })} className="input-field" placeholder="Suresh Kumar" />
                </div>
                <div>
                  <label className="sidebar-section-label" style={{ padding: 0, marginBottom: '0.3rem' }}>Mobile Number</label>
                  <input type="tel" required value={formData.parentMobile} onChange={(e) => setFormData({ ...formData, parentMobile: e.target.value })} className="input-field" placeholder="9876543211" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                <div>
                  <label className="sidebar-section-label" style={{ padding: 0, marginBottom: '0.3rem' }}>Email Address</label>
                  <input type="email" required value={formData.parentEmail} onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })} className="input-field" placeholder="parent@gmail.com" />
                </div>
                <div>
                  <label className="sidebar-section-label" style={{ padding: 0, marginBottom: '0.3rem' }}>Residential Address</label>
                  <input type="text" required value={formData.parentAddress} onChange={(e) => setFormData({ ...formData, parentAddress: e.target.value })} className="input-field" placeholder="123, MG Road, Bangalore" />
                </div>
              </div>

              <button type="submit" disabled={createStudentMutation.isLoading} className="btn-primary w-full justify-center" style={{ marginTop: '1rem' }}>
                {createStudentMutation.isLoading ? 'Registering...' : 'Register Student'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
