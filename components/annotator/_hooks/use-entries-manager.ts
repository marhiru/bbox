import { useState, useCallback } from 'react';
import { EntryWithMeta, updateEntryHoverState } from '../annotator.helpers';
import { createNewEntry, processEntriesForChange } from '../annotator.helpers';
import { Rectangle } from '../annotator-context';

export function useEntriesManager(multiplier: number, onChange: (entries: any[]) => void) {
  const [entries, setEntries] = useState<EntryWithMeta[]>([]);

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

      const newEntry = createNewEntry(entryRect, entryLabel);
      const newEntries = [...entries, newEntry];
      setEntries(newEntries);
      handleEntriesChange(newEntries);
      return newEntries;
    },
    [entries, handleEntriesChange]
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
    updateEntryHover,
    createAndAddEntry,
    removeEntry,
    resetEntries,
    setEntries,
  };
}