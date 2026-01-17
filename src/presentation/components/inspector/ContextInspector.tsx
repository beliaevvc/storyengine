'use client';

import { ActiveEntities } from './ActiveEntities';
import { AIChatPlaceholder } from './AIChatPlaceholder';

export function ContextInspector() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <ActiveEntities />
      </div>
      <div className="h-64 flex-shrink-0">
        <AIChatPlaceholder />
      </div>
    </div>
  );
}
