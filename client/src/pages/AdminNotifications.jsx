import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Bell, Send, ShieldAlert, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const priorityBadge = { urgent: 'badge-danger', high: 'badge-warning', normal: 'badge-info', low: 'badge-neutral' };

const AdminNotifications = () => {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', body: '', type: 'announcement', priority: 'normal',
    targetAudience: 'all', department: 'Computer Science & Engineering', semester: 1
  });

  const { data, isLoading } = useQuery({
    queryKey: ['adminNotifications'],
    queryFn: () => api.get('/admin/notifications').then(r => r.data.data)
  });

  const createNoticeMutation = useMutation({
    mutationFn: (newNotice) => api.post('/admin/notifications', newNotice),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminNotifications']);
      toast.success('Notice published successfully!');
      setShowAddForm(false);
      setFormData({
        title: '', body: '', type: 'announcement', priority: 'normal',
        targetAudience: 'all', department: 'Computer Science & Engineering', semester: 1
      });
    },
    onError: () => {
      toast.error('Failed to publish notice.');
    }
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    createNoticeMutation.mutate(formData);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Notice Board Management 📢</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Broadcast announcements, circulars, and Department notifications.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddForm(true)}>
          <Plus size={16} />
          <span>Publish New Notice</span>
        </button>
      </div>

      {/* Notices list */}
      <div className="glass p-6">
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>Active Notice Log</h2>

        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
            <div style={{ width: 30, height: 30, border: '2px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%' }} className="animate-spin" />
          </div>
        ) : data?.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.map(n => (
              <div key={n._id} className={`glass-light notif-${n.type}`} style={{ padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{n.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0.3rem 0' }}>{n.body}</p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                      <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>Audience: {n.targetAudience.toUpperCase()}</span>
                      {n.targetAudience === 'department' && <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>Dept: {n.department}</span>}
                      {n.targetAudience === 'semester' && <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>Sem: {n.semester}</span>}
                      <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>Author: {n.createdBy?.username || 'Admin'}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', flexShrink: 0 }}>
                    <span className={`badge ${priorityBadge[n.priority] || 'badge-info'}`}>{n.priority}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            <ShieldAlert size={36} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)' }} />
            <p>No notices have been published.</p>
          </div>
        )}
      </div>

      {/* Add notice overlay */}
      {showAddForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="glass p-6 animate-fade-up" style={{ width: '90%', maxWidth: '550px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>Publish New Notice</h2>
              <button onClick={() => setShowAddForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="sidebar-section-label" style={{ padding: 0, marginBottom: '0.3rem' }}>Notice Title</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input-field" placeholder="e.g. Sports Day Holiday Announcement" />
              </div>
              <div>
                <label className="sidebar-section-label" style={{ padding: 0, marginBottom: '0.3rem' }}>Notice Content / Message</label>
                <textarea required value={formData.body} onChange={(e) => setFormData({ ...formData, body: e.target.value })} className="input-field" style={{ minHeight: '100px', resize: 'vertical' }} placeholder="Provide detailed notice details here..." />
              </div>
              <div className="form-grid-2">
                <div>
                  <label className="sidebar-section-label" style={{ padding: 0, marginBottom: '0.3rem' }}>Notice Category</label>
                  <select required value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="input-field">
                    <option value="announcement">Announcement</option>
                    <option value="circular">Circular</option>
                    <option value="ptm">PTM Notice</option>
                    <option value="department">Department</option>
                  </select>
                </div>
                <div>
                  <label className="sidebar-section-label" style={{ padding: 0, marginBottom: '0.3rem' }}>Priority Level</label>
                  <select required value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="input-field">
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="sidebar-section-label" style={{ padding: 0, marginBottom: '0.3rem' }}>Target Audience</label>
                <select required value={formData.targetAudience} onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })} className="input-field">
                  <option value="all">Everyone (All Students & Parents)</option>
                  <option value="department">Department Specific</option>
                  <option value="semester">Semester Specific</option>
                </select>
              </div>

              {formData.targetAudience === 'department' && (
                <div>
                  <label className="sidebar-section-label" style={{ padding: 0, marginBottom: '0.3rem' }}>Target Department</label>
                  <select required value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="input-field">
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Information Science & Engineering">Information Science & Engineering</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                  </select>
                </div>
              )}

              {formData.targetAudience === 'semester' && (
                <div>
                  <label className="sidebar-section-label" style={{ padding: 0, marginBottom: '0.3rem' }}>Target Semester</label>
                  <select required value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })} className="input-field">
                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                </div>
              )}

              <button type="submit" disabled={createNoticeMutation.isLoading} className="btn-primary w-full justify-center" style={{ marginTop: '1rem' }}>
                <Send size={16} />
                <span>{createNoticeMutation.isLoading ? 'Publishing...' : 'Publish Notification'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
