import React, { createContext, useState, useContext, ReactNode } from 'react';

interface GeneratedAppData {
  appName: string;
  appIcon?: string; // Assuming icon is a URL or path
  generatedScriptUrl: string;
}

interface GeneratedAppContextType {
  generatedApps: GeneratedAppData[];
  addGeneratedApp: (appData: GeneratedAppData) => void;
  getAppByName: (appName: string) => GeneratedAppData | undefined;
}

const GeneratedAppContext = createContext<GeneratedAppContextType | undefined>(undefined);

export const GeneratedAppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [generatedApps, setGeneratedApps] = useState<GeneratedAppData[]>([]);

  const addGeneratedApp = (appData: GeneratedAppData) => {
    setGeneratedApps((prevApps) => {
      // Avoid duplicates if appName is meant to be unique for navigation
      if (prevApps.find(app => app.appName === appData.appName)) {
        return prevApps.map(app => app.appName === appData.appName ? appData : app);
      }
      return [...prevApps, appData];
    });
  };

  const getAppByName = (appName: string) => {
    return generatedApps.find(app => app.appName === appName);
  };

  return (
    <GeneratedAppContext.Provider value={{ generatedApps, addGeneratedApp, getAppByName }}>
      {children}
    </GeneratedAppContext.Provider>
  );
};

export const useGeneratedAppContext = () => {
  const context = useContext(GeneratedAppContext);
  if (context === undefined) {
    throw new Error('useGeneratedAppContext must be used within a GeneratedAppContextProvider');
  }
  return context;
};