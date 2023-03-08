"use client";
import { KeyboardEvent } from "react";
import useTokenSearch from "@/hooks/use-token-search";

export function TokenFilter() {
  const { searchTokens } = useTokenSearch();

  const handleChange = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") {
      return;
    }
    const { value } = e.currentTarget as HTMLInputElement;
    searchTokens(value);
  };

  return (
    <input
      type="search"
      placeholder="Token Id"
      onKeyUp={handleChange}
      className="form-input mr-4 h-10 w-40 rounded-md bg-slate-50 text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-50"
    />
  );
}
