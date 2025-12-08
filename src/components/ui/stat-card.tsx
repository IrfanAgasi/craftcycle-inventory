import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  variant?: 'default' | 'pink' | 'teal' | 'lavender' | 'mint' | 'warning' | 'danger';
  className?: string;
}

const variantStyles = {
  default: 'from-card to-muted/30 border-border/50',
  pink: 'from-y2k-pink-light/40 to-y2k-pink-light/10 border-y2k-pink/30',
  teal: 'from-y2k-teal-light/40 to-y2k-teal-light/10 border-y2k-teal/30',
  lavender: 'from-y2k-lavender-light/40 to-y2k-lavender-light/10 border-y2k-lavender/30',
  mint: 'from-y2k-mint/40 to-y2k-mint/10 border-y2k-mint',
  warning: 'from-y2k-yellow/40 to-y2k-yellow/10 border-y2k-orange/30',
  danger: 'from-destructive/20 to-destructive/5 border-destructive/30',
};

const iconStyles = {
  default: 'bg-muted text-muted-foreground',
  pink: 'bg-y2k-pink/20 text-y2k-pink',
  teal: 'bg-y2k-teal/20 text-y2k-teal',
  lavender: 'bg-y2k-lavender/30 text-y2k-purple',
  mint: 'bg-y2k-mint/30 text-success',
  warning: 'bg-y2k-yellow/30 text-y2k-orange',
  danger: 'bg-destructive/20 text-destructive',
};

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  variant = 'default',
  className 
}: StatCardProps) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl border-2 p-5",
      "bg-gradient-to-br backdrop-blur-sm",
      "transition-all duration-300 hover:shadow-y2k hover:scale-[1.02]",
      variantStyles[variant],
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground font-space">{value}</p>
          {trend && (
            <p className={cn(
              "text-xs font-medium",
              trend.value >= 0 ? "text-success" : "text-destructive"
            )}>
              {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
            </p>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-xl",
          iconStyles[variant]
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      {/* Decorative element */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-2xl" />
    </div>
  );
}
