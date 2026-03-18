import React from 'react';
import { Loader2, Moon, Sun, CheckCircle, XCircle, Clock, AlertCircle, ChevronRight } from 'lucide-react';

export const Card: React.FC<{ children: React.ReactNode, className?: string, onClick?: (e: React.MouseEvent) => void, style?: React.CSSProperties }> = ({ children, className = '', onClick, style }) => (
  <div
    onClick={onClick}
    style={style}
    className={`bg-card text-card-foreground rounded-2xl border border-border shadow-sm p-6 ${className}`}
  >
    {children}
  </div>
);

export const Button: React.FC<{
  children: React.ReactNode,
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success',
  size?: 'sm' | 'md' | 'lg',
  className?: string,
  onClick?: (e: any) => void,
  disabled?: boolean,
  type?: 'button' | 'submit' | 'reset',
  title?: string,
  style?: React.CSSProperties
}> = ({ children, variant = 'primary', size = 'md', className = '', onClick, disabled, type = 'button', title, style }) => {
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-border bg-background hover:bg-accent hover:text-accent-foreground',
    danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700'
  };
  
  const sizes = {
    sm: 'h-9 px-3 text-xs',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8'
  };

  return (
    <button
      type={type}
      title={title}
      style={style}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export const ThemeToggle = () => {
    const [theme, setTheme] = React.useState<'light' | 'dark'>(
        document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    );

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-accent text-muted-foreground transition-colors"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
    );
};

export const StatusBadge: React.FC<{ status: string, className?: string, size?: 'sm' | 'md' }> = ({ status, className = '', size = 'md' }) => {
  const config: Record<string, { label: string, icon: any, color: string }> = {
    approved: { label: 'Approved', icon: CheckCircle, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    rejected: { label: 'Rejected', icon: XCircle, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    pending: { label: 'Pending', icon: Clock, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    empty: { label: 'Not Started', icon: AlertCircle, color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
    in_progress: { label: 'In Progress', icon: Clock, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  };

  const c = config[status.toLowerCase()] || config.empty;
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';

  return (
    <div className={`inline-flex items-center gap-1.5 font-bold uppercase rounded-full ${c.color} ${sizeClass} ${className}`}>
        <c.icon size={size === 'sm' ? 12 : 14} />
        {c.label}
    </div>
  );
};

export const Badge: React.FC<{ status: string, className?: string }> = ({ status, className = '' }) => (
    <StatusBadge status={status} className={className} size="sm" />
);

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-muted rounded ${className}`} />
);

export const LoadingSpinner: React.FC<{ variant?: 'default' | 'full-page' | 'button', text?: string }> = ({ variant = 'default', text }) => {
    if (variant === 'full-page') {
        return (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                {text && <p className="text-sm font-medium text-muted-foreground">{text}</p>}
            </div>
        );
    }

    if (variant === 'button') {
        return <Loader2 className="h-4 w-4 animate-spin" />;
    }

    return <Loader2 className="h-6 w-6 text-primary animate-spin" />;
};

export const PageHeader: React.FC<{ title: string, breadcrumbs?: string[], actions?: React.ReactNode, onBreadcrumbClick?: (i: number) => void }> = ({ title, breadcrumbs, actions, onBreadcrumbClick }) => (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
            {breadcrumbs && (
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
                    {breadcrumbs.map((b, i) => (
                        <React.Fragment key={i}>
                            <button
                                onClick={() => onBreadcrumbClick?.(i)}
                                className={`hover:text-primary transition-colors ${i === breadcrumbs.length - 1 ? 'text-primary' : ''}`}
                            >
                                {b}
                            </button>
                            {i < breadcrumbs.length - 1 && <ChevronRight size={10} />}
                        </React.Fragment>
                    ))}
                </div>
            )}
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{title}</h1>
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
);
