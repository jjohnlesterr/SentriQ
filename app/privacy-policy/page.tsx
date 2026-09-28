import Link from "next/link";

import MarketingPageShell from "@/components/layout/MarketingPageShell";

export default function PrivacyPolicyPage() {
  return (
    <MarketingPageShell>
      <article className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm text-slate-400 transition-colors hover:text-white">
          ← Home
        </Link>

        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-white md:text-3xl">
          Privacy policy
        </h1>

        <p className="mt-4 text-sm leading-6 text-slate-400">
          Our full privacy policy is still being written. If you have questions
          about how SentriQ handles quiz or account data in the meantime,
          please contact the SentriQ team.
        </p>
      </article>
    </MarketingPageShell>
  );
}
