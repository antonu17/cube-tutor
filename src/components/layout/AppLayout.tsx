"use client";

import { useState } from "react";
import { Header, Footer } from "@/src/components/layout";
import { Sidebar } from "@/src/components/navigation";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen flex-col">
      <Header isMenuOpen={isSidebarOpen} onMenuToggle={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <main className="flex-1 bg-background text-foreground">{children}</main>
      <Footer />
    </div>
  );
}
