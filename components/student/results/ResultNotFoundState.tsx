import { Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ResultNotFoundStateProps = {
  onReturnHome: () => void;
};

export default function ResultNotFoundState({
  onReturnHome,
}: ResultNotFoundStateProps) {
  return (
    <section className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
      <Card className="max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl">
        <h1 className="text-2xl font-bold text-white">Result Not Found</h1>

        <p className="mt-2 text-sm text-slate-300">
          We could not find your quiz result.
        </p>

        <Button
          type="button"
          onClick={onReturnHome}
          variant="primary"
          className="mt-6 w-full"
        >
          <Home className="h-4 w-4" />
          Return Home
        </Button>
      </Card>
    </section>
  );
}