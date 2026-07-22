import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type NavigationVersion = "v1" | "v2" | "v3" | "v4";

interface NavigationContextType {
  version: NavigationVersion;
  setVersion: (version: NavigationVersion) => void;
  toggleVersion: () => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [version, setVersionState] = useState<NavigationVersion>("v4");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("navigationVersion") as NavigationVersion | null;
      const envFlag = localStorage.getItem("ENABLE_NEW_NAVIGATION");
      setVersionState("v4");
      localStorage.setItem("navigationVersion", "v4");
    }
  }, []);

  const setVersion = (newVersion: NavigationVersion) => {
    setVersionState(newVersion);
    if (typeof window !== "undefined") {
      localStorage.setItem("navigationVersion", newVersion);
    }
  };

  const toggleVersion = () => {
    setVersion(version === "v1" ? "v2" : version === "v2" ? "v3" : version === "v3" ? "v4" : "v1");
  };

  return (
    <NavigationContext.Provider value={{ version, setVersion, toggleVersion }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}
