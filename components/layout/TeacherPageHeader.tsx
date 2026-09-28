import type { ReactNode } from "react";
import { Menu } from "lucide-react";

import AppLogo from "@/components/shared/AppLogo";

type Props = {
  title: string;
  description?: ReactNode;
  onOpenSidebar: () => void;
  /** Primary page action(s), shown to the right of the title on wide screens. */
  actions?: ReactNode;
};

// Shared page header for teacher screens: mobile top bar + title row.
export default function TeacherPageHeader({ title, description, onOpenSidebar, actions }: Props) {
  return (
    <header>
      <div className="mb-6 flex items-center justify-between lg:hidden">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
          className="-ml-2 flex h-10 w-10 items-center justify-center rounded-md text-slate-300 transition-colors hover:bg-white/[0.05] hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </button>

        <AppLogo className="text-lg" />

        <div className="h-10 w-10" />
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-white">{title}</h1>
          {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
        </div>

        {actions && <div className="w-full md:w-auto">{actions}</div>}
      </div>
    </header>
  );
}
