import { JSX } from "react";
import { ThemeSwitcher } from "./theme";
import { Avatar, AvatarImage } from "./ui/avatar";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Navigation({
  text = "tests being made",
  announce = true,
}: {
  text?: string;
  announce: boolean;
}): JSX.Element {
  return (
    <header>
      <nav
        className={cn(
          "h-9 bg-primary w-full cursor-pointer mx-auto justify-center items-center hidden fixed group/ann",
          {
            flex: announce,
          }
        )}
      >
        <span className="flex gap-2 select-none font-mono sans text-xs font-semibold uppercase">
          {text}
          <ArrowRight className="size-4 group-hover/ann:translate-x-1 transition-all" />
        </span>
      </nav>
      <nav
        className={cn(
          "flex bg-background/60 backdrop-blur-md gap-2 py-6 px-4 justify-between mx-auto items-center h-9 w-full fixed",
          {
            "top-10": announce,
          }
        )}
      >
        <Link href="//" className="font-mono select-none font-semibold bg-gradient-to-br from-primary via-90% to-primary/50 ring-0 hover:ring-2 ring-offset-0 hover:ring-offset-2 ring-offset-background ring-primary transition duration-[82.5ms] px-2 rounded-md">
          b_box
        </Link>
        <div className="flex gap-2 items-center justify-center">
          <ThemeSwitcher />
          <Avatar className="ring-2 ml-2 ring-primary ring-offset-2 ring-offset-background">
            <AvatarImage src="https://avatars.githubusercontent.com/u/66804488?v=4" />
          </Avatar>
        </div>
      </nav>
    </header>
  );
}
