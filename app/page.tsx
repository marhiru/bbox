"use client";

import Annotator from "@/components/annotator/annotator";
import { EntryType } from "@/components/annotator/annotator.helpers";
import Example from "@/components/example";
import Link from "next/link";
import { useState, useCallback } from "react";

export default function Home() {
  const labels = ["Mama cow", "Baby cow"];
  const [entries, setEntries] = useState<EntryType[]>([]);

  const handleEntriesChange = useCallback((newEntries: EntryType[]) => {
    setEntries(newEntries);
  }, []);

  return (
    <div className="font-inter bg-background grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-1 gap-8 row-start-2 items-center sm:items-start">
        <Link href="/annotator">Annotator</Link>
        <Link href="/annotator-secondary">Annotator secondary</Link>
      </main>
    </div>
  );
}
