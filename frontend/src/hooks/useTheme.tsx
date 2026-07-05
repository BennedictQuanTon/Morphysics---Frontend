import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  toggleTheme: (event?: React.MouseEvent) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "morphysics-theme";

function readInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback((event?: React.MouseEvent) => {
    const switchTheme = () =>
      setTheme((t) => (t === "dark" ? "light" : "dark"));

    // Check if View Transition API is supported and we have click event coordinates
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };
    
    if (!doc.startViewTransition || !event) {
      switchTheme();
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const styleId = "theme-transition-styles";
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = `
      ::view-transition-image-pair(root) {
        isolation: auto;
      }
      ::view-transition-group(root) {
        animation-duration: 0.75s;
        animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
      }
      ::view-transition-new(root) {
        animation: reveal-circle 0.75s cubic-bezier(0.16, 1, 0.3, 1);
        mix-blend-mode: normal;
      }
      ::view-transition-old(root) {
        animation: none;
        z-index: -1;
        mix-blend-mode: normal;
      }
      @keyframes reveal-circle {
        from {
          clip-path: circle(0px at ${x}px ${y}px);
        }
        to {
          clip-path: circle(${endRadius}px at ${x}px ${y}px);
        }
      }
    `;

    try {
      doc.startViewTransition(() => {
        flushSync(() => {
          switchTheme();
        });
      });
    } catch (err) {
      switchTheme();
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{ theme, isDark: theme === "dark", toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
