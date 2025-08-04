'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PanelLeft, Bot, Tag, LibraryBig } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const handleLinkClick = () => {
    setOpen(false);
  };

  const navItems = [
    { href: '/dashboard/inventory', icon: Tag, label: 'Inventory' },
    { href: '/dashboard/catalogs', icon: LibraryBig, label: 'Catalogs' },
    { href: '/dashboard/autopilot', icon: Bot, label: 'Autopilot' }
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        title="Mobile navigation"
        description="Navigation menu for mobile devices"
        side="left"
        className="sm:max-w-xs"
      >
        <nav className="grid gap-6 text-lg font-medium">
          <img
            className="h-10 w-10 transition-all group-hover:scale-110"
            src="/logos/logo.svg"
            alt=""
          />
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-2.5 ${
                pathname === item.href
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={handleLinkClick}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
