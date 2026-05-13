import { Card } from "@/components/ui/card";

export default function RejectedRequestState() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md rounded-3xl border border-red-400/20 bg-red-500/10 p-8 text-center backdrop-blur-xl">
        <h1 className="text-3xl font-extrabold text-red-200">
          Request Rejected
        </h1>

        <p className="mt-3 text-sm leading-6 text-red-100/80">
          Your teacher rejected your request to join this quiz.
        </p>
      </Card>
    </div>
  );
}