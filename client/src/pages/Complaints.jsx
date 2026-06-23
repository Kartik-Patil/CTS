import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { MessageSquareWarning, Plus, X, Clock, CheckCircle, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const statusBadge = { submitted: 'badge-info', under_review: 'badge-warning', assigned: 'badge-purple', resolved: 'badge-success', closed: 'badge-success' };
const statusLabel = { submitted: 'Submitted', under_review: 'Under Review', assigned: 'Assigned', resolved: 'Resolved', closed: 'Closed' };
const categoryColor = { academic: '#6366f1', hostel: '#10b981', technical: '#0ea5e9', administrative: '#f59e0b', infrastructure: '#8b5cf6' };

const Complaints = () => {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: 'academic', subject: '', description: '' });

  const { data: complaints = [], isLoading } = useQuery({
    queryKey: ['complaints'],
    queryFn: () => api.get('/students/complaints').then((r) => r.data.data),
  });

  const mutation = useMutation({
    mutationFn: (body) => api.post('/students/complaints', body),
    onSuccess: () => {
      toast.success('Complaint submitted!');
      qc.invalidateQueries({ queryKey: ['complaints'] });
      setShowForm(false);
      setForm({ category: 'academic', subject: '', description: '' });
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to submit'),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Complaints & Support</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Raise and track your support tickets</p>
        </div>
        <button id="raise-complaint-btn" onClick={() => setShowForm(true)} className="btn-primary">
          <Plus size={16} /> Raise Complaint
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="glass p-6 w-full max-w-lg animate-fade-up">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>New Complaint</h3>
              <button onClick={() => setShowForm(false)} style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(form); }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                  <option value="academic">Academic</option>
                  <option value="hostel">Hostel</option>
                  <option value="technical">Technical</option>
                  <option value="administrative">Administrative</option>
                  <option value="infrastructure">Infrastructure</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Subject</label>
                <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input-field" placeholder="Brief subject of the complaint" required />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={4} placeholder="Describe your issue in detail..." required style={{ resize: 'vertical' }} />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1 justify-center" disabled={mutation.isPending}>
                  {mutation.isPending ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</> : 'Submit Complaint'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complaints list */}
      {isLoading ? (
        <div className="flex items-center justify-center h-40"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : complaints.length === 0 ? (
        <div className="glass p-10 text-center">
          <MessageSquareWarning size={40} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <p style={{ color: 'var(--text-muted)' }}>No complaints raised yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {complaints.map((c) => (
            <div key={c._id} className="glass p-5 animate-fade-up" style={{ borderLeft: `3px solid ${categoryColor[c.category] || '#6366f1'}` }}>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{c.ticketId}</span>
                    <span className="badge badge-purple capitalize">{c.category}</span>
                    <span className={`badge ${statusBadge[c.status]}`}>{statusLabel[c.status]}</span>
                  </div>
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{c.subject}</p>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{c.description}</p>
                  {c.status === 'resolved' && c.feedback?.rating === null && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Rate resolution:</span>
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} size={16} style={{ color: '#f59e0b', cursor: 'pointer' }} />
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                  {new Date(c.createdAt).toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Complaints;
