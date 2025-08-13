"use client";

import Annotator from "@/components/annotator/annotator";
import { EntryType } from "@/components/annotator/annotator.helpers";
import { useState, useCallback } from "react";

export default function Home() {
  const labels = ["Mama cow", "Baby cow"];
  const [entries, setEntries] = useState<EntryType[]>([]);

  const handleEntriesChange = useCallback((newEntries: EntryType[]) => {
    setEntries(newEntries);
  }, []);

  return (
    <div className="font-inter bg-background grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Annotator
          url="https://avatars.githubusercontent.com/u/66804488?v=4"
          inputMethod="select"
          labels={labels}
          className="border"
          onChange={handleEntriesChange}
        />
      </main>
      {/* <pre>
        {JSON.stringify(entries)}
      </pre> */}
    </div>
  );
}
