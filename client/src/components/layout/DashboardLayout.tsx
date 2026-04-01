import { useState } from "react";
import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top bar */}
      <header className="flex items-center justify-between bg-white p-4 shadow">
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 hover:bg-slate-100"
        >
          <Menu size={24} />
        </button>

        <h1 className="text-xl font-bold">Voting System</h1>
      </header>

      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* Page content */}
      <main className="p-6">{children}</main>
    </div>
  );
}
