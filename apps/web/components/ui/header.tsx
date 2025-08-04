'use client';

import Link from 'next/link';
import * as React from 'react';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppProvider';

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {}

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className, ...props }, ref) => {
    const { cn } = useApp();
    const pathname = usePathname();

    return (
      <header
        ref={ref}
        className={cn('absolute inset-x-0 top-0 z-50', className)}
        {...props}
      >
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 lg:px-8"
        >
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">FurniFlip</span>
              <img
                alt="Company Logo"
                src="/logos/logo.svg"
                className="h-8 w-auto"
              />
            </Link>
          </div>
          {pathname === '/' && (
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <Link
                href="/login"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Log in <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          )}
        </nav>
      </header>
    );
  }
);

Header.displayName = 'Header';

export { Header };
