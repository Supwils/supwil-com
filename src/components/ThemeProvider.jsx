"use client";

import { useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }) {
  const [defaultTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";

    const sessionTheme = window.sessionStorage.getItem("theme");
    if (sessionTheme === "light" || sessionTheme === "dark") {
      window.localStorage.setItem("theme", sessionTheme);
      return sessionTheme;
    }

    window.sessionStorage.setItem("theme", "dark");
    window.localStorage.setItem("theme", "dark");
    return "dark";
  });

  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme={defaultTheme}
      themes={["light", "dark"]}
      enableSystem={true}
      disableTransitionOnChange={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
} 
