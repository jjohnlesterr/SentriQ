import { AlertTriangle } from "lucide-react";

type TabWarningProps = {
  tabWarnings: number;
};

export default function TabWarning({ tabWarnings }: TabWarningProps) {
  if (tabWarnings <= 0) return null;

  return (
    <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-red-200">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5" />

        <div>
          <p className="font-semibold">Tab switch detected</p>
          <p className="mt-1 text-sm text-slate-300">
            You have switched tabs {tabWarnings} time
            {tabWarnings !== 1 ? "s" : ""}. Your teacher can see this.
          </p>
        </div>
      </div>
    </div>
  );
}