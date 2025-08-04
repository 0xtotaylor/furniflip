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
import { Autopilot } from './autopilot';
import * as Sentry from '@sentry/nextjs';
import { useRouter } from 'next/navigation';
import { getPlatforms } from '@/lib/dashboard/actions';
import { SkeletonLoader } from '@/components/ui/skeleton';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function AutopilotTable() {
  const router = useRouter();
  const [platforms, setPlatforms] = useState<string[]>([]);
  const { data, error, mutate } = useSWR('/api/automations', fetcher);

  const automations = data?.automations || [];
  const totalAutomations = data?.totalAutomations || 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedPlatforms] = await Promise.all([getPlatforms()]);
        setPlatforms(fetchedPlatforms ?? []);
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
        <CardTitle>Autopilot</CardTitle>
        <CardDescription>
          Put your sales on autopilot – we'll create and manage your listings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {totalAutomations > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[10%] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead className="w-[20%]">Item</TableHead>
                <TableHead className="hidden w-[10%] md:table-cell">
                  Platforms
                </TableHead>
                <TableHead className="hidden w-[10%] md:table-cell">
                  Stage
                </TableHead>
                <TableHead className="w-[15%]">Highest Offer</TableHead>
                <TableHead className="hidden w-[15%] md:table-cell">
                  Conversations
                </TableHead>
                <TableHead className="hidden w-[15%] md:table-cell">
                  Last Interaction
                </TableHead>
                <TableHead className="w-[5%]">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {automations.map((automation: any) => (
                <Autopilot
                  key={automation.id}
                  automation={automation}
                  platforms={platforms}
                  mutate={mutate}
                />
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-4">
            No autopilot listings available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
