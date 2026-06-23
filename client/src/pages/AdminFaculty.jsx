import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { UserPlus, ShieldAlert, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminFaculty = () => {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '', name: '', department: 'Computer Science & Engineering',
    designation: 'Assistant Professor', email: '', mobile: ''
  });

  const { data, isLoading } = useQuery({
    queryKey: ['adminFaculty'],
    queryFn: () => api.get('/admin/faculty').then(r => r.data.data)
  });

  const createFacultyMutation = useMutation({
    mutationFn: (newFaculty) => api.post('/admin/faculty', newFaculty),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminFaculty']);
      queryClient.invalidateQueries(['adminSummary']);
      toast.success('Faculty registered successfully!');
      setShowAddForm(false);
      setFormData({
        employeeId: '', name: '', department: 'Computer Science & Engineering',
        designation: 'Assistant Professor', email: '', mobile: ''
      });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to register faculty');
    }
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    createFacultyMutation.mutate(formData);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Faculty Directory 👨‍🏫</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>View and assign faculty roles.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddForm(true)}>
          <UserPlus size={16} />
          <span>Add New Faculty</span>
        </button>
      </div>

      {/* Faculty list */}
      <div className="glass" style={{ overflowX: 'auto' }}>
        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
            <div style={{ width: 30, height: 30, border: '2px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%' }} className="animate-spin" />
          </div>
        ) : data?.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '1rem 1.5rem' }}>Faculty Name</th>
                <th style={{ padding: '1rem 1.5rem' }}>Employee ID</th>
                <th style={{ padding: '1rem 1.5rem' }}>Department & Designation</th>
                <th style={{ padding: '1rem 1.5rem' }}>Contact Info</th>
              </tr>
            </thead>
            <tbody>
              {data.map(f => (
                <tr key={f._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.875rem' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>{f.name}</td>
                  <td style={{ padding: '1rem 1.5rem' }}><span className="badge badge-purple">{f.employeeId}</span></td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ color: 'var(--text-secondary)' }}>{f.department}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{f.designation}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ color: 'var(--text-secondary)' }}>{f.email}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{f.mobile}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            <ShieldAlert size={36} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)' }} />
            <p>No faculty members registered.</p>
          </div>
        )}
      </div>

      {/* Add faculty overlay */}
      {showAddForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="glass p-6 animate-fade-up" style={{ width: '90%', maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>Register New Faculty</h2>
              <button onClick={() => setShowAddForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="sidebar-section-label" style={{ padding: 0, marginBottom: '0.3rem' }}>Employee ID / Code</label>
                <input type="text" required value={formData.employeeId} onChange={(e) => setFormData({ ...formData, employeeId: e.target.value.toUpperCase() })} className="input-field" placeholder="e.g. FAC002" />
              </div>
              <div>
                <label className="sidebar-section-label" style={{ padding: 0, marginBottom: '0.3rem' }}>Full Name</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" placeholder="e.g. Dr. Ramesh Rao" />
              </div>
              <div className="form-grid-2">
                <div>
                  <label className="sidebar-section-label" style={{ padding: 0, marginBottom: '0.3rem' }}>Department</label>
                  <select required value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="input-field">
                    <option value="Computer Science & Engineering">CSE</option>
                    <option value="Information Science & Engineering">ISE</option>
                    <option value="Electronics & Communication">ECE</option>
                  </select>
                </div>
                <div>
                  <label className="sidebar-section-label" style={{ padding: 0, marginBottom: '0.3rem' }}>Designation</label>
                  <input type="text" required value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} className="input-field" placeholder="Associate Professor" />
                </div>
              </div>
              <div>
                <label className="sidebar-section-label" style={{ padding: 0, marginBottom: '0.3rem' }}>Email Address</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field" placeholder="ramesh@college.edu" />
              </div>
              <div>
                <label className="sidebar-section-label" style={{ padding: 0, marginBottom: '0.3rem' }}>Mobile Number</label>
                <input type="tel" required value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} className="input-field" placeholder="9876543219" />
              </div>

              <button type="submit" disabled={createFacultyMutation.isLoading} className="btn-primary w-full justify-center" style={{ marginTop: '1rem' }}>
                {createFacultyMutation.isLoading ? 'Registering...' : 'Register Faculty'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFaculty;
