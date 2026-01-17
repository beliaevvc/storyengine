'use client';

import { useCallback, useState } from 'react';
import { scanEntitiesInText, type ScanResult } from '@/core/use-cases/entity/scanEntitiesInText';
import { applyEntityMarks, clearEntityMarks } from '@/presentation/components/editor/utils';
import { useEntityStore, useEditorStore } from '@/presentation/stores';

interface UseScannerResult {
  isScanning: boolean;
  lastScanResults: ScanResult[];
  scan: () => Promise<ScanResult[]>;
  clearMarks: () => void;
}

/**
 * Hook for scanning document text for entity mentions.
 * Used by the AI Scan button in the toolbar.
 */
export function useEntityScanner(): UseScannerResult {
  const entities = useEntityStore((s) => s.entities);
  const editor = useEditorStore((s) => s.editor);
  const setActiveEntityIds = useEditorStore((s) => s.actions.setActiveEntityIds);

  const [isScanning, setIsScanning] = useState(false);
  const [lastScanResults, setLastScanResults] = useState<ScanResult[]>([]);

  const scan = useCallback(async () => {
    if (!editor) return [];

    setIsScanning(true);

    try {
      // Simulate async operation (for future real AI integration)
      await new Promise((resolve) => setTimeout(resolve, 150));

      const text = editor.getText();
      const scanner = scanEntitiesInText(entities);
      const results = scanner.execute(text);

      // Apply marks to editor
      applyEntityMarks(editor, results);

      // Update active entities in store
      const uniqueEntityIds = Array.from(new Set(results.map((r) => r.entityId)));
      setActiveEntityIds(uniqueEntityIds);

      setLastScanResults(results);
      return results;
    } finally {
      setIsScanning(false);
    }
  }, [editor, entities, setActiveEntityIds]);

  const clearMarks = useCallback(() => {
    if (!editor) return;

    clearEntityMarks(editor);
    setActiveEntityIds([]);
    setLastScanResults([]);
  }, [editor, setActiveEntityIds]);

  return { isScanning, lastScanResults, scan, clearMarks };
}
