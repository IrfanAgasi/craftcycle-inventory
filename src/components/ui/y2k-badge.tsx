import { cn } from '@/lib/utils';

interface Y2KBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'pink' | 'teal' | 'lavender' | 'mint' | 'orange' | 'warning' | 'danger' | 'success';
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles = {
  default: 'bg-muted text-muted-foreground border-border',
  pink: 'bg-y2k-pink-light/50 text-y2k-pink border-y2k-pink/30',
  teal: 'bg-y2k-teal-light/50 text-y2k-teal border-y2k-teal/30',
  lavender: 'bg-y2k-lavender-light/50 text-y2k-purple border-y2k-lavender/50',
  mint: 'bg-y2k-mint/30 text-success border-y2k-mint',
  orange: 'bg-orange-100 text-orange-600 border-orange-300',
  warning: 'bg-y2k-yellow/30 text-y2k-orange border-y2k-orange/30',
  danger: 'bg-destructive/20 text-destructive border-destructive/30',
  success: 'bg-success/20 text-success border-success/30',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

export function Y2KBadge({
  children,
  variant = 'default',
  size = 'sm',
  className
}: Y2KBadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full font-medium border",
      variantStyles[variant],
      sizeStyles[size],
      className
    )}>
      {children}
    </span>
  );
}
