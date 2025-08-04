'use client';

import { Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { useApp } from '@/context/AppProvider';

export function SearchInput() {
  const pathname = usePathname();
  const { searchQuery, setSearchQuery } = useApp();

  return (
    <div className="relative ml-auto flex-1 md:grow-0">
      <Search className="absolute left-2.5 top-[.75rem] h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        value={searchQuery}
        placeholder="Search..."
        disabled={pathname !== '/dashboard/inventory'}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
      />
    </div>
  );
}
