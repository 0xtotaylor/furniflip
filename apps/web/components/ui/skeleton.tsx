'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useApp } from '@/context/AppProvider';
import { cva, type VariantProps } from 'class-variance-authority';

const skeletonLoaderVariants = cva('animate-pulse bg-slate-200 rounded', {
  variants: {
    variant: {
      default: 'bg-slate-200'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

export interface SkeletonLoaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonLoaderVariants> {
  rows?: number;
}

const SkeletonLoader = React.forwardRef<HTMLDivElement, SkeletonLoaderProps>(
  ({ className, variant, rows = 5, ...props }, ref) => {
    const { cn } = useApp();
    return (
      <Card ref={ref} {...props}>
        <CardHeader>
          <CardTitle>
            <div
              className={cn(skeletonLoaderVariants({ variant }), 'w-24 h-6')}
            />
          </CardTitle>
          <CardDescription
            className={cn(skeletonLoaderVariants({ variant }), 'w-64 h-4')}
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <div
                    className={cn(
                      skeletonLoaderVariants({ variant }),
                      'w-16 h-4'
                    )}
                  />
                </TableHead>
                <TableHead>
                  <div
                    className={cn(
                      skeletonLoaderVariants({ variant }),
                      'w-8 h-4'
                    )}
                  />
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <div
                    className={cn(
                      skeletonLoaderVariants({ variant }),
                      'w-16 h-4'
                    )}
                  />
                </TableHead>
                <TableHead>
                  <div
                    className={cn(
                      skeletonLoaderVariants({ variant }),
                      'w-8 h-4'
                    )}
                  />
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <div
                    className={cn(
                      skeletonLoaderVariants({ variant }),
                      'w-16 h-4'
                    )}
                  />
                </TableHead>
                <TableHead>
                  <div
                    className={cn(
                      skeletonLoaderVariants({ variant }),
                      'w-16 h-4'
                    )}
                  />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array(rows)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="hidden sm:table-cell">
                      <div
                        className={cn(
                          skeletonLoaderVariants({ variant }),
                          'w-16 h-16'
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <div
                        className={cn(
                          skeletonLoaderVariants({ variant }),
                          'w-20 h-4'
                        )}
                      />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div
                        className={cn(
                          skeletonLoaderVariants({ variant }),
                          'w-16 h-4'
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <div
                        className={cn(
                          skeletonLoaderVariants({ variant }),
                          'w-5 h-5 rounded-full'
                        )}
                      />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div
                        className={cn(
                          skeletonLoaderVariants({ variant }),
                          'w-24 h-4'
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <div
                        className={cn(
                          skeletonLoaderVariants({ variant }),
                          'w-8 h-8 rounded-full'
                        )}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }
);

SkeletonLoader.displayName = 'SkeletonLoader';

export { SkeletonLoader, skeletonLoaderVariants };
