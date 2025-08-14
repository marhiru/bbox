import { useState, useCallback, useMemo } from 'react';
import { EntryWithMeta, updateEntryHoverState } from '../annotator.helpers';
import { createNewEntry, processEntriesForChange } from '../annotator.helpers';
import { Rectangle } from '../annotator-context';
import { useAnnotator } from '../annotator-context';

export function useEntriesManager(multiplier: number, onChange: (entries: any[]) => void) {
  const [entries, setEntries] = useState<EntryWithMeta[]>([]);
  const { maxSelections } = useAnnotator();

  const totalSelections = useMemo(() => entries.length, [entries]);

  const canAddSelection = useMemo(() => {
    if (maxSelections === undefined) return true;
    return totalSelections < maxSelections;
  }, [totalSelections, maxSelections]);

  const handleEntriesChange = useCallback(
    (newEntries: EntryWithMeta[]) => {
      const processedEntries = processEntriesForChange(newEntries, multiplier);
      onChange(processedEntries);
    },
    [multiplier, onChange]
  );

  const createAndAddEntry = useCallback(
    (entryRect: Rectangle, entryLabel: string) => {
      if (!entryRect) return;

      if (!canAddSelection) {
        console.warn(`Limite de seleções atingido (${totalSelections}/${maxSelections})`);
        return null;
      }

      const newEntry = createNewEntry(entryRect, entryLabel);
      const newEntries = [...entries, newEntry];
      setEntries(newEntries);
      handleEntriesChange(newEntries);
      return newEntries;
    },
    [entries, handleEntriesChange, canAddSelection, totalSelections, maxSelections]
  );

  const removeEntry = useCallback(
    (id: string) => {
      const newEntries = entries.filter(entry => entry.id !== id);
      setEntries(newEntries);
      handleEntriesChange(newEntries);
    },
    [entries, handleEntriesChange]
  );

  const resetEntries = useCallback(() => {
    setEntries([]);
    handleEntriesChange([]);
  }, [handleEntriesChange]);

  const updateEntryHover = useCallback((id: string, show: boolean) => {
    setEntries((prev) => updateEntryHoverState(prev, id, show));
  }, []);

  return {
    entries,
    totalSelections, // Adicionado: total de seleções atuais
    canAddSelection, // Adicionado: se pode adicionar mais seleções
    maxSelections,  // Adicionado: limite máximo de seleções
    updateEntryHover,
    createAndAddEntry,
    removeEntry,
    resetEntries,
    setEntries,
  };
}