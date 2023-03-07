import ToggleDarkMode from "./toggle-dark-mode";
import { Logo } from "./logo";
import { LogoText } from "./logo-text";
import { TokenFilter } from "./token-filter";

export default function AppBar() {
  return (
    <div className="bg-slate-50dark:bg-slate-900 flex h-16 w-screen items-center">
      <div className="container mx-auto flex h-16 items-center py-2">
        <Logo />
        <LogoText />

        <div className="flex-grow"></div>
        <TokenFilter />
        <ToggleDarkMode />
      </div>
    </div>
  );
}
