import React, { createContext, useContext, useState, ReactNode } from "react";

interface CtcContextProps {
  children: ReactNode;
}

export interface Result {
  newRegimeTax: number;
  oldRegimeTax: number;
  bestTaxRegime: string;
}

interface SalaryData {
  basic: number;
  hra: number;
  spAllowance: number;
  otherTaxable: number;
  result?: Result;
}
// interface SalaryData {
//   basic: number;
//   hra: number;
//   spAllowance: number;
//   otherTaxable: number;
//   taxableAmt?: number;
//   afterDedAmt?: number;
//   newRegimeTax?: number;
//   oldRegimeTax?: number;
// }

interface CtcContextType {
  salaryData: SalaryData;
  setSalaryData: React.Dispatch<React.SetStateAction<SalaryData>>;
}

const CtcContext = createContext<CtcContextType | undefined>(undefined);

const CtcProvider: React.FC<CtcContextProps> = ({ children }) => {
  const [salaryData, setSalaryData] = useState<SalaryData>({
    basic: 0,
    hra: 0,
    spAllowance: 0,
    otherTaxable: 0,
  });

  return (
    <CtcContext.Provider value={{ salaryData, setSalaryData }}>
      {children}
    </CtcContext.Provider>
  );
};

const useCtcContext = () => {
  const context = useContext(CtcContext);
  if (!context) {
    throw new Error("useCTCContext must be used within a CtcProvider");
  }
  return context;
};

export { CtcProvider, useCtcContext };
