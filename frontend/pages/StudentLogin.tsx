import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, User, Loader2, AlertCircle, ArrowRight, GraduationCap } from 'lucide-react';
import { Button, Card, ThemeToggle } from '../components/UI';
import { authService } from '../services/authService';

interface Props {
  onSwitchToAdmin: () => void;
}

export default function StudentLogin({ onSwitchToAdmin }: Props) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ jamb_number: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = await authService.login(formData.jamb_number, formData.password);
      localStorage.setItem('auth_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      // AuthContext will pick up the token and set the user
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your JAMB number and password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 dark:bg-slate-950 flex flex-col items-center justify-center p-6 transition-colors duration-300">
      <div className="absolute top-8 right-8">
          <ThemeToggle />
      </div>

      <div className="w-full max-w-md mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-6 p-2 pr-4 bg-primary/10 text-primary rounded-2xl">
              <div className="h-10 w-10 bg-primary text-white rounded-xl flex items-center justify-center font-bold shadow-lg shadow-primary/20">
                  <Shield size={24} />
              </div>
              <span className="text-sm font-black tracking-widest uppercase">Student Clearance</span>
          </div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter mb-2">Welcome Back.</h1>
          <p className="text-muted-foreground font-medium">Please enter your credentials to access your portal.</p>
      </div>

      <Card className="w-full max-w-md p-8 md:p-10 border-border shadow-2xl">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-start gap-3 animate-shake">
            <AlertCircle className="text-red-600 shrink-0" size={20} />
            <p className="text-sm font-bold text-red-600 leading-tight">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">JAMB Registration Number</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="text"
                required
                placeholder="2024XXXXXXXXAB"
                className="w-full pl-12 pr-4 py-3.5 bg-muted dark:bg-slate-900/50 border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary focus:bg-card transition-all font-mono text-sm"
                value={formData.jamb_number}
                onChange={(e) => setFormData({ ...formData, jamb_number: e.target.value.toUpperCase() })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Password</label>
              <Link to="/forgot-password" size="sm" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Forgot?</Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 bg-muted dark:bg-slate-900/50 border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary focus:bg-card transition-all font-medium"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-14 rounded-2xl text-base font-black shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98]"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <span className="flex items-center gap-2">Sign In to Portal <ArrowRight size={20} /></span>
            )}
          </Button>
        </form>

        <div className="mt-10 pt-8 border-t border-border text-center space-y-4">
          <p className="text-xs font-medium text-muted-foreground">
             Staff or Administrator? <button onClick={onSwitchToAdmin} className="text-primary font-black hover:underline uppercase tracking-widest ml-1">Officer Login</button>
          </p>
          <p className="text-xs font-medium text-muted-foreground">
             Having trouble logging in? <Link to="/help" className="text-primary font-black hover:underline uppercase tracking-widest ml-1">Contact Support</Link>
          </p>
        </div>
      </Card>

      <p className="mt-8 text-[10px] text-muted-foreground font-bold uppercase tracking-[0.3em]">
        Authorized Student Access Only
      </p>
    </div>
  );
}
