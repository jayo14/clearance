import { Routes, Route, useNavigate, useParams, Navigate } from 'react-router-dom';
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Student, DocumentRequirement, OfficeType, ClearanceStatus, ClearanceRecord } from '../types';
import { OFFICE_CONFIG } from './OfficeView';
import { Button, ThemeToggle, LoadingSpinner } from '../components/UI';
import { Certificate } from '../components/Certificate';
import { StudentLayout } from '../components/StudentLayout';
import StudentDashboard from './StudentDashboard';
import OfficeView from './OfficeView';
import StatusTracking from './StatusTracking';
import CertificatePage from './CertificatePage';
import HelpPage from './HelpPage';
import NotificationsPage from './NotificationsPage';
import { Settings } from './student/Settings';
import { ShieldCheck } from 'lucide-react';
import { recordService } from '../services/recordService';

interface Props {
  user: Student;
  onLogout: () => void;
}

type ViewState = 'dashboard' | 'office' | 'status' | 'certificate' | 'help' | 'notifications' | 'settings';

export default function StudentPortal({ user, onLogout }: Props) {
  const navigate = useNavigate();
  // --- State Management ---
  const [clearanceRecord, setClearanceRecord] = useState<ClearanceRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingStatus, setUploadingStatus] = useState<Record<string, boolean>>({});
  
  // --- Fetch Data ---
  const fetchRecord = async () => {
      try {
          const data = await recordService.getMyRecord();
          setClearanceRecord(data);
      } catch (err) {
          console.error('Failed to fetch record:', err);
      } finally {
          setIsLoading(false);
      }
  };

  useEffect(() => {
      fetchRecord();
  }, []);

  // --- Navigation Handler ---
  const handleNavigate = (view: ViewState, office?: OfficeType) => {
      if (view === 'dashboard') navigate('/dashboard');
      else if (view === 'office' && office) navigate(`/dashboard/office/${office}`);
      else navigate(`/dashboard/${view}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Handlers ---
  const handleUpload = useCallback(async (req: DocumentRequirement, fileData: string, file: File) => {
    setUploadingStatus(prev => ({ ...prev, [req.document_type]: true }));
    
    try {
        await recordService.uploadDocument(req.office_type, req.document_type, file);
        await fetchRecord(); // Refresh data
        
        const announcer = document.getElementById('a11y-announcer');
        if (announcer) announcer.innerText = `Successfully uploaded ${file.name}`;
    } catch (err) {
        console.error('Upload failed:', err);
        alert('Failed to upload document. Please try again.');
    } finally {
        setUploadingStatus(prev => ({ ...prev, [req.document_type]: false }));
    }
  }, [fetchRecord]);

  const handleRemoveDocument = useCallback((docId: string, officeType: OfficeType) => {
    // Note: Backend remove document endpoint not implemented yet, using local state for now or we could implement it
    if (confirm("Are you sure you want to remove this document?")) {
        alert("Removal is not yet connected to backend.");
    }
  }, []);

  const handleSubmitOffice = useCallback(async (officeType: OfficeType) => {
      try {
          await recordService.submitClearance(officeType);
          await fetchRecord(); // Refresh record after submission
          navigate('/dashboard');
      } catch (err: any) {
          console.error('Submission failed:', err);
          alert(err.message || 'Failed to submit clearance. Please try again.');
      }
  }, [fetchRecord, navigate]);

  if (isLoading || !clearanceRecord) {
      return <LoadingSpinner variant="full-page" text="Loading your clearance record..." />;
  }

  return (
    <StudentLayout user={user} onLogout={onLogout} onNavigate={handleNavigate}>
       <div id="a11y-announcer" className="sr-only" aria-live="polite"></div>
       <Routes>
          <Route path="/" element={<StudentDashboard student={user} clearanceRecord={clearanceRecord} onNavigate={handleNavigate} />} />
          <Route path="status" element={<StatusTracking student={user} clearanceRecord={clearanceRecord} onNavigate={handleNavigate} />} />
          <Route path="office/:officeType" element={<OfficeWrapper clearanceRecord={clearanceRecord} onBack={() => handleNavigate('dashboard')} onUpload={handleUpload} onRemove={handleRemoveDocument} onSubmit={handleSubmitOffice} uploadingStatus={uploadingStatus} />} />
          <Route path="certificate" element={<CertificatePage student={user} onNavigate={handleNavigate} />} />
          <Route path="help" element={<HelpPage student={user} onNavigate={handleNavigate} />} />
          <Route path="notifications" element={<NotificationsPage onNavigate={handleNavigate} />} />
          <Route path="settings" element={<Settings student={user} />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
       </Routes>
    </StudentLayout>
  );
}

// Helper to extract officeType from URL
const OfficeWrapper = (props: any) => {
    const { officeType } = useParams<{ officeType: OfficeType }>();
    if (!officeType) return <Navigate to="/dashboard" replace />;
    return <OfficeView officeType={officeType} {...props} />;
};