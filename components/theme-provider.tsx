import { JSX } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes"

export function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemeProvider>): JSX.Element {
    return <NextThemeProvider {...props}>{children}</NextThemeProvider>
}