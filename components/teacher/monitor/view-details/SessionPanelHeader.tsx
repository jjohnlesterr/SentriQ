import type { ReactNode } from "react";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  icon: ReactNode;
  title: string;
  buttonLabel: string;
  onClick: () => void;
};

export default function SessionPanelHeader({
  icon,
  title,
  buttonLabel,
  onClick,
}: Props) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-3 px-5 py-4">
      <div className="flex items-center gap-2">
        {icon}
        <h4 className="text-base font-bold text-white">{title}</h4>
      </div>

      <Button
        type="button"
        onClick={onClick}
        size="sm"
        className="h-8 rounded-full px-3 text-xs font-semibold shadow-lg shadow-cyan-500/20"
      >
        <Eye className="mr-1.5 h-3.5 w-3.5" />
        {buttonLabel}
      </Button>
    </div>
  );
}