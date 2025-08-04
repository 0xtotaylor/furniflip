'use client';

import useSWR from 'swr';
import * as XLSX from 'xlsx';
import posthog from 'posthog-js';
import { File } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ExportTrigger({
  source
}: {
  source: 'products' | 'catalogs' | 'automations';
}) {
  const { data: productsData } = useSWR(`/api/listings`, fetcher);
  const { data: catalogsData } = useSWR(`/api/catalogs`, fetcher);
  const { data: automationData } = useSWR(`/api/automations`, fetcher);

  const products = productsData?.listings || [];
  const catalogs = catalogsData?.catalogs || [];
  const automations = automationData?.automations || [];

  const data =
    source === 'products'
      ? products
      : source === 'catalogs'
        ? catalogs
        : automations;
  const name =
    source === 'products'
      ? 'furniture'
      : source === 'catalogs'
        ? 'catalogs'
        : 'automations';

  function exportData() {
    if (data && Array.isArray(data)) {
      const dataToExport = data.map((item: any) => {
        const baseFields = {
          id: item.id,
          created: new Date(item.created_at).toLocaleDateString()
        };

        if (source === 'products') {
          return {
            ...baseFields,
            status: item.status,
            item: item.title,
            price: item.price,
            category: item.category,
            condition: item.condition,
            image: item.image_url
          };
        } else if (source === 'catalogs') {
          return {
            ...baseFields,
            status: item.status,
            url: `https://docs.google.com/presentation/d/${item.presentation_id}`
          };
        } else {
          return {
            ...baseFields,
            stage: item.stage,
            highestOffer: item.offer,
            conversations: item.conversations ? item.conversations : 0,
            lastInteraction: item.last_interaction
              ? new Date(item.last_interaction).toLocaleString()
              : 'N/A'
          };
        }
      });

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      XLSX.utils.book_append_sheet(workbook, worksheet, name);

      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });

      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${name}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
    }
  }

  return (
    <Button
      onClick={() => {
        posthog.capture(`export_${source}`, { component: 'nav' });
        exportData();
      }}
      size="sm"
      variant="outline"
      className="h-8 gap-1"
    >
      <File className="h-3.5 w-3.5" />
      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
        Export
      </span>
    </Button>
  );
}
