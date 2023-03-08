"use client";
import { createContext, useContext, useState } from "react";

export interface TokenSearchContext {
  tokenId?: number;
  searchTokens: (id: string) => void;
}

export interface TokenSearchProviderProps {
  tokenId?: number;
  children: React.ReactNode;
}

const defaultContext: TokenSearchContext = {
  tokenId: undefined,
  searchTokens: () => {},
};

export const TokenSearchContext = createContext(defaultContext);

export const TokenSearchProvider = ({ children }: TokenSearchProviderProps) => {
  const [tokenId, setTokenId] = useState<number | undefined>(undefined);
  const searchTokens = (id: string) => {
    setTokenId(parseInt(id));
  };

  return (
    <TokenSearchContext.Provider value={{ tokenId, searchTokens }}>
      {children}
    </TokenSearchContext.Provider>
  );
};

export default function useTokenSearch() {
  const { tokenId, searchTokens } = useContext(TokenSearchContext);
  return {
    tokenId,
    searchTokens,
  };
}
