'use client';

import * as React from 'react';
import { useApp } from '@/context/AppProvider';

export interface SettingsSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

const SettingsSection = React.forwardRef<HTMLDivElement, SettingsSectionProps>(
  ({ title, description, children, className, ...props }, ref) => {
    const { cn } = useApp();
    return (
      <div
        className={cn(
          'grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8',
          className
        )}
        ref={ref}
        {...props}
      >
        <div>
          <h2 className="text-base font-semibold leading-7">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        {children}
      </div>
    );
  }
);

SettingsSection.displayName = 'SettingsSection';

export { SettingsSection };
