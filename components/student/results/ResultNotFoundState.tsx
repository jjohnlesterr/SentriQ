import { Button } from "@/components/ui/button";

type ResultNotFoundStateProps = {
  onReturnHome: () => void;
};

export default function ResultNotFoundState({
  onReturnHome,
}: ResultNotFoundStateProps) {
  return (
    <section className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 text-center">
      <h1 className="text-xl font-semibold tracking-tight text-white">Result not found</h1>

      <p className="mt-2 text-sm text-slate-400">
        We couldn&apos;t find this quiz result. The link may be incorrect or the
        session may have been removed.
      </p>

      <Button type="button" onClick={onReturnHome} className="mx-auto mt-6">
        Return home
      </Button>
    </section>
  );
}
