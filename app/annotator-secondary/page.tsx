"use client";

import Example from "@/components/example";

export default function AnnotatorSecondaryPage() {
  return (
    <div className="font-inter bg-background grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-1 gap-8 row-start-2 items-center sm:items-start">
        <Example />
      </main>
    </div>
  );
}
