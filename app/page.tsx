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
      <main className="flex flex-1 gap-8 row-start-2 items-center sm:items-start">
        <Annotator
          url="https://avatars.githubusercontent.com/u/66804488?v=4"
          inputMethod="none"
          labels={labels}
          className="border"
          onChange={handleEntriesChange}
        />
        <pre
          className="bg-muted w-64 overflow-clip h-64 overflow-y-auto"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(entries, null, 2)
              .replace(/"(.*?)":/g, '<span style="color: #c678dd">"$1"</span>:')
              .replace(/: "([^"]*)"/g, ': <span style="color: #98c379">"$1"</span>')
              .replace(/: (\d+)/g, ': <span style="color: #61afef">$1</span>')
              .replace(/true|false/g, (match) =>
                `<span style="color: #e06c75">${match}</span>`
              )
              .replace(/null/g, '<span style="color: #d19a66">null</span>')
              .replace(/\n/g, "<br/>")
              .replace(/  /g, "&nbsp;&nbsp;"),
          }}
        />
      </main>
    </div>
  );
}
