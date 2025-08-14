import { JSX } from "react";
import { ThemeSwitcher } from "./theme";
import { Avatar, AvatarImage } from "./ui/avatar";
import { ArrowRight } from "lucide-react";

export default function Navigation(): JSX.Element {
  return (
    <header>
      <nav className="h-9 bg-primary w-full cursor-pointer mx-auto justify-center items-center flex fixed group/ann">
        <span className="flex gap-2 select-none font-mono sans text-xs font-semibold uppercase">
          tests being made
          <ArrowRight className="size-4 group-hover/ann:translate-x-1 transition-all" />
        </span>
      </nav>
      <nav className="flex top-10 bg-background/60 backdrop-blur-md gap-2 py-6 px-4 justify-between mx-auto items-center h-9 w-full fixed">
        <div className="font-mono select-none font-semibold bg-gradient-to-br from-primary via-90% to-primary/50 ring-0 hover:ring-2 ring-offset-0 hover:ring-offset-2 ring-offset-background ring-primary transition duration-[82.5ms] px-2 rounded-md">
          b_box
        </div>
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
