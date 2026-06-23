import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Academics from './pages/Academics';
import Examination from './pages/Examination';
import Leave from './pages/Leave';
import Notifications from './pages/Notifications';
import Placement from './pages/Placement';
import Hostel from './pages/Hostel';
import Analytics from './pages/Analytics';
import Complaints from './pages/Complaints';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 * 5 }, // 5 min cache
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />

            {/* Protected student routes */}
            <Route element={<ProtectedRoute roles={['student']}><Layout /></ProtectedRoute>}>
              <Route path="/dashboard"     element={<Dashboard />} />
              <Route path="/attendance"    element={<Attendance />} />
              <Route path="/academics"     element={<Academics />} />
              <Route path="/examination"   element={<Examination />} />
              <Route path="/leave"         element={<Leave />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/placement"     element={<Placement />} />
              <Route path="/hostel"        element={<Hostel />} />
              <Route path="/analytics"     element={<Analytics />} />
              <Route path="/complaints"    element={<Complaints />} />
            </Route>

            {/* Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#2a2a3e',
              color: '#f1f5f9',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '0.875rem',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
