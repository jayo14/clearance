import { Routes, Route, useNavigate, useParams, Navigate, useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import { AdminUser, Student } from '../types';
import { OfficerLayout } from '../components/OfficerLayout';
import { MOCK_STUDENTS } from '../services/mockData';

// Import Page Components
import { DashboardHome } from './admin/DashboardHome';
import { StudentDirectory } from './admin/StudentDirectory';
import { ClearanceQueue } from './admin/ClearanceQueue';
import { Settings } from './admin/Settings';
import { Analytics } from './admin/Analytics';
import NotificationsPage from './NotificationsPage'; 
import { SearchResults } from './admin/SearchResults';
import { StudentReview } from '../components/StudentReview';

interface Props {
  user: AdminUser;
  onLogout: () => void;
}

type ViewState = 'dashboard' | 'students' | 'queue' | 'settings' | 'analytics' | 'notifications' | 'search';

export default function AdminPortal({ user, onLogout }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavigate = (view: string, params?: any) => {
    if (view === 'dashboard') navigate('/dashboard');
    else if (view === 'search' && typeof params === 'string') {
        setSearchQuery(params);
        navigate('/dashboard/search');
    }
    else navigate(`/dashboard/${view}`);
  };

  const handleSelectStudent = (s: Student | string) => {
      const id = typeof s === 'string' ? s : s.id;
      if (id) navigate(`/dashboard/review/${id}`);
  };

  // Extract active view from path for layout highlighting
  const activeView = location.pathname.split('/').pop() as ViewState || 'dashboard';

  return (
    <OfficerLayout 
      user={user} 
      onLogout={onLogout} 
      activeView={activeView} 
      onNavigate={handleNavigate}
      onSelectStudent={handleSelectStudent}
    >
      <Routes>
          <Route path="/" element={<DashboardHome onNavigate={handleNavigate} user={user} />} />
          <Route path="students" element={<StudentDirectory onSelectStudent={handleSelectStudent} />} />
          <Route path="queue" element={<ClearanceQueue onSelectStudent={handleSelectStudent} />} />
          <Route path="settings" element={<Settings user={user} />} />
          <Route path="analytics" element={<Analytics user={user} />} />
          <Route path="notifications" element={<NotificationsPage onNavigate={handleNavigate} />} />
          <Route path="search" element={<SearchResults initialQuery={searchQuery} onSelectStudent={handleSelectStudent} />} />
          <Route path="review/:studentId" element={<ReviewWrapper user={user} />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </OfficerLayout>
  );
}

const ReviewWrapper = ({ user }: { user: AdminUser }) => {
    const { studentId } = useParams<{ studentId: string }>();
    const navigate = useNavigate();
    const selectedStudent = MOCK_STUDENTS.find(s => s.id === studentId);

    if (!selectedStudent) return <Navigate to="/dashboard/queue" replace />;

    const handleNextStudent = () => {
        const currentIndex = MOCK_STUDENTS.findIndex(s => s.id === studentId);
        if (currentIndex !== -1 && currentIndex < MOCK_STUDENTS.length - 1) {
            navigate(`/dashboard/review/${MOCK_STUDENTS[currentIndex + 1].id}`);
        } else {
            alert("End of queue");
        }
    };

    const handlePrevStudent = () => {
        const currentIndex = MOCK_STUDENTS.findIndex(s => s.id === studentId);
        if (currentIndex > 0) {
            navigate(`/dashboard/review/${MOCK_STUDENTS[currentIndex - 1].id}`);
        }
    };

    return (
        <StudentReview 
          student={selectedStudent} 
          adminUser={user}
          onBack={() => navigate(-1)} 
          onNext={handleNextStudent}
          onPrev={handlePrevStudent}
        />
    );
};
