import { useAuth } from '../context/AuthContext';
import { Mail, Phone, Building2, Award, BookOpen, GraduationCap } from 'lucide-react';

const FacultyDashboard = () => {
  const { profile, user } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="animate-fade-up">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Faculty Workspace 👩‍🏫
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
          Welcome back, {profile?.name}. Manage your courses and academic records.
        </p>
      </div>

      {/* Profile Card */}
      <div className="glass p-6 animate-fade-up">
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{
            width: 68, height: 68, borderRadius: 16, flexShrink: 0,
            background: 'linear-gradient(135deg, #6366f1, #0ea5e9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.625rem', fontWeight: 800, color: 'white'
          }}>
            {profile?.name?.[0]}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{profile?.name}</h2>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              <span className="badge badge-purple">Code: {profile?.employeeId}</span>
              <span className="badge badge-info">{profile?.designation}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginTop: '1rem' }}>
              <div className="info-row"><Building2 size={14} /> <span>{profile?.department}</span></div>
              <div className="info-row"><Mail size={14} /> <span>{profile?.email}</span></div>
              <div className="info-row"><Phone size={14} /> <span>{profile?.mobile}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Subjects Taught */}
      <div className="glass p-6 animate-fade-up">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <BookOpen size={18} style={{ color: '#6366f1' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Assigned Courses / Subjects</h2>
        </div>

        {profile?.subjects?.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {profile.subjects.map((subCode) => (
              <div key={subCode} className="glass-light p-4" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10, background: 'rgba(99,102,241,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <GraduationCap size={20} style={{ color: '#6366f1' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Course Code: {subCode}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>CSE Department · Semester 5</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No courses assigned to this account.</p>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;
