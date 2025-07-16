import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type AppContextType = {
  userDocs: string[];
  setUserDocs: React.Dispatch<React.SetStateAction<string[]>>;
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
  hasDocs: boolean;
  setHasDocs: (value: boolean) => void;
  initialLoading: boolean;
  setInitialLoading: (value: boolean) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userDocs, setUserDocs] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [hasDocs, setHasDocs] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  return (
    <AppContext.Provider
      value={{
        userDocs,
        setUserDocs,
        isUploading,
        setIsUploading,
        hasDocs,
        setHasDocs,
        initialLoading,
        setInitialLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
