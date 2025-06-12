import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  title: string;
  icon?: LucideIcon;
  className?: string;
}

export function SectionTitle({ title, icon: Icon, className }: SectionTitleProps) {
  return (
    <div className={cn("flex items-center mb-6", className)}>
      {Icon && <Icon className="h-7 w-7 mr-3 text-accent drop-shadow-neon-accent" />}
      <h2 className="text-3xl font-headline font-semibold text-foreground">
        {title}
      </h2>
    </div>
  );
}
