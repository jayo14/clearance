import { Routes, Route, useNavigate, useParams, Navigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { AdminUser, Student, ClearanceItem } from '../types';
import { OfficerLayout } from '../components/OfficerLayout';
import { recordService } from '../services/recordService';

// Import Page Components
import { DashboardHome } from './admin/DashboardHome';
import { StudentDirectory } from './admin/StudentDirectory';
import { ClearanceQueue } from './admin/ClearanceQueue';
import { Settings } from './admin/Settings';
import { Analytics } from './admin/Analytics';
import NotificationsPage from './NotificationsPage'; 
import { SearchResults } from './admin/SearchResults';
import { StudentReview } from '../components/StudentReview';
import { LoadingSpinner } from '../components/UI';

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

  const handleSelectStudent = (s: Student | string | ClearanceItem) => {
      let id: string;
      if (typeof s === 'string') {
          id = s;
      } else if ('id' in s) {
          id = s.id;
      } else {
          return;
      }
      navigate(`/dashboard/review/${id}`);
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
          <Route path="review/:itemId" element={<ReviewWrapper user={user} />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </OfficerLayout>
  );
}

const ReviewWrapper = ({ user }: { user: AdminUser }) => {
    const { itemId } = useParams<{ itemId: string }>();
    const navigate = useNavigate();
    const [item, setItem] = useState<ClearanceItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchItem = async () => {
            if (!itemId) return;
            try {
                const data = await recordService.getOfficerClearanceDetail(itemId);
                setItem(data);
            } catch (err) {
                console.error('Failed to fetch clearance item:', err);
                setError('Failed to load clearance item');
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [itemId]);

    if (loading) return <div className="p-12 flex justify-center"><LoadingSpinner text="Loading clearance data..." /></div>;
    if (error || !item) return <Navigate to="/dashboard/queue" replace />;

    // For the StudentReview component, we need a Student object.
    // However, the backend ClearanceItemSerializer should provide student data.
    // Let's assume the item returned has enough student info or we adapt StudentReview.

    const handleNextStudent = () => {
        // Logic to navigate to next student in queue could be implemented here
        navigate('/dashboard/queue');
    };

    const handlePrevStudent = () => {
        navigate('/dashboard/queue');
    };

    return (
        <StudentReview 
          clearanceItem={item}
          adminUser={user}
          onBack={() => navigate(-1)} 
          onNext={handleNextStudent}
          onPrev={handlePrevStudent}
          onUpdate={() => {
              // Refresh data or navigate back
              navigate('/dashboard/queue');
          }}
        />
    );
};
