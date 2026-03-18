import React, { useState } from 'react';
import { 
  Mail, ArrowLeft, ArrowRight, Lock, 
  CheckCircle2, Loader2, ShieldCheck
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';

export default function ForgotPassword() {
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token');
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isReset, setIsReset] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/accounts/forgot-password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error("Request failed");
      setIsSent(true);
      toast.success("Reset link sent to your email!");
    } catch (err) {
      toast.error("Could not process request. Please check your email address.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/accounts/reset-password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: newPassword }),
      });
      if (!response.ok) throw new Error("Reset failed");
      setIsReset(true);
      toast.success("Password reset successfully!");
    } catch (err) {
      toast.error("Invalid or expired token.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isReset) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="h-20 w-20 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Password Reset</h2>
        <p className="text-muted-foreground mt-2">Your password has been updated successfully. You can now log in with your new password.</p>
        <Button className="mt-8 h-12 px-8" onClick={() => window.location.href = '/officer-login'}>Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <div className="text-center">
          <div className="h-16 w-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-bold text-foreground">{token ? 'Set New Password' : 'Forgot Password?'}</h1>
          <p className="text-muted-foreground mt-2">
            {token ? 'Enter your new secure password below.' : 'No worries! Enter your email and we\'ll send you a reset link.'}
          </p>
        </div>

        <Card className="border-border shadow-2xl">
          {token ? (
            <form onSubmit={handleResetPassword}>
              <CardContent className="pt-8 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">New Password</label>
                  <Input 
                    required
                    type="password"
                    placeholder="••••••••" 
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Confirm New Password</label>
                  <Input 
                    required
                    type="password"
                    placeholder="••••••••" 
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="pt-4 pb-8">
                <Button className="w-full h-12 font-bold" disabled={isLoading}> 
                  {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Reset Password"}
                </Button>
              </CardFooter>
            </form>
          ) : !isSent ? (
            <form onSubmit={handleRequestReset}>
              <CardContent className="pt-8 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input 
                      required
                      type="email"
                      className="pl-10"
                      placeholder="name@university.edu.ng" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-4 pb-8">
                <Button className="w-full h-12 font-bold" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Send Reset Link"}
                </Button>
              </CardFooter>
            </form>
          ) : (
            <CardContent className="pt-8 pb-12 text-center space-y-6">
              <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Mail size={32} className="animate-bounce" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg">Check your inbox</h3>
                <p className="text-muted-foreground mt-2">
                  We've sent a password reset link to <span className="font-bold text-foreground">{email}</span>.
                </p>
              </div>
              <Button variant="outline" className="w-full h-12" onClick={() => setIsSent(false)}>
                Try another email
              </Button>
            </CardContent>
          )}
        </Card>

        <div className="text-center pt-4">
          <button 
            onClick={() => window.location.href = '/officer-login'} 
            className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} /> Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
