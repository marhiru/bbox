"use client";
import { useTheme } from "next-themes";
import { JSX } from "react";

export function ThemeSwitcher(): JSX.Element {
  const { setTheme } = useTheme();

  return (
    <div>
      Current Theme
      <button onClick={() => setTheme("light")}>Light Mode</button>
      <button onClick={() => setTheme("dark")}>Dark Mode</button>
    </div>
  );
}
