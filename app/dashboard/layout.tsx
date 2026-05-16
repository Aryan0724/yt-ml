import { Sidebar } from "@/components/dashboard/sidebar";
import { Search, Bell } from "lucide-react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-[#030303]">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md">
          <div className="flex items-center gap-4 text-sm font-medium text-zinc-500">
            <span>Workspaces</span>
            <span className="text-zinc-800">/</span>
            <span className="text-white">Main Intelligence</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search history..."
                className="bg-white/[0.03] border border-white/10 rounded-full pl-10 pr-4 py-1.5 text-xs focus:outline-none focus:border-white/20 w-48 transition-all"
              />
            </div>
            <button className="p-2 text-zinc-500 hover:text-white transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-blue-500 rounded-full border border-black" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10" />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 glow-mesh">
          {children}
        </div>
      </main>
    </div>
  );
}
