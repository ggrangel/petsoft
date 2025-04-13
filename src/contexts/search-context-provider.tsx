"use client";

import { createContext, useState } from "react";

type SearchContextType = {
  searchQuery: string;
  handleChangeSearchQuery: (query: string) => void;
};
export const SearchContext = createContext<SearchContextType | null>(null);

type SearchContextProviderProps = {
  children: React.ReactNode;
};

export default function SearchContextProvider({
  children,
}: SearchContextProviderProps) {
  // state
  const [searchQuery, setSearchQuery] = useState("");

  // derived state

  // event handlers / action
  const handleChangeSearchQuery = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        handleChangeSearchQuery,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
