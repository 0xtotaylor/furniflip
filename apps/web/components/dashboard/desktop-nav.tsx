'use client';

import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { NavItem } from './nav-item';
import { useSupabase } from '@/context/SupabaseProvider';
import { Settings, Tag, LibraryBig, Bot } from 'lucide-react';

export function DesktopNav() {
  const {
    catalogAlert,
    autopilotAlert,
    clearCatalogAlert,
    clearAutopilotAlert
  } = useSupabase();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <img
          className="h-10 w-10 transition-all group-hover:scale-110"
          src="/logos/logo.svg"
          alt=""
        />

        <NavItem href="/dashboard/inventory" label="Inventory">
          <Tag className="h-5 w-5" />
        </NavItem>

        <NavItem
          href="/dashboard/catalogs"
          label="Catalogs"
          alert={catalogAlert}
          onClick={clearCatalogAlert}
        >
          <LibraryBig className="h-5 w-5" />
        </NavItem>

        <NavItem
          href="/dashboard/autopilot"
          label="Autopilot"
          alert={autopilotAlert}
          onClick={clearAutopilotAlert}
        >
          <Bot className="h-5 w-5" />
        </NavItem>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/dashboard/settings"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
}
