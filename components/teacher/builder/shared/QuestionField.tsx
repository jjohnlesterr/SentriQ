import { Label } from "@/components/ui/label";

type Props = {
  label: string;
  helper?: string;
  rightText?: string;
  children: React.ReactNode;
};

export default function QuestionField({
  label,
  helper,
  rightText,
  children,
}: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Label>{label}</Label>
          {helper && <p className="mt-1 text-xs text-slate-500">{helper}</p>}
        </div>

        {rightText && (
          <span className="shrink-0 text-xs text-slate-500">{rightText}</span>
        )}
      </div>

      {children}
    </div>
  );
}