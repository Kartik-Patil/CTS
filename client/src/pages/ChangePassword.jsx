import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const requirements = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'One number',           test: (p) => /\d/.test(p) },
  { label: 'One special character', test: (p) => /[@$!%*?&#]/.test(p) },
];

const ChangePassword = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { refreshProfile } = useAuth();
  const navigate = useNavigate();

  const allMet = requirements.every((r) => r.test(form.newPassword));
  const passwordsMatch = form.newPassword === form.confirmPassword && form.confirmPassword.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!allMet) return setError('Password does not meet requirements');
    if (!passwordsMatch) return setError('Passwords do not match');

    setLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success('Password changed successfully!');
      await refreshProfile();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #0f0f1a, #1a1a2e, #0f0f1a)' }}>

      <div className="w-full max-w-md animate-fade-up">
        <div className="glass p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
              <Lock size={28} color="white" />
            </div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Set New Password</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              This is your first login — please set a secure password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                <AlertCircle size={15} style={{ color: '#f87171' }} />
                <p className="text-sm" style={{ color: '#f87171' }}>{error}</p>
              </div>
            )}

            {[
              { key: 'currentPassword', label: 'Current Password (DOB)', showKey: 'current' },
              { key: 'newPassword',     label: 'New Password',          showKey: 'new' },
              { key: 'confirmPassword', label: 'Confirm Password',      showKey: 'confirm' },
            ].map(({ key, label, showKey }) => (
              <div key={key}>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}>
                  {label}
                </label>
                <div className="relative">
                  <input
                    type={show[showKey] ? 'text' : 'password'}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="input-field pr-10"
                    required
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShow({ ...show, [showKey]: !show[showKey] })}>
                    {show[showKey]
                      ? <EyeOff size={15} style={{ color: 'var(--text-muted)' }} />
                      : <Eye size={15} style={{ color: 'var(--text-muted)' }} />}
                  </button>
                </div>
              </div>
            ))}

            {/* Requirements */}
            {form.newPassword.length > 0 && (
              <div className="p-3 rounded-xl space-y-1.5" style={{ background: 'var(--surface-2)' }}>
                {requirements.map((r) => {
                  const ok = r.test(form.newPassword);
                  return (
                    <div key={r.label} className="flex items-center gap-2">
                      <CheckCircle size={13} style={{ color: ok ? '#10b981' : 'var(--text-muted)', flexShrink: 0 }} />
                      <span className="text-xs" style={{ color: ok ? '#10b981' : 'var(--text-muted)' }}>{r.label}</span>
                    </div>
                  );
                })}
                {form.confirmPassword.length > 0 && (
                  <div className="flex items-center gap-2 pt-1 border-t" style={{ borderColor: 'var(--border)' }}>
                    <CheckCircle size={13} style={{ color: passwordsMatch ? '#10b981' : '#ef4444', flexShrink: 0 }} />
                    <span className="text-xs" style={{ color: passwordsMatch ? '#10b981' : '#ef4444' }}>Passwords match</span>
                  </div>
                )}
              </div>
            )}

            <button id="change-pwd-btn" type="submit" className="btn-primary w-full justify-center py-3" disabled={loading}>
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
              ) : 'Set New Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
