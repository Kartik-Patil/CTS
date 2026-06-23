import { Construction } from 'lucide-react';
const Analytics = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold animate-fade-up" style={{ color: 'var(--text-primary)' }}>Student Analytics</h1>
    <div className="glass p-16 text-center animate-fade-up">
      <Construction size={48} className="mx-auto mb-4" style={{ color: '#8b5cf6' }} />
      <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Coming in Phase 3</p>
      <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>Risk assessment, semester comparisons and advanced progress charts.</p>
    </div>
  </div>
);
export default Analytics;
