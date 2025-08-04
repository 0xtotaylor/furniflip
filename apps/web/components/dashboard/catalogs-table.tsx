'use client';

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
import { Catalog } from './catalog';
import { useRouter } from 'next/navigation';
import { SkeletonLoader } from '@/components/ui/skeleton';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function CatalogsTable() {
  const router = useRouter();
  const { data, error, mutate } = useSWR('/api/catalogs', fetcher);

  const catalogs = data?.catalogs || [];
  const totalCatalogs = data?.totalCatalogs || 0;

  if (!data) return <SkeletonLoader />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Catalogs</CardTitle>
        <CardDescription>
          Organize, track, and share your catalogs and their items.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {totalCatalogs > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead className="hidden md:table-cell">ID</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {catalogs.map((catalog: any) => (
                <Catalog key={catalog.id} catalog={catalog} mutate={mutate} />
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-4">No catalogs available</div>
        )}
      </CardContent>
    </Card>
  );
}
