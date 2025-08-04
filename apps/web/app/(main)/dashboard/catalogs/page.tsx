import { Suspense } from 'react';
import { ModalTrigger } from '@/components/ui/modal-trigger';
import { ExportTrigger } from '@/components/ui/export-trigger';
import { CatalogsTable } from '@/components/dashboard/catalogs-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CatalogsPage() {
  return (
    <Suspense>
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList className="mt-2">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="sold">Sold</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <ExportTrigger source={'catalogs'} />
            <ModalTrigger />
          </div>
        </div>
        <TabsContent value="all">
          <CatalogsTable />
        </TabsContent>
      </Tabs>
    </Suspense>
  );
}
