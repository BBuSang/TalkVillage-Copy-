import React, { createContext, useContext, useState } from 'react';

interface MainMapContextProps {
  activeButton: string;
  setActiveButton: (selection: string) => void;
  selectedSelection: string | null;
  setSelectedSelection: (selection: string | null) => void;
  hoveredSelection: string | null;
  setHoveredSelection: (selection: string | null) => void;
  openAccordionIndex: number | null;
  setOpenAccordionIndex: (index: number | null) => void;
}

const MainMapContext = createContext<MainMapContextProps | undefined>(undefined);

export const MainMapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeButton, setActiveButton] = useState<string>('학습하기');
  const [selectedSelection, setSelectedSelection] = useState<string | null>(null);
  const [hoveredSelection, setHoveredSelection] = useState<string | null>(null);
  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(null);

  return (
    <MainMapContext.Provider
      value={{
        activeButton,
        setActiveButton,
        selectedSelection,
        setSelectedSelection,
        hoveredSelection,
        setHoveredSelection,
        openAccordionIndex,
        setOpenAccordionIndex,
      }}
    >
      {children}
    </MainMapContext.Provider>
  );
};

export const useMainMap = () => {
  const context = useContext(MainMapContext);
  if (!context) {
    throw new Error('useMainMap must be used within a MainMapProvider');
  }
  return context;
};
