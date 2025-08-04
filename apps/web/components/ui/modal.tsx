'use client';

import React, { createContext, useContext, useState } from 'react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import * as Dialog from '@radix-ui/react-dialog';
import { useApp } from '@/context/AppProvider';

interface ModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

interface ModalProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export const Modal: React.FC<ModalProps> = ({
  children,
  title,
  description
}) => {
  const { isOpen, closeModal } = useModal();

  return (
    <Dialog.Root open={isOpen} onOpenChange={closeModal}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50" />
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
          <Dialog.Content
            className="relative w-full transform overflow-hidden rounded-lg bg-white p-4 text-left shadow-xl transition-all 
            max-w-[calc(100%-2rem)] 
            sm:max-w-lg sm:p-6 
            md:max-w-2xl 
            lg:max-w-4xl 
            xl:max-w-4xl"
          >
            <VisuallyHidden>
              <Dialog.Title>{title}</Dialog.Title>
            </VisuallyHidden>
            {description && (
              <Dialog.Description className="sr-only">
                {description}
              </Dialog.Description>
            )}
            {children}
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export const ModalContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { cn } = useApp();
  return <div ref={ref} className={cn('w-full', className)} {...props} />;
});
ModalContent.displayName = 'ModalContent';
