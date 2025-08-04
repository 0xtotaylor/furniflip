import { Suspense } from 'react';
import { ModalTrigger } from '@/components/ui/modal-trigger';
import { ExportTrigger } from '@/components/ui/export-trigger';
import { AutopilotTable } from '@/components/dashboard/autopilot-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AutopilotPage() {
  return (
    <Suspense>
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList className="mt-2">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="facebook">Facebook</TabsTrigger>
            <TabsTrigger value="craigslist">Craigslist</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <ExportTrigger source={'automations'} />
            <ModalTrigger />
          </div>
        </div>
        <TabsContent value="all">
          <AutopilotTable />
        </TabsContent>
      </Tabs>
    </Suspense>
  );
}
