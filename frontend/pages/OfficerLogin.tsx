import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, Loader2, AlertCircle, ArrowRight, BookOpen } from 'lucide-react';
import { Button, Card, ThemeToggle } from '../components/UI';
import { authService } from '../services/authService';

interface Props {
  onSwitchToStudent: () => void;
}

export default function OfficerLogin({ onSwitchToStudent }: Props) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = await authService.login(formData.username, formData.password);
      localStorage.setItem('auth_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 dark:bg-slate-950 flex flex-col md:flex-row font-sans transition-colors duration-300">
      {/* Left: Branding/Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center font-bold shadow-lg shadow-primary/20">
              <Shield size={24} />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">Clearance <span className="text-primary">Admin</span></span>
          </div>

          <div className="space-y-6 max-w-md">
            <h1 className="text-5xl font-black leading-none tracking-tighter">Streamline Student Verifications.</h1>
            <p className="text-slate-400 text-lg font-medium leading-relaxed">
              The central hub for administrative and departmental officers to manage, review, and approve student clearance requests.
            </p>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-6">
            {[
                { label: 'Instant Review', desc: 'Real-time document verification', icon: BookOpen },
                { label: 'Secure Data', desc: 'Encrypted student records', icon: Shield },
            ].map((item, i) => (
                <div key={i} className="space-y-2 p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                    <item.icon className="text-primary" size={24} />
                    <h3 className="font-bold text-sm">{item.label}</h3>
                    <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                </div>
            ))}
        </div>

        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary rounded-full blur-[120px]"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600 rounded-full blur-[120px]"></div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative">
        <div className="absolute top-8 right-8">
            <ThemeToggle />
        </div>

        <Card className="w-full max-w-md p-8 md:p-10 border-none shadow-none md:shadow-2xl md:bg-card">
          <div className="mb-10 text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-6">
                <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl">
                    <Shield size={28} />
                </div>
            </div>
            <h2 className="text-3xl font-black text-foreground tracking-tight mb-2">Officer Login</h2>
            <p className="text-muted-foreground font-medium">Access the administrative dashboard.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-start gap-3 animate-shake">
              <AlertCircle className="text-red-600 shrink-0" size={20} />
              <p className="text-sm font-bold text-red-600 leading-tight">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Email or Username</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="text"
                  required
                  placeholder="officer@university.edu"
                  className="w-full pl-12 pr-4 py-3.5 bg-muted dark:bg-slate-900/50 border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary focus:bg-card transition-all font-medium"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
                <span className="flex items-center gap-2">Sign In to Dashboard <ArrowRight size={20} /></span>
              )}
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-border text-center space-y-4">
            <p className="text-xs font-medium text-muted-foreground">
              Are you a student? <button onClick={onSwitchToStudent} className="text-primary font-black hover:underline uppercase tracking-widest ml-1">Student Portal</button>
            </p>
            <p className="text-xs font-medium text-muted-foreground">
              New institution? <Link to="/onboarding" className="text-primary font-black hover:underline uppercase tracking-widest ml-1">Register here</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
