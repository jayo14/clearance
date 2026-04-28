import React, { useState } from 'react';
import { Mail, ArrowLeft, Loader2, CheckCircle, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card } from '../components/UI';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        const response = await fetch('/api/accounts/forgot-password/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        if (response.ok) setIsSent(true);
    } catch (err) {
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft size={16} /> Back to Login
        </Link>

        {isSent ? (
            <div className="text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} />
                </div>
                <h2 className="text-2xl font-black mb-2">Check your email</h2>
                <p className="text-muted-foreground mb-8">
                    We've sent a password reset link to <span className="font-bold text-foreground">{email}</span>.
                </p>
                <Button variant="outline" className="w-full" onClick={() => setIsSent(false)}>
                    Didn't receive it? Try again
                </Button>
            </div>
        ) : (
            <>
                <div className="mb-8">
                    <h1 className="text-3xl font-black tracking-tight mb-2">Forgot Password?</h1>
                    <p className="text-muted-foreground font-medium">No worries, it happens. Enter your email and we'll send you a reset link.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input
                                type="email"
                                required
                                placeholder="name@university.edu"
                                className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-12 shadow-lg shadow-primary/20" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Send Reset Link'}
                    </Button>
                </form>
            </>
        )}
      </Card>
    </div>
  );
}
