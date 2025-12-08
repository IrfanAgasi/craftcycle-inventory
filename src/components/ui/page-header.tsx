import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ 
  title, 
  description, 
  icon: Icon,
  children,
  className 
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8", className)}>
      <div className="flex items-center gap-4">
        {Icon && (
          <div className="p-3 rounded-2xl bg-gradient-to-br from-y2k-pink-light to-y2k-lavender-light border-2 border-border/50 shadow-y2k">
            <Icon className="w-7 h-7 text-primary" />
          </div>
        )}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground font-space">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
      {children && (
        <div className="flex items-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
}
