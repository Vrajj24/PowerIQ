import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';
import { DeviceProvider } from '../context/DeviceContext';

// Direct page imports to eliminate React.lazy chunk resolution errors & blank screens
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Devices from '../pages/Devices';
import Analytics from '../pages/Analytics';
import Reports from '../pages/Reports';
import Alerts from '../pages/Alerts';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';

export default function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/*"
          element={
            <DeviceProvider>
              <DashboardLayout>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="devices" element={<Devices />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="alerts" element={<Alerts />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="" element={<Navigate to="dashboard" replace />} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </DashboardLayout>
            </DeviceProvider>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
