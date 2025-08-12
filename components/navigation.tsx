import { JSX } from "react";
import { ThemeSwitcher } from "./theme";
import { Avatar, AvatarImage } from "./ui/avatar";

export default function Navigation(): JSX.Element {
  return (
    <nav className="flex bg-background/60 backdrop-blur-md gap-2 py-6 px-4 justify-between mx-auto items-center h-9 w-full fixed">
      <div>aspodksop asdsa</div>
      <div className="flex gap-2 items-center justify-center">
        <ThemeSwitcher />
        <Avatar>
          <AvatarImage src="https://avatars.githubusercontent.com/u/66804488?v=4" />
        </Avatar>
      </div>
    </nav>
  );
}
