"use client";

import { useTheme } from "next-themes";
import { JSX } from "react";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

enum ETheme {
  LIGHT = "light",
  DARK = "dark",
}

export function ThemeSwitcher(): JSX.Element {
  const { theme, setTheme } = useTheme();

  const handleThemeSwitch = (curr: string | undefined) => {
    if (curr === undefined) return;

    if (curr === "light") return setTheme(ETheme.DARK);
    else return setTheme(ETheme.LIGHT);
  };

  return (
    <Button variant="outline" className="px-8 h-7 ring-0 hover:ring-2 ring-primary" onClick={() => handleThemeSwitch(theme)}>
      <Sun className="hidden dark:flex" />
      <Moon className="dark:hidden block" />
    </Button>
  );
}
