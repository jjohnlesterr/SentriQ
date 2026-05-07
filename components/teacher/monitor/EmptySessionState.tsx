import { Card } from "@/components/ui/card";

type Props = {
  message: string;
};

export default function EmptySessionState({ message }: Props) {
  return (
    <Card className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
      <p className="text-slate-300">{message}</p>
    </Card>
  );
}