import { Menu, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";

type Props = {
  teacherName: string;
  onOpenSidebar: () => void;
};

export default function DashboardHeader({
  teacherName,
  onOpenSidebar,
}: Props) {
  return (
    <header>
      <div className="mb-6 flex items-center justify-between lg:hidden">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
        >
          <Menu className="h-5 w-5" />
        </button>

        <h1 className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-2xl font-extrabold text-transparent">
          SentriQ
        </h1>

        <div className="h-10 w-10" />
      </div>

      <div>
        <Badge className="mb-3 px-4 py-2 text-slate-300">
          <ShieldCheck className="h-4 w-4 text-cyan-300" />
          Teacher quiz management dashboard
        </Badge>

        <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
          Dashboard
        </h2>

        <p className="mt-2 text-sm text-slate-400 md:text-base">
          Welcome back,{" "}
          <span className="text-blue-300">
            {teacherName || "Teacher"}
          </span>
        </p>
      </div>
    </header>
  );
}