import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Building2, BedDouble, UtensilsCrossed, Phone, User, Calendar, AlertTriangle, ChevronRight } from 'lucide-react';

const messMenu = {
  veg: {
    mon: { breakfast: 'Idli, Sambar, Chutney', lunch: 'Rice, Dal, Rajma, Roti, Salad', dinner: 'Chapati, Paneer Curry, Dal Fry' },
    tue: { breakfast: 'Poha, Upma, Tea', lunch: 'Rice, Sambar, Beans Curry, Roti', dinner: 'Chapati, Aloo Matar, Dal Tadka' },
    wed: { breakfast: 'Dosa, Chutney, Filter Coffee', lunch: 'Jeera Rice, Dal Makhani, Roti, Curd', dinner: 'Chapati, Mix Veg, Dal' },
    thu: { breakfast: 'Bread, Butter, Omelette (Egg), Tea', lunch: 'Rice, Chole, Aloo Gobi, Roti', dinner: 'Chapati, Kadai Paneer, Dal' },
    fri: { breakfast: 'Upma, Banana, Tea', lunch: 'Pulao, Raita, Roti, Mixed Dal', dinner: 'Roti, Dal Palak, Aloo Fry' },
    sat: { breakfast: 'Idli, Vada, Sambar', lunch: 'Biriyani, Raita, Papad, Sweet', dinner: 'Chapati, Paneer Butter Masala' },
    sun: { breakfast: 'Puri, Bhaji, Tea', lunch: 'Rice, Dal, Kadhi, Roti, Salad', dinner: 'Chapati, Shahi Paneer, Kheer' },
  },
};

const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const dayLabel = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' };
const todayKey = () => {
  const d = new Date().getDay(); // 0=Sun
  return days[d === 0 ? 6 : d - 1];
};

const Hostel = () => {
  const { data: hostel, isLoading } = useQuery({
    queryKey: ['hostel'],
    queryFn: () => api.get('/students/hostel').then(r => r.data.data),
  });

  const today = todayKey();
  const todayMenu = hostel ? messMenu[hostel.messPlan]?.[today] : null;

  if (isLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
      <div style={{ width: 36, height: 36, border: '3px solid rgba(245,158,11,0.3)', borderTopColor: '#f59e0b', borderRadius: '50%' }} className="animate-spin" />
    </div>
  );

  if (!hostel) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div className="animate-fade-up">
        <h1 className="page-title">Hostel Management</h1>
        <p className="page-sub">Room allocation, mess schedule and warden contact</p>
      </div>
      <div className="glass animate-fade-up" style={{ padding: '4rem', textAlign: 'center' }}>
        <Building2 size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
        <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Not a Hostel Resident</p>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>This student is a day scholar and has no hostel allocation.</p>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div className="animate-fade-up">
        <h1 className="page-title">Hostel Management</h1>
        <p className="page-sub">Room allocation, mess schedule and warden contact</p>
      </div>

      {/* Room card */}
      <div className="glass animate-fade-up" style={{ padding: '1.75rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16, flexShrink: 0,
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Building2 size={28} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{hostel.hostelName}</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Allotted: {new Date(hostel.allottedFrom).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })} — {new Date(hostel.allottedTo).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <span className={`badge ${hostel.isActive ? 'badge-success' : 'badge-danger'}`} style={{ flexShrink: 0 }}>
            {hostel.isActive ? 'Active' : 'Vacated'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
          {[
            { icon: Building2, label: 'Block', value: hostel.blockName },
            { icon: BedDouble, label: 'Room Number', value: hostel.roomNumber },
            { icon: BedDouble,  label: 'Bed', value: hostel.bedNumber },
            { icon: UtensilsCrossed, label: 'Mess Plan', value: hostel.messPlan === 'veg' ? '🥗 Vegetarian' : hostel.messPlan === 'non_veg' ? '🍗 Non-Vegetarian' : '🍽️ Both' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} style={{ padding: '1rem', borderRadius: 12, background: 'var(--surface-3)', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{label}</p>
              <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Warden */}
      <div className="card animate-fade-up" style={{ padding: '1.375rem' }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '1rem' }}>Warden Contact</p>
        <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{hostel.wardenName}</p>
        <a href={`tel:${hostel.wardenMobile}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#38bdf8', textDecoration: 'none' }}>
          <Phone size={14} />{hostel.wardenMobile}
        </a>
      </div>

      {/* Today's mess */}
      {todayMenu && (
        <div className="glass animate-fade-up" style={{ padding: '1.5rem 1.75rem' }}>
          <div className="section-header">
            <span className="section-title">
              <UtensilsCrossed size={16} style={{ color: '#f59e0b' }} />
              Today's Mess Menu
            </span>
            <span className="badge badge-warning" style={{ textTransform: 'capitalize' }}>{dayLabel[today]}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
            {[
              { meal: 'Breakfast', content: todayMenu.breakfast, time: '7:00 – 8:30 AM', color: '#f59e0b' },
              { meal: 'Lunch', content: todayMenu.lunch, time: '12:00 – 2:00 PM', color: '#10b981' },
              { meal: 'Dinner', content: todayMenu.dinner, time: '7:00 – 9:00 PM', color: '#6366f1' },
            ].map(({ meal, content, time, color }) => (
              <div key={meal} style={{ padding: '1.125rem', borderRadius: 12, background: `${color}0d`, border: `1px solid ${color}20` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{meal}</p>
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{time}</p>
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full week menu */}
      <div className="glass animate-fade-up" style={{ padding: '1.5rem 1.75rem' }}>
        <div className="section-header">
          <span className="section-title">
            <Calendar size={16} style={{ color: '#6366f1' }} />
            Weekly Mess Menu
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Breakfast <span style={{ fontWeight: 400, opacity: 0.6 }}>7:00–8:30 AM</span></th>
                <th>Lunch <span style={{ fontWeight: 400, opacity: 0.6 }}>12:00–2:00 PM</span></th>
                <th>Dinner <span style={{ fontWeight: 400, opacity: 0.6 }}>7:00–9:00 PM</span></th>
              </tr>
            </thead>
            <tbody>
              {days.map(day => {
                const menu = messMenu[hostel.messPlan]?.[day] || {};
                const isToday = day === today;
                return (
                  <tr key={day} style={isToday ? { background: 'rgba(99,102,241,0.06)' } : {}}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: isToday ? 700 : 500, color: isToday ? '#a5b4fc' : 'var(--text-secondary)' }}>
                          {dayLabel[day]}
                        </span>
                        {isToday && <span className="badge badge-purple" style={{ fontSize: '0.6rem' }}>Today</span>}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{menu.breakfast || '—'}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{menu.lunch || '—'}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{menu.dinner || '—'}</td>
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

export default Hostel;
