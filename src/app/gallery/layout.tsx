export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full items-center bg-white dark:bg-black">
      {children}
    </div>
  );
}
