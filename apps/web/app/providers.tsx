'use client';

import { Toaster } from 'react-hot-toast';
import { AppProvider } from '@/context/AppProvider';
import { SupabaseProvider } from '@/context/SupabaseProvider';
import { CSPostHogProvider } from '@/context/CSPostHogProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseProvider>
      <CSPostHogProvider>
        <AppProvider>
          {children}
          <Toaster position="top-right" reverseOrder={false} />
        </AppProvider>
      </CSPostHogProvider>
    </SupabaseProvider>
  );
}
