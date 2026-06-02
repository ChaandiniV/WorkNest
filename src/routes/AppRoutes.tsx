import { Route, Routes, Navigate } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { RequestsPage } from '../pages/RequestsPage';
import { NewRequestPage } from '../pages/NewRequestPage';
import { RequestDetailPage } from '../pages/RequestDetailPage';
import { AdminRequestsPage } from '../pages/AdminRequestsPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { TeamPage } from '../pages/TeamPage';
import { ManagerOverviewPage } from '../pages/ManagerOverviewPage';
import { DevConsolePage } from '../pages/DevConsolePage';
import { SettingsPage } from '../pages/SettingsPage';
import { ProtectedRoute } from './ProtectedRoute';

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="lg:flex">
        <Sidebar />
        <div className="flex-1">
          <Topbar />
          <main className="min-h-[calc(100vh-80px)] p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRole="employee">
            <AppShell>
              <DashboardPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/requests"
        element={
          <ProtectedRoute allowedRole="employee">
            <AppShell>
              <RequestsPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/requests/new"
        element={
          <ProtectedRoute allowedRole="employee">
            <AppShell>
              <NewRequestPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/requests/:id"
        element={
          <ProtectedRoute allowedRole="employee">
            <AppShell>
              <RequestDetailPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/requests"
        element={
          <ProtectedRoute allowedRole="admin">
            <AppShell>
              <AdminRequestsPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute allowedRole="admin">
            <AppShell>
              <AnalyticsPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/team"
        element={
          <ProtectedRoute allowedRole="admin">
            <AppShell>
              <TeamPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/overview"
        element={
          <ProtectedRoute allowedRole="manager">
            <AppShell>
              <ManagerOverviewPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dev-console"
        element={
          <ProtectedRoute allowedRole="any">
            <AppShell>
              <DevConsolePage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute allowedRole="any">
            <AppShell>
              <SettingsPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
