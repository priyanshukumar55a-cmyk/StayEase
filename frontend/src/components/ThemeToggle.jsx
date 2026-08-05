import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle({ className = "", showLabel = false }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? (resolvedTheme ?? theme) : "light";
  const isDark = currentTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:shadow-none dark:hover:bg-slate-800 ${className}`}
      aria-label="Toggle dark mode"
      disabled={!mounted}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
      {showLabel && (isDark ? "Light mode" : "Dark mode")}
    </button>
  );
}
