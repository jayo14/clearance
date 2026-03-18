import React, { useState } from 'react';
import { Button, ThemeToggle } from '../components/UI';
import { 
  Shield, Lock, Mail, Eye, EyeOff, AlertTriangle, 
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Props {
  onSwitchToStudent: () => void;
}

export default function OfficerLogin({ onSwitchToStudent }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
        await login(email, password);
    } catch (err: any) {
        setError(err.message || "Unauthorized credentials. Please check your staff email.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background font-sans">
       <div className="hidden lg:flex w-[40%] relative bg-secondary overflow-hidden flex-col justify-between p-12 text-secondary-foreground">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary to-black opacity-90"></div>
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg">
                   <Shield size={24} />
                </div>
                <div>
                   <h1 className="text-2xl font-bold leading-none">Administration</h1>
                   <p className="text-primary text-sm">Clearance Control Panel</p>
                </div>
             </div>
             <h2 className="text-4xl font-bold mt-12 mb-6 leading-tight">Secure Management for all Institutional Roles.</h2>
          </div>
          <div className="relative z-10 pt-8 border-t border-white/10 text-xs text-secondary-foreground/50 flex justify-between items-center">
             <span>System Security v2.4</span>
             <span className="flex items-center gap-2"><Lock size={12} /> Authorized Access Only</span>
          </div>
       </div>

       <div className="w-full lg:w-[60%] relative flex flex-col justify-center items-center p-6 md:p-12 overflow-y-auto bg-background">
          <div className="absolute top-6 right-6 flex items-center gap-3">
             <ThemeToggle />
          </div>

          <div className="w-full max-w-md space-y-8 animate-slide-up-fade">
             <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-foreground">Staff Login</h2>
                <p className="mt-2 text-muted-foreground">Access your administrative or review dashboard.</p>
             </div>

             {error && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3 text-destructive animate-shake" role="alert">
                   <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                   <p className="text-sm font-medium">{error}</p>
                </div>
             )}

             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                   <div>
                      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 transition-colors group-focus-within:text-primary">Staff Email or Username</label>
                      <div className="relative group">
                         <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                            <Mail size={20} />
                         </div>
                         <input 
                            type="text" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3.5 bg-muted/50 border border-border rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200"
                            placeholder="officer@university.edu"
                         />
                      </div>
                   </div>

                   <div>
                      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 transition-colors group-focus-within:text-primary">Security Password</label>
                      <div className="relative group">
                         <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                            <Lock size={20} />
                         </div>
                         <input 
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-12 py-3.5 bg-muted/50 border border-border rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200"
                            placeholder="••••••••"
                         />
                         <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                         >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                         </button>
                      </div>
                      <div className="flex justify-end mt-2">
                         <a href="/forgot-password" className="text-xs font-bold text-primary hover:underline">Forgot Password?</a>
                      </div>
                   </div>
                </div>

                <Button variant="secondary" className="w-full py-4 text-base font-bold" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Sign In to Dashboard"}
                </Button>
             </form>

             <div className="pt-8 border-t border-border text-center">
                <p className="text-sm text-muted-foreground mb-3">Not a staff member?</p>
                <button onClick={onSwitchToStudent} className="text-sm font-bold text-primary hover:underline transition-colors">
                   Switch to Student Login
                </button>
             </div>
          </div>
       </div>
    </div>
  );
}
