import { LogOut, ShieldCheck } from "lucide-react";

import FeaturedBadge from "@/components/shared/FeaturedBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Props = {
  teacherName: string;
  onLogout: () => void;
};

export default function DashboardHeader({
  teacherName,
  onLogout,
}: Props) {
  return (
    <Card className="mb-6 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-0 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="relative p-6 md:p-8">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <FeaturedBadge
              icon={ShieldCheck}
              label="Teacher Control Center"
              className="mb-3 border border-sky-400/20 bg-sky-400/10 px-3 py-1.5 text-xs text-sky-200"
              iconClassName="h-3.5 w-3.5"
            />

            <h1 className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-300 md:text-base">
              Welcome back,{" "}
              <span className="font-medium text-white">{teacherName}</span>
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={onLogout}
            className="cursor-pointer border-white/10 bg-white/5 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </Card>
  );
}