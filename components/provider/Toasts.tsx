import React, { createContext, useContext, useState, ReactNode } from "react";
import { Toast } from "../ui/Toast";

type ToastProps = Omit<React.ComponentProps<typeof Toast>, "visible">;

type ToastsContextType = {
  addToast: (params: ToastProps) => void;
};

const ToastsContext = createContext<ToastsContextType | undefined>(undefined);

export const ToastsProvider = ({ children }: { children: ReactNode }) => {
  const [nextToast, setNextToast] = useState<ToastProps>();

  const addToast = (params: ToastProps) => setNextToast(params);
  const clearToasts = () => setNextToast(undefined);

  return (
    <ToastsContext.Provider
      value={{
        addToast,
      }}
    >
      {nextToast && <Toast {...nextToast} visible onHide={clearToasts} />}
      {children}
    </ToastsContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastsContext);
  if (!context) {
    throw new Error("useToast must be used within a BiometricsProvider");
  }
  return context;
};
