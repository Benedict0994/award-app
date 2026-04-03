import { useState } from "react";
import type { ReactNode } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-sidebar lg:block">
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <div className="flex h-14 items-center border-b bg-background px-4 lg:hidden">
          <SheetTrigger render={<Button variant="ghost" size="icon" />}>
            <Menu size={20} />
          </SheetTrigger>
          <span className="ml-3 text-sm font-semibold">AwardVote</span>
        </div>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="hidden lg:block">
          <DashboardHeader />
        </div>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
