import { createContext, useState } from "react";

export interface StoreState {
  isWorldIdVerified: boolean;
}

const initialStoreState: StoreState = {
  isWorldIdVerified: false,
};

interface StoreContextType {
  store: StoreState;
  setStore: React.Dispatch<React.SetStateAction<StoreState>>;
}

export const StoreContext = createContext<StoreContextType>({
  store: initialStoreState,
  setStore: () => {},
});

interface IStoreProvider {
  children: React.ReactNode;
}

export const StoreProvider: React.FC<IStoreProvider> = ({ children }) => {
  const [store, setStore] = useState<StoreState>(initialStoreState);
  return <StoreContext.Provider value={{ store, setStore }}>{children}</StoreContext.Provider>;
};
