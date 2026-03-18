import React, { useState, useEffect } from 'react';
import { 
  User, CheckCircle2, ArrowRight, Award, Lock, 
  Smartphone, Loader2, FileBadge, Mail, ShieldCheck
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';

export default function OfficerOnboarding() {
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    qualifications: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    // Simulate token verification
    const verifyToken = () => {
      setTimeout(() => {
        if (token) {
          setIsValid(true);
        }
        setIsVerifying(false);
      }, 1500);
    };
    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/accounts/onboard-officer/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
          qualifications: formData.qualifications,
          phone: formData.phone,
        }),
      });

      if (!response.ok) throw new Error("Onboarding failed");
      
      toast.success("Account setup complete!");
      setIsSuccess(true);
    } catch (err) {
      toast.error("Could not complete setup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-medium">Verifying invitation link...</p>
      </div>
    );
  }

  if (!isValid && !isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="h-20 w-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6">
          <Lock size={40} />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Invalid Invitation</h2>
        <p className="text-muted-foreground mt-2 max-w-md">
          This invitation link is invalid or has expired. Please contact your institutional administrator for a new link.
        </p>
        <Button className="mt-8" onClick={() => window.location.href = '/officer-login'}>Return to Login</Button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="h-24 w-24 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 rounded-3xl flex items-center justify-center mb-8 shadow-inner border border-emerald-500/20">
          <CheckCircle2 size={48} className="animate-bounce" />
        </div>
        <h2 className="text-3xl font-black text-foreground">Setup Complete!</h2>
        <p className="text-muted-foreground mt-4 max-w-md mx-auto text-lg">
          Your officer profile has been successfully created. You can now sign in to your dashboard.
        </p>
        <Button size="lg" className="mt-10 h-14 px-12 font-black text-lg" onClick={() => window.location.href = '/officer-login'}>
          Go to Sign In <ArrowRight className="ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 md:py-20 px-6">
      <div className="max-w-xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <div className="text-center">
          <div className="h-16 w-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Officer Account Setup</h1>
          <p className="text-muted-foreground mt-2">Complete your profile to access the clearance portal.</p>
        </div>

        <Card className="border-border shadow-2xl">
          <form onSubmit={handleSubmit}>
            <CardContent className="pt-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">First Name</label>
                  <Input 
                    required
                    placeholder="e.g. Michael" 
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Last Name</label>
                  <Input 
                    required
                    placeholder="e.g. Sarah" 
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Educational Qualifications</label>
                <div className="relative">
                  <Award size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    required
                    className="pl-10"
                    placeholder="e.g. PhD in Computer Science, Masters in Admin" 
                    value={formData.qualifications}
                    onChange={e => setFormData({ ...formData, qualifications: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Phone Number (Optional)</label>
                <div className="relative">
                  <Smartphone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    className="pl-10"
                    placeholder="+234 ..." 
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="h-px bg-border my-2" />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Create Password</label>
                  <Input 
                    required
                    type="password"
                    placeholder="••••••••" 
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Confirm Password</label>
                  <Input 
                    required
                    type="password"
                    placeholder="••••••••" 
                    value={formData.confirmPassword}
                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 border-t border-border mt-4">
              <Button className="w-full h-12 text-lg font-bold" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Complete Setup"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
