import React, { useState } from 'react';
import { Button, ThemeToggle } from '../components/UI';
import { 
  GraduationCap, ArrowRight, Eye, EyeOff, AlertCircle, 
  CheckCircle2, HelpCircle, Lock, User as UserIcon, Loader2, Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Props {
  onSwitchToAdmin: () => void;
}

export default function StudentLogin({ onSwitchToAdmin }: Props) {
  const [jambNo, setJambNo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jambError, setJambError] = useState<string | null>(null);
  
  const { login } = useAuth();

  const validateJamb = (value: string) => {
    const regex = /^[A-Za-z0-9]{10,12}$/;
    if (!value) {
      setJambError(null);
      return false;
    }
    if (value.length < 10) {
      setJambError("JAMB Number must be at least 10 characters");
      return false;
    }
    if (!regex.test(value)) {
      setJambError("JAMB Number must contain only letters and numbers");
      return false;
    }
    setJambError(null);
    return true;
  };

  const handleChangeJamb = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    if (val.length <= 12) {
        setJambNo(val);
        validateJamb(val);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateJamb(jambNo)) {
        return;
    }

    setIsLoading(true);

    try {
        await login(jambNo, password);
    } catch (err: any) {
        setError(err.message || "Invalid credentials. Please check your JAMB number and password.");
    } finally {
        setIsLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen bg-background font-sans">
       {/* Left Column - Branding */}
       <div className="hidden lg:flex w-[40%] relative bg-secondary overflow-hidden flex-col justify-between p-12 text-secondary-foreground">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/95 to-secondary/80"></div>
          
          <div className="relative z-10 animate-slide-up-fade" style={{ animationDelay: '0.1s' }}>
             <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg animate-float">
                   <span className="font-bold text-xl">L</span>
                </div>
                <div>
                   <h1 className="text-2xl font-bold leading-none">LASUSTECH</h1>
                   <p className="text-primary text-sm">Excellence & Innovation</p>
                </div>
             </div>
             
             <h2 className="text-4xl font-bold mt-12 mb-6 leading-tight text-secondary-foreground">
                Complete your admission clearance online
             </h2>
             <p className="text-secondary-foreground/80 text-lg leading-relaxed max-w-md">
                Welcome to the digital clearance portal. Verify your documents, track your status, and get cleared without the stress.
             </p>
          </div>

          <div className="relative z-10 space-y-4 animate-slide-up-fade" style={{ animationDelay: '0.3s' }}>
             {[
                { title: "Fast & Convenient", desc: "Upload documents from anywhere" },
                { title: "Real-time Tracking", desc: "Monitor your application status" },
                { title: "Instant Certification", desc: "Download clearance upon approval" }
             ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 backdrop-blur-sm hover:bg-primary-foreground/10 transition-colors duration-300">
                   <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <CheckCircle2 size={20} />
                   </div>
                   <div>
                      <h3 className="font-bold text-sm text-secondary-foreground">{benefit.title}</h3>
                      <p className="text-xs text-secondary-foreground/70">{benefit.desc}</p>
                   </div>
                </div>
             ))}
          </div>

          <div className="relative z-10 pt-8 text-xs text-secondary-foreground/50">
             &copy; 2024 Lagos State University of Science and Technology
          </div>
       </div>

       {/* Right Column - Login Form */}
       <div className="w-full lg:w-[60%] relative flex flex-col justify-center items-center p-6 md:p-12 overflow-y-auto bg-background">
          <div className="lg:hidden w-full max-w-md mb-8 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <div className="h-10 w-10 bg-secondary rounded-lg flex items-center justify-center text-secondary-foreground font-bold">L</div>
                <span className="font-bold text-foreground text-lg">LASUSTECH</span>
             </div>
             <ThemeToggle />
          </div>

          <div className="hidden lg:block absolute top-6 right-6">
             <ThemeToggle />
          </div>

          <div className="w-full max-w-md space-y-8 animate-slide-up-fade">
             <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-foreground tracking-tight">Student Clearance Portal</h2>
                <p className="mt-2 text-muted-foreground">Sign in with your JAMB credentials to proceed</p>
             </div>

             {error && (
                <div 
                  className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3 text-destructive animate-shake"
                  role="alert"
                >
                   <AlertCircle className="shrink-0 mt-0.5" size={18} aria-hidden="true" />
                   <p className="text-sm font-medium">{error}</p>
                </div>
             )}

             <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="space-y-4">
                   <div>
                      <label htmlFor="jamb" className="block text-sm font-bold text-foreground mb-1.5 transition-colors group-focus-within:text-primary">
                         JAMB Registration Number
                      </label>
                      <div className="relative group">
                         <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-300">
                            <GraduationCap size={20} aria-hidden="true" />
                         </div>
                         <input 
                            id="jamb"
                            type="text" 
                            value={jambNo}
                            onChange={handleChangeJamb}
                            aria-invalid={!!jambError}
                            aria-describedby={jambError ? "jamb-error" : undefined}
                            className={`w-full pl-10 pr-4 py-3.5 bg-muted/50 border rounded-xl outline-none transition-all duration-200 font-mono font-medium placeholder:font-sans placeholder:text-muted-foreground ${
                                jambError 
                                ? 'border-destructive focus:ring-destructive/10 animate-shake' 
                                : 'border-border focus:border-primary focus:ring-4 focus:ring-primary/10 focus:scale-[1.01]'
                            }`}
                            placeholder="e.g. 2024987654AB"
                            maxLength={12}
                            autoFocus
                         />
                      </div>
                      {jambError && (
                          <p id="jamb-error" className="mt-1.5 text-xs font-medium text-destructive flex items-center gap-1 animate-slide-up-fade" role="alert">
                             <AlertCircle size={12} aria-hidden="true" /> {jambError}
                          </p>
                      )}
                   </div>

                   <div>
                      <label htmlFor="password" className="block text-sm font-bold text-foreground mb-1.5 transition-colors group-focus-within:text-primary">
                         Password
                      </label>
                      <div className="relative group">
                         <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-300">
                            <Lock size={20} aria-hidden="true" />
                         </div>
                         <input 
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-12 py-3.5 bg-muted/50 border border-border rounded-xl outline-none transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:scale-[1.01] placeholder:text-muted-foreground font-medium"
                            placeholder="Enter your password"
                         />
                         <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                         >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                         </button>
                      </div>
                      <div className="flex justify-end mt-2">
                         <a 
                            href="https://jamb.gov.ng" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs font-bold text-primary hover:underline transition-colors"
                         >
                            Forgot Password?
                         </a>
                      </div>
                   </div>
                </div>

                <Button 
                    variant="primary"
                    className="w-full py-4 text-base font-bold text-primary-foreground" 
                    size="lg"
                    disabled={isLoading || !!jambError || jambNo.length < 10 || !password}
                >
                    {isLoading ? (
                        <>
                           <Loader2 className="animate-spin" size={20} aria-hidden="true" /> Signing in...
                        </>
                    ) : (
                        <>
                           Sign In <ArrowRight size={20} aria-hidden="true" />
                        </>
                    )}
                </Button>
             </form>

              <div className="pt-6 border-t border-border text-center">
                 <p className="text-sm text-muted-foreground mb-3">
                    Are you a staff member?
                 </p>
                 <Button variant="outline" className="w-full" onClick={onSwitchToAdmin}>
                    <UserIcon size={18} aria-hidden="true" /> Staff Login
                 </Button>
              </div>

             <div className="flex flex-col gap-4 text-center mt-8">
                 <div className="flex justify-center gap-6 text-xs text-muted-foreground">
                     <a href="/docs" onClick={(e) => { e.preventDefault(); window.location.pathname = '/docs'; }} className="hover:text-foreground transition-colors">
                        Documentation & User Guide
                     </a>
                 </div>
                 <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                     <HelpCircle size={14} aria-hidden="true" /> Need help? Contact <a href="mailto:admissions@lasustech.edu.ng" className="text-primary hover:underline transition-colors">admissions@lasustech.edu.ng</a>
                 </p>
             </div>
          </div>
       </div>
    </div>
  );
}