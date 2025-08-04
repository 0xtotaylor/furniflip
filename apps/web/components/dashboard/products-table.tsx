'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  getCategories,
  getConditions,
  getStatuses
} from '@/lib/dashboard/actions';
import { Product } from './product';
import * as Sentry from '@sentry/nextjs';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppProvider';
import { SkeletonLoader } from '@/components/ui/skeleton';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ProductsTable() {
  const router = useRouter();
  const { filterProducts } = useApp();
  const [statuses, setStatuses] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const { data, error, mutate } = useSWR('/api/listings', fetcher);

  const products = data?.listings || [];
  const totalProducts = data?.totalListings || 0;
  const filteredProducts = filterProducts(products);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedStatuses, fetchedCategories, fetchedConditions] =
          await Promise.all([getStatuses(), getCategories(), getConditions()]);
        setStatuses(fetchedStatuses ?? []);
        setCategories(fetchedCategories ?? []);
        setConditions(fetchedConditions ?? []);
      } catch (error) {
        Sentry.captureException(error);
      }
    };
    fetchData();
  }, []);

  if (!data) return <SkeletonLoader />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory</CardTitle>
        <CardDescription>
          Streamline furniture management and your inventory.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {totalProducts > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Item</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">
                  Condition
                </TableHead>
                <TableHead className="relative hidden md:table-cell overflow-hidden">
                  <div className="relative z-10 flex items-center justify-center h-full">
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-400 animate-pulse">
                      Autopilot
                    </span>
                  </div>
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product: any) => (
                <Product
                  key={product.id}
                  product={product}
                  statuses={statuses}
                  categories={categories}
                  conditions={conditions}
                  mutate={mutate}
                />
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-4">No inventory available</div>
        )}
      </CardContent>
    </Card>
  );
}
