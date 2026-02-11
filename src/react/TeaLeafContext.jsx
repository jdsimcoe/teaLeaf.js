import { createContext, useContext } from "react";

export const TeaLeafContext = createContext(null);

export function useTeaLeaf() {
  const context = useContext(TeaLeafContext);
  if (!context) {
    throw new Error("useTeaLeaf must be used inside TeaLeaf.Root");
  }
  return context;
}
