import ToggleDarkMode from "./toggle-dark-mode";
import { Logo } from "./logo";
import { LogoText } from "./logo-text";
import { TokenFilter } from "./token-filter";

export default function AppBar() {
  return (
    <div className="flex h-16 w-screen items-center bg-slate-50 px-4 py-2 dark:bg-slate-900">
      <Logo />
      <LogoText />

      <div className="flex-grow"></div>
      <TokenFilter />
      <ToggleDarkMode />
    </div>
  );
}
