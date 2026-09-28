import Link from "next/link";

export default function RejectedRequestState() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-line bg-surface p-8 text-center">
        <h1 className="text-lg font-semibold tracking-tight text-white">
          Request declined
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Your teacher didn&apos;t approve your request to join this quiz. Check
          the code with your teacher and try again.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex h-10 items-center rounded-lg border border-line px-4 text-sm font-medium text-slate-200 transition-colors hover:border-line-strong hover:bg-white/[0.04]"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
