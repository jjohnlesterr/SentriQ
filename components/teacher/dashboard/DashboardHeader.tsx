import { LogOut, ShieldCheck } from "lucide-react";

import SectionHeading from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Props = {
  teacherName: string;
  onLogout: () => void;
};

export default function DashboardHeader({ teacherName, onLogout }: Props) {
  return (
    <Card className="mb-4 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-0 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:mb-6">
      <div className="relative p-5 md:p-8">
        <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-blue-500/10 blur-2xl md:h-32 md:w-32" />

        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SectionHeading
            icon={ShieldCheck}
            badge="Teacher Control Center"
            title="Dashboard"
            description={
              <>
                Welcome back,{""}
                <span className="font-medium text-white">{teacherName}</span>
              </>
            }
            variant="page"
            badgeClassName="mb-3 border-sky-400/20 bg-sky-400/10 px-3 py-1.5 text-xs text-sky-200"
            iconClassName="h-3.5 w-3.5"
            titleClassName="text-3xl md:text-4xl"
            descriptionClassName="mt-2 text-sm text-slate-300 md:text-base"
          />

          <Button
            type="button"
            variant="secondary"
            onClick={onLogout}
            className="h-10 w-full cursor-pointer border-white/10 bg-white/5 text-sm hover:bg-white/10 hover:text-white sm:w-auto"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </Card>
  );
}