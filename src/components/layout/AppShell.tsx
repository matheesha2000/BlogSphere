"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith("/auth") || pathname === "/login";

  if (isAuthRoute) {
    return (
      <div className="min-h-full flex">
        <main className="flex-1 flex items-center justify-center px-4 py-10">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col">
      <header className="w-full border-b py-4">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-xl font-semibold">
            BlogSphere
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto">{children}</main>

      <footer className="w-full border-t py-4">
        <div className="container mx-auto px-4 text-sm text-slate-500">
          © {new Date().getFullYear()} BlogSphere
        </div>
      </footer>
    </div>
  );
}
