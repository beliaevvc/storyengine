'use client';

import { FileText, Database } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/presentation/components/ui';
import { FilesTab } from './FilesTab';
import { DatabaseTab } from './DatabaseTab';
import { useUIStore } from '@/presentation/stores';

export function ProjectExplorer() {
  const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.actions.setActiveTab);

  return (
    <div className="h-full flex flex-col">
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as 'files' | 'database')}
        className="h-full flex flex-col"
      >
        <TabsList>
          <TabsTrigger value="files" className="gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            Files
          </TabsTrigger>
          <TabsTrigger value="database" className="gap-1.5">
            <Database className="w-3.5 h-3.5" />
            Database
          </TabsTrigger>
        </TabsList>
        <TabsContent value="files" className="flex-1">
          <FilesTab />
        </TabsContent>
        <TabsContent value="database" className="flex-1">
          <DatabaseTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
