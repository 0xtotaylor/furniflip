'use client';

import { PhotoProvider } from 'react-photo-view';
import { ModalProvider } from '@/components/ui/modal';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PhotoProvider>
      <ModalProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </ModalProvider>
    </PhotoProvider>
  );
}
