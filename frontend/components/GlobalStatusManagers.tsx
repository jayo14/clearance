
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, LogIn, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { Button } from './UI';
import { useNotification } from '../context/NotificationContext';

// --- Session Manager ---

interface SessionManagerProps {
  onLogout: () => void;
  timeoutMinutes?: number; // default 60
}

export const SessionManager = ({ onLogout, timeoutMinutes = 60 }: SessionManagerProps) => {
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const lastActivityRef = useRef(Date.now());
  // Using ReturnType<typeof setTimeout> to avoid "Cannot find namespace 'NodeJS'" error
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Timeout in ms
  const TIMEOUT_MS = timeoutMinutes * 60 * 1000;
  const WARNING_MS = TIMEOUT_MS - (30 * 1000); // Warn 30s before

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (showModal) return; // Don't hide if already showing expiration warning
  }, [showModal]);

  useEffect(() => {
    // Activity Listeners
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    // Check Interval
    const interval = setInterval(() => {
        const now = Date.now();
        const inactiveTime = now - lastActivityRef.current;

        if (inactiveTime >= TIMEOUT_MS) {
            // Expired
            onLogout(); // Or force redirect logic
            clearInterval(interval);
        } else if (inactiveTime >= WARNING_MS && !showModal) {
            // Warning
            setShowModal(true);
        }
    }, 1000);

    return () => {
        events.forEach(event => window.removeEventListener(event, resetTimer));
        clearInterval(interval);
    };
  }, [TIMEOUT_MS, WARNING_MS, onLogout, showModal, resetTimer]);

  // Countdown effect when modal is open
  useEffect(() => {
      let timer: ReturnType<typeof setInterval>;
      if (showModal) {
          setTimeLeft(30);
          timer = setInterval(() => {
              setTimeLeft(prev => {
                  if (prev <= 1) {
                      onLogout();
                      return 0;
                  }
                  return prev - 1;
              });
          }, 1000);
      }
      return () => clearInterval(timer);
  }, [showModal, onLogout]);

  const handleContinue = () => {
      setShowModal(false);
      resetTimer();
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-secondary/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-card dark:bg-secondary w-full max-w-md rounded-2xl shadow-2xl p-8 text-center border border-slate-200 dark:border-border">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Clock size={32} />
            </div>
            
            <h2 className="text-2xl font-bold text-foreground dark:text-white mb-2">Session Expiring</h2>
            <p className="text-muted-foreground dark:text-muted-foreground mb-6">
                For your security, your session will expire in <span className="font-bold text-amber-600">{timeLeft} seconds</span> due to inactivity.
                <br/><span className="text-xs mt-2 block opacity-75">Any unsaved work has been locally cached.</span>
            </p>

            <div className="flex flex-col gap-3">
                <Button onClick={handleContinue} size="lg" className="w-full">
                    I'm still here
                </Button>
                <Button variant="outline" onClick={onLogout} className="w-full">
                    <LogIn size={18} /> Log In Again
                </Button>
            </div>
        </div>
    </div>
  );
};

// --- Network Manager ---

export const NetworkManager = () => {
    const [isOnline, setIsOnline] = useState(true); // Assume online initially (SSR safe)
    const [isSlow, setIsSlow] = useState(false);
    const { addToast } = useNotification();

    useEffect(() => {
        // Safe check for browser environment
        if (typeof window === 'undefined') return;

        setIsOnline(navigator.onLine);

        const handleOnline = () => {
            setIsOnline(true);
            addToast('success', 'You are back online.', 'Connection Restored');
        };

        const handleOffline = () => {
            setIsOnline(false);
            addToast('error', 'Check your internet connection.', 'No Internet');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Simple Slow Connection Detection
        // Using Network Information API if available
        const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
        
        const checkConnection = () => {
            if (connection) {
                // effectiveType: 'slow-2g', '2g', '3g', or '4g'
                // downlink: Mb/s
                if (connection.saveData || connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
                    if (!isSlow) {
                        setIsSlow(true);
                        addToast('warning', 'Switching to low-data mode.', 'Slow Connection Detected');
                    }
                } else {
                    setIsSlow(false);
                }
            }
        };

        if (connection) {
            connection.addEventListener('change', checkConnection);
            checkConnection(); // Initial check
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            if (connection) {
                connection.removeEventListener('change', checkConnection);
            }
        };
    }, [addToast, isSlow]);

    if (isOnline) return null;

    return (
        <div className="fixed bottom-4 left-4 z-[90] bg-secondary text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-4">
            <WifiOff size={20} className="text-red-400" />
            <div className="text-sm">
                <p className="font-bold">You are offline</p>
                <p className="text-muted-foreground text-xs">Changes will sync when connection returns.</p>
            </div>
        </div>
    );
};
