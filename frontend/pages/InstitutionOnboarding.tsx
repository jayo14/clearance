import React, { useState, useEffect } from 'react';
import { 
  Building2, User, CheckCircle2, ArrowRight, ArrowLeft, 
  School, MapPin, Mail, Lock, Globe, ShieldCheck,
  FileBadge, Award, Camera, Upload, Loader2, MailCheck
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { cn } from '../components/utils';

type OnboardingPhase = 'REGISTER' | 'VERIFY' | 'PERSONAL' | 'INSTITUTION' | 'SUCCESS';

interface OnboardingState {
  phase: OnboardingPhase;
  adminData: {
    email: string;
    firstName: string;
    lastName: string;
    qualifications: string;
    phone: string;
  };
  institutionData: {
    name: string;
    shortName: string;
    type: string;
    location: string;
    logo: File | null;
    logoUrl: string;
    primaryColor: string;
  };
}

const INITIAL_STATE: OnboardingState = {
  phase: 'REGISTER',
  adminData: {
    email: '',
    firstName: '',
    lastName: '',
    qualifications: '',
    phone: '',
  },
  institutionData: {
    name: '',
    shortName: '',
    type: 'UNIVERSITY',
    location: '',
    logo: null,
    logoUrl: '',
    primaryColor: '#C1B66D',
  }
};

export default function InstitutionOnboarding() {
  const [state, setState] = useState<OnboardingState>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Auto-scroll to top on phase change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [state.phase]);

  const updateAdminData = (fields: Partial<OnboardingState['adminData']>) => {
    setState(prev => ({ ...prev, adminData: { ...prev.adminData, ...fields } }));
  };

  const updateInstitutionData = (fields: Partial<OnboardingState['institutionData']>) => {
    setState(prev => ({ ...prev, institutionData: { ...prev.institutionData, ...fields } }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      // API call to register admin
      const response = await fetch('/api/accounts/register-admin/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: state.adminData.email,
          password,
          first_name: state.adminData.firstName,
          last_name: state.adminData.lastName,
        }),
      });

      if (!response.ok) throw new Error("Registration failed");
      
      toast.success("Account created! Please check your email for verification.");
      setState(prev => ({ ...prev, phase: 'VERIFY' }));
    } catch (err) {
      toast.error("Could not create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySimulation = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Email verified!");
      setState(prev => ({ ...prev, phase: 'PERSONAL' }));
    }, 1500);
  };

  const handlePersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, phase: 'INSTITUTION' }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      updateInstitutionData({ logo: file, logoUrl: url });
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // API call to setup institution
      // Note: In real app, use FormData for logo file
      const response = await fetch('/api/institutions/institutions/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: state.institutionData.name,
          short_name: state.institutionData.shortName,
          type: state.institutionData.type,
          location: state.institutionData.location,
          primary_color: state.institutionData.primaryColor,
          // admin info would be updated here or linked
        }),
      });

      if (!response.ok) throw new Error("Setup failed");

      setState(prev => ({ ...prev, phase: 'SUCCESS' }));
    } catch (err) {
      toast.error("Could not complete setup.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Phase Renderers ---

  const renderRegister = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="text-center max-w-lg mx-auto">
        <div className="h-16 w-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-3xl font-bold text-foreground">Get Started</h2>
        <p className="text-muted-foreground mt-2">Create your administrator account to begin onboarding your institution.</p>
      </div>

      <Card className="max-w-xl mx-auto border-border shadow-xl">
        <form onSubmit={handleRegister}>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">First Name</label>
                <Input 
                  required
                  placeholder="e.g. John" 
                  value={state.adminData.firstName}
                  onChange={e => updateAdminData({ firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Last Name</label>
                <Input 
                  required
                  placeholder="e.g. Doe" 
                  value={state.adminData.lastName}
                  onChange={e => updateAdminData({ lastName: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Work Email Address</label>
              <Input 
                required
                type="email"
                placeholder="admin@university.edu.ng" 
                value={state.adminData.email}
                onChange={e => updateAdminData({ email: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Password</label>
                <Input 
                  required
                  type="password"
                  placeholder="••••••••" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Confirm Password</label>
                <Input 
                  required
                  type="password"
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 border-t border-border mt-4">
            <Button className="w-full h-12 text-lg font-bold" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Create Admin Account"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );

  const renderVerify = () => (
    <div className="text-center space-y-8 animate-in zoom-in-95 duration-500 py-12">
      <div className="h-24 w-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
        <MailCheck size={48} />
      </div>
      <div className="max-w-md mx-auto space-y-4">
        <h2 className="text-3xl font-bold text-foreground">Verify Your Email</h2>
        <p className="text-muted-foreground leading-relaxed">
          We've sent a verification link to <span className="font-bold text-foreground">{state.adminData.email}</span>. 
          Please click the link in the email to continue.
        </p>
      </div>
      <div className="flex flex-col items-center gap-4 pt-8">
        <Button variant="outline" onClick={handleVerifySimulation} disabled={isLoading} className="h-12 px-8 font-bold border-primary text-primary hover:bg-primary/5">
          {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Simulate Link Click (Dev Only)"}
        </Button>
        <button className="text-sm text-muted-foreground hover:text-primary transition-colors">
          Didn't receive an email? Resend link
        </button>
      </div>
    </div>
  );

  const renderPersonal = () => (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="text-center max-w-lg mx-auto">
        <h2 className="text-3xl font-bold text-foreground text-primary">Personal Details</h2>
        <p className="text-muted-foreground mt-2">Tell us more about yourself to set up your administrative profile.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Left: Form */}
        <Card className="border-border shadow-lg h-fit">
          <form onSubmit={handlePersonalSubmit}>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Award size={16} className="text-primary" /> Qualifications
                </label>
                <select 
                  className="w-full h-12 px-4 rounded-xl border border-border bg-muted/50 focus:ring-2 focus:ring-primary outline-none transition-all"
                  value={state.adminData.qualifications}
                  onChange={e => updateAdminData({ qualifications: e.target.value })}
                  required
                >
                  <option value="">Select highest qualification</option>
                  <option value="PhD">PhD (Doctor of Philosophy)</option>
                  <option value="Masters">Masters Degree</option>
                  <option value="BSc">Bachelors Degree</option>
                  <option value="HND">HND</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Globe size={16} className="text-primary" /> Phone Number
                </label>
                <Input 
                  required
                  placeholder="+234 ..." 
                  value={state.adminData.phone}
                  onChange={e => updateAdminData({ phone: e.target.value })}
                />
              </div>
              <Button className="w-full h-12 font-bold mt-4">
                Next: Institution Details <ArrowRight size={18} className="ml-2" />
              </Button>
            </CardContent>
          </form>
        </Card>

        {/* Right: Info Card */}
        <div className="space-y-6">
          <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
            <h4 className="font-bold text-primary flex items-center gap-2 mb-3">
              <User size={18} /> Profile Preview
            </h4>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-2xl font-black">
                {state.adminData.firstName.charAt(0)}{state.adminData.lastName.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-foreground text-lg">{state.adminData.firstName} {state.adminData.lastName}</p>
                <p className="text-sm text-muted-foreground">{state.adminData.email}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-primary/5 pb-2">
                <span className="text-muted-foreground">Qualification:</span>
                <span className="font-bold text-foreground">{state.adminData.qualifications || '---'}</span>
              </div>
              <div className="flex justify-between border-b border-primary/5 pb-2">
                <span className="text-muted-foreground">Verification:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 size={14}/> Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInstitution = () => (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="text-center max-w-lg mx-auto">
        <h2 className="text-3xl font-bold text-foreground text-primary">Institution Setup</h2>
        <p className="text-muted-foreground mt-2">Final step! Configure your school's digital clearance environment.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Left: Branding & Logo */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-border shadow-lg overflow-hidden">
            <CardHeader className="bg-muted/50 border-b border-border">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Visual Identity</CardTitle>
            </CardHeader>
            <CardContent className="pt-8 flex flex-col items-center">
              <div className="relative group cursor-pointer mb-6">
                <div 
                  className="h-32 w-32 rounded-3xl border-2 border-dashed border-border flex items-center justify-center bg-muted transition-all group-hover:bg-primary/5 group-hover:border-primary/50 overflow-hidden"
                  onClick={() => document.getElementById('logo-upload')?.click()}
                >
                  {state.institutionData.logoUrl ? (
                    <img src={state.institutionData.logoUrl} alt="Logo" className="w-full h-full object-contain p-4" />
                  ) : (
                    <div className="text-center">
                      <Camera size={32} className="text-muted-foreground mx-auto mb-2" />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Upload Logo</span>
                    </div>
                  )}
                </div>
                <input id="logo-upload" type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                <button 
                  className="absolute -bottom-2 -right-2 h-10 w-10 bg-primary text-white rounded-xl shadow-lg border-2 border-background flex items-center justify-center"
                  onClick={() => document.getElementById('logo-upload')?.click()}
                >
                  <Upload size={18} />
                </button>
              </div>

              <div className="w-full space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Theme Primary Color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      className="h-10 w-12 rounded-lg border border-border cursor-pointer bg-transparent p-1"
                      value={state.institutionData.primaryColor}
                      onChange={e => updateInstitutionData({ primaryColor: e.target.value })}
                    />
                    <Input 
                      className="flex-1 font-mono text-sm"
                      value={state.institutionData.primaryColor}
                      onChange={e => updateInstitutionData({ primaryColor: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center/Right: Details Form */}
        <Card className="lg:col-span-2 border-border shadow-lg">
          <form onSubmit={handleFinalSubmit}>
            <CardContent className="pt-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-foreground">Institution Name</label>
                  <Input 
                    required
                    placeholder="e.g. Lagos State University of Science and Technology" 
                    value={state.institutionData.name}
                    onChange={e => updateInstitutionData({ name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Short Name (Abbr.)</label>
                  <Input 
                    required
                    placeholder="e.g. LASUSTECH" 
                    value={state.institutionData.shortName}
                    onChange={e => updateInstitutionData({ shortName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Institution Type</label>
                  <select 
                    className="w-full h-10 px-3 rounded-lg border border-border bg-muted/50 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                    value={state.institutionData.type}
                    onChange={e => updateInstitutionData({ type: e.target.value })}
                  >
                    <option value="UNIVERSITY">University</option>
                    <option value="POLYTECHNIC">Polytechnic</option>
                    <option value="COLLEGE_OF_ED">College of Education</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-foreground">Physical Location</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      required
                      className="pl-10"
                      placeholder="e.g. Ikorodu, Lagos State" 
                      value={state.institutionData.location}
                      onChange={e => updateInstitutionData({ location: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 border-t border-border">
              <div className="flex gap-3 w-full">
                <Button variant="outline" className="flex-1 h-12" onClick={() => setState(prev => ({ ...prev, phase: 'PERSONAL' }))}>
                  Back
                </Button>
                <Button className="flex-[2] h-12 font-bold" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Complete Onboarding"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center space-y-8 animate-in zoom-in-95 duration-700 py-12">
      <div className="h-32 w-32 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner border border-emerald-500/20">
        <CheckCircle2 size={64} className="animate-bounce" />
      </div>
      <div className="max-w-md mx-auto space-y-4">
        <h2 className="text-4xl font-black text-foreground tracking-tight">System Ready!</h2>
        <p className="text-muted-foreground leading-relaxed text-lg">
          Congratulations, <span className="font-bold text-foreground">{institution.name}</span> is now active. 
          You can now start inviting officers and setting up your academic structure.
        </p>
      </div>
      <div className="pt-12">
        <Button size="lg" className="h-14 px-12 font-black text-lg shadow-2xl" onClick={() => window.location.href = '/officer-login'}>
          Go to Dashboard <ArrowRight className="ml-3" />
        </Button>
      </div>
    </div>
  );

  // --- Main Layout ---

  const PHASES: OnboardingPhase[] = ['REGISTER', 'VERIFY', 'PERSONAL', 'INSTITUTION', 'SUCCESS'];
  const currentPhaseIndex = PHASES.indexOf(state.phase);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      {/* Dynamic Header */}
      <header className="h-20 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg">
            <span className="font-bold text-xl">L</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-black text-lg tracking-tight">CLEARANCE<span className="text-primary">X</span></h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Digital Onboarding</p>
          </div>
        </div>

        {/* Progress Bar (Phased) */}
        {state.phase !== 'SUCCESS' && (
          <div className="flex-1 max-w-xl mx-8 hidden md:block">
            <div className="flex justify-between mb-2">
              {PHASES.slice(0, 4).map((p, i) => (
                <span 
                  key={p} 
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest transition-colors duration-500",
                    i <= currentPhaseIndex ? "text-primary" : "text-muted-foreground/40"
                  )}
                >
                  {p}
                </span>
              ))}
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-700 ease-in-out shadow-[0_0_15px_rgba(var(--primary),0.5)]" 
                style={{ width: `${((currentPhaseIndex + 1) / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <button className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors hidden sm:block">Need help?</button>
          <div className="h-8 w-px bg-border" />
          <button className="text-sm font-bold text-primary hover:underline" onClick={() => window.location.href = '/officer-login'}>Exit</button>
        </div>
      </header>

      {/* Main Stage */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 min-h-[calc(100vh-80px)]">
        {state.phase === 'REGISTER' && renderRegister()}
        {state.phase === 'VERIFY' && renderVerify()}
        {state.phase === 'PERSONAL' && renderPersonal()}
        {state.phase === 'INSTITUTION' && renderInstitution()}
        {state.phase === 'SUCCESS' && renderSuccess()}
      </main>

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
}