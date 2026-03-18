import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './UI';

export const ServerErrorView: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
            <AlertCircle size={32} />
        </div>
        <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
        <p className="text-muted-foreground mb-6">We encountered an unexpected error. Please try again.</p>
        <Button onClick={onRetry}><RefreshCw size={16} /> Retry</Button>
    </div>
);
