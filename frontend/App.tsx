import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import StudentPortal from './pages/StudentPortal';
import AdminPortal from './pages/AdminPortal'; // Reviewer (Officer)
import SuperAdminPortal from './pages/SuperAdminPortal';
import InstitutionAdminPortal from './pages/InstitutionAdminPortal';
import StudentLogin from './pages/StudentLogin';
import OfficerLogin from './pages/OfficerLogin';
import Documentation from './pages/Documentation';
import InstitutionOnboarding from './pages/InstitutionOnboarding';
import OfficerOnboarding from './pages/OfficerOnboarding';
import ForgotPassword from './pages/ForgotPassword';
import { LoadingSpinner } from './components/UI';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SessionManager, NetworkManager } from './components/GlobalStatusManagers';
import { ServerErrorView } from './components/ErrorViews';
import { Toaster } from './components/ui/sonner';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ServerErrorView onRetry={() => window.location.reload()} />;
    }

    return this.props.children;
  }
}

const AppContent = () => {
  const { currentUser, isLoading, logout } = useAuth();
  const [loginRole, setLoginRole] = useState<UserRole>(UserRole.STUDENT);
  const location = useLocation();

  if (isLoading) {
      return <LoadingSpinner variant="full-page" text="Verifying session..." />;
  }

  // Auth Guard
  const RequireAuth = ({ children, role }: { children: React.ReactNode, role?: UserRole }) => {
    if (!currentUser) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }
    if (role && currentUser.role !== role) {
      return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
  };

  const renderPortal = () => {
    if (!currentUser) return <Navigate to="/" replace />;
    
    switch (currentUser.role) {
      case UserRole.STUDENT:
        return <StudentPortal user={currentUser as any} onLogout={logout} />;
      case UserRole.SUPER_ADMIN:
        return <SuperAdminPortal user={currentUser as any} onLogout={logout} />;
      case UserRole.INSTITUTION_ADMIN:
        return <InstitutionAdminPortal user={currentUser as any} onLogout={logout} />;
      case UserRole.OFFICER:
        return <AdminPortal user={currentUser as any} onLogout={logout} />;
      default:
        return <Navigate to="/" replace />;
    }
  };

  return (
    <>
      <Toaster />
      <NetworkManager />
      {currentUser && <SessionManager onLogout={logout} timeoutMinutes={30} />}
      
      <Routes>
        <Route path="/" element={
          !currentUser ? (
            loginRole === UserRole.STUDENT ? (
                <StudentLogin onSwitchToAdmin={() => setLoginRole(UserRole.OFFICER)} />
            ) : (
                <OfficerLogin onSwitchToStudent={() => setLoginRole(UserRole.STUDENT)} />
            )
          ) : (
            <Navigate to="/dashboard" replace />
          )
        } />
        
        <Route path="/dashboard/*" element={<RequireAuth>{renderPortal()}</RequireAuth>} />
        <Route path="/docs" element={<Documentation />} />
        <Route path="/onboarding" element={<InstitutionOnboarding />} />
        <Route path="/onboard-officer" element={<OfficerOnboarding />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to={currentUser ? "/dashboard" : "/"} replace />} />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}