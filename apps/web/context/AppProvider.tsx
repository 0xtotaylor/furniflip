import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode
} from 'react';
import { twMerge } from 'tailwind-merge';
import { type ClassValue, clsx } from 'clsx';

interface Product {
  [key: string]: any;
}

interface AppContextType {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  filterProducts: (products: Product[]) => Product[];
  cn: (...inputs: ClassValue[]) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filterProducts = useMemo(() => {
    return (products: Product[]): Product[] => {
      if (!searchQuery.trim()) return products;
      const lowercaseQuery = searchQuery.toLowerCase();
      return products.filter((product) =>
        Object.values(product).some(
          (value) =>
            typeof value === 'string' &&
            value.toLowerCase().includes(lowercaseQuery)
        )
      );
    };
  }, [searchQuery]);

  const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
  };

  const value: AppContextType = {
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    filterProducts,
    cn
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
