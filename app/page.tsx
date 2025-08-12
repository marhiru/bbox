import { Rectangle } from "@/components/rect";

export default function Home() {
  return (
    <div className="font-inter bg-background grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Rectangle />
        </div>
        <div className="flex h-screen gap-4 items-center flex-col sm:flex-row">
          asdijkoasdkiosadkop
        </div>
      </main>
    </div>
  );
}
