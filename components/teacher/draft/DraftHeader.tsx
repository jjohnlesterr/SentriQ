import { FileText, Menu } from "lucide-react";

import AppLogo from "@/components/shared/AppLogo";
import SectionHeading from "@/components/shared/SectionHeading";

type Props = {
  onOpenSidebar: () => void;
};

export default function DraftHeader({ onOpenSidebar }: Props) {
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
        icon={FileText}
        badge="Quiz Builder Drafts"
        title="Drafts"
        description="Continue editing unpublished quizzes."
        variant="section"
        badgeClassName="mb-3 border-violet-400/20 bg-violet-500/10 px-4 py-2 text-violet-200"
        descriptionClassName="mt-2 text-sm text-slate-400 md:text-base"
      />
    </header>
  );
}