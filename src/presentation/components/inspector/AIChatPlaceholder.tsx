'use client';

import { Bot, Send } from 'lucide-react';
import { Button, Input } from '@/presentation/components/ui';
import { PanelHeader } from '@/presentation/components/layout';

export function AIChatPlaceholder() {
  return (
    <div className="flex flex-col h-full border-t border-border">
      <PanelHeader title="AI Assistant" icon={Bot} />
      <div className="flex-1 p-4 flex items-center justify-center">
        <div className="text-center text-fg-muted">
          <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium">AI Assistant</p>
          <p className="text-xs mt-1">Coming soon</p>
        </div>
      </div>
      <div className="p-2 border-t border-border">
        <div className="flex gap-2">
          <Input
            placeholder="Ask about your story..."
            disabled
            className="text-xs h-8"
          />
          <Button variant="secondary" size="icon" disabled className="h-8 w-8">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
