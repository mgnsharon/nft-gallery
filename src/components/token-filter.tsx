"use client";

export function TokenFilter() {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    console.log(value);
  };

  return (
    <input
      type="search"
      placeholder="Token Id"
      onChange={handleChange}
      className="form-input mr-4 h-10 w-40 rounded-md bg-slate-50 text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-50"
    />
  );
}
