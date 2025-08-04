'use client';

import posthog from 'posthog-js';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useModal } from '@/components/ui/modal';

export function ModalTrigger() {
  const { openModal } = useModal();

  return (
    <Button
      onClick={() => {
        posthog.capture('create_catalog', { component: 'nav' });
        openModal();
      }}
      size="sm"
      className="h-8 gap-1"
    >
      <PlusCircle className="h-3.5 w-3.5" />
      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
        Create Catalog
      </span>
    </Button>
  );
}
