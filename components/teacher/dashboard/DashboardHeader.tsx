import { Menu, ShieldCheck } from "lucide-react";

import AppLogo from "@/components/shared/AppLogo";
import SectionHeading from "@/components/shared/SectionHeading";

type Props = {
  teacherName: string;
  onOpenSidebar: () => void;
};

export default function DashboardHeader({ teacherName, onOpenSidebar }: Props) {
  return (
    <header>
      <div className="mb-6 flex items-center justify-between lg:hidden">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
        >
          <Menu className="h-5 w-5" />
        </button>

        <AppLogo className="text-2xl" />

        <div className="h-10 w-10" />
      </div>

      <SectionHeading
        icon={ShieldCheck}
        badge="Teacher quiz management dashboard"
        title="Dashboard"
        description={
          <>
            Welcome back,{" "}
            <span className="text-blue-300">{teacherName || "Teacher"}</span>
          </>
        }
        variant="section"
        badgeClassName="mb-3 px-4 py-2 text-slate-300"
        descriptionClassName="mt-2 text-sm text-slate-400 md:text-base"
      />
    </header>
  );
}
