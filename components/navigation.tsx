import { JSX } from "react";
import { ThemeSwitcher } from "./theme";

export default function Navigation(): JSX.Element {
  return (
    <nav className="flex bg-background gap-2 justify-between mx-auto items-center h-9 w-full sticky">
      <div>aspodksop asdsa</div>
      <ThemeSwitcher />
    </nav>
  );
}
