import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useStore } from "@/store/useStore";

export function ThemeToggle({ }) {
  const { theme, setTheme } = useStore();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-4 w-4" />
      <Switch
        id="theme-toggle"
        checked={theme === "dark"}
        onCheckedChange={toggleTheme}
      />
      <Moon className="h-4 w-4" />
    </div>
  );
}
