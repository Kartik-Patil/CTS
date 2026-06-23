import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { CalendarClock, Plus, X, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const statusIcon = { pending: <Clock size={13} />, faculty_approved: <CheckCircle size={13} />, hod_approved: <CheckCircle size={13} />, rejected: <X size={13} />, cancelled: <X size={13} /> };
const statusBadge = { pending: 'badge-warning', faculty_approved: 'badge-info', hod_approved: 'badge-success', rejected: 'badge-danger', cancelled: 'badge-danger' };
const statusLabel = { pending: 'Pending', faculty_approved: 'Faculty Approved', hod_approved: 'Approved', rejected: 'Rejected', cancelled: 'Cancelled' };

const Leave = () => {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'leave', fromDate: '', toDate: '', reason: '' });

  const { data: leaves = [], isLoading } = useQuery({
    queryKey: ['leaves'],
    queryFn: () => api.get('/students/leaves').then((r) => r.data.data),
  });

  const mutation = useMutation({
    mutationFn: (body) => api.post('/students/leaves', body),
    onSuccess: () => {
      toast.success('Leave request submitted!');
      qc.invalidateQueries({ queryKey: ['leaves'] });
      setShowForm(false);
      setForm({ type: 'leave', fromDate: '', toDate: '', reason: '' });
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to submit'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Leave & Permission</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Manage your leave requests and permissions</p>
        </div>
        <button id="apply-leave-btn" onClick={() => setShowForm(true)} className="btn-primary">
          <Plus size={16} /> Apply Leave
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="glass p-6 w-full max-w-md animate-fade-up">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>New Leave Request</h3>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-lg" style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field">
                  <option value="leave">Leave</option>
                  <option value="outpass">Outpass (Hostel)</option>
                  <option value="late_arrival">Late Arrival</option>
                  <option value="event">Event Participation</option>
                  <option value="academic">Academic Activity</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>From Date</label>
                  <input type="date" value={form.fromDate} onChange={(e) => setForm({ ...form, fromDate: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>To Date</label>
                  <input type="date" value={form.toDate} onChange={(e) => setForm({ ...form, toDate: e.target.value })} className="input-field" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Reason</label>
                <textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="input-field" rows={3} placeholder="Describe your reason..." required style={{ resize: 'vertical' }} />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1 justify-center" disabled={mutation.isPending}>
                  {mutation.isPending ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</> : 'Submit Request'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leave history */}
      {isLoading ? (
        <div className="flex items-center justify-center h-40"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : leaves.length === 0 ? (
        <div className="glass p-10 text-center">
          <CalendarClock size={40} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <p style={{ color: 'var(--text-muted)' }}>No leave requests yet. Click "Apply Leave" to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaves.map((l) => (
            <div key={l._id} className="glass p-4 animate-fade-up">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="capitalize font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {l.type.replace('_', ' ')}
                    </span>
                    <span className={`badge ${statusBadge[l.status]}`}>
                      {statusIcon[l.status]} <span className="ml-1">{statusLabel[l.status]}</span>
                    </span>
                  </div>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {new Date(l.fromDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    {' — '}
                    {new Date(l.toDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{l.reason}</p>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {new Date(l.createdAt).toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leave;
