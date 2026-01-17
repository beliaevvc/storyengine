import type { Entity, EntityType } from '../../entities/entity';

export interface ScanResult {
  entityId: string;
  entityName: string;
  entityType: EntityType;
  startIndex: number;
  endIndex: number;
}

/**
 * Scans text for entity mentions (names and aliases).
 * Returns positions of all found entities in the text.
 */
export const scanEntitiesInText = (entities: Entity[]) => ({
  execute(text: string): ScanResult[] {
    const results: ScanResult[] = [];

    // Sort by name length (longer first) to avoid partial matches
    const sortedEntities = [...entities].sort(
      (a, b) => b.name.length - a.name.length
    );

    for (const entity of sortedEntities) {
      const namesToSearch = [
        entity.name,
        ...((entity.attributes as { aliases?: string[] })?.aliases || []),
      ];

      for (const name of namesToSearch) {
        if (!name) continue;

        const regex = new RegExp(`\\b${escapeRegex(name)}\\b`, 'gi');
        let match;

        while ((match = regex.exec(text)) !== null) {
          // Check for overlapping matches
          const isOverlapping = results.some(
            (r) => match!.index >= r.startIndex && match!.index < r.endIndex
          );

          if (!isOverlapping) {
            results.push({
              entityId: entity.id,
              entityName: entity.name,
              entityType: entity.type,
              startIndex: match.index,
              endIndex: match.index + match[0].length,
            });
          }
        }
      }
    }

    // Sort by position in text
    return results.sort((a, b) => a.startIndex - b.startIndex);
  },
});

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
