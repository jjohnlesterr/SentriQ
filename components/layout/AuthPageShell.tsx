import Image from "next/image";
import Link from "next/link";

import AppLogo from "@/components/shared/AppLogo";
import { cn } from "@/lib/shared/utils";

type Props = {
  children: React.ReactNode;
  /** Optional content above the card, e.g. an alert. */
  notice?: React.ReactNode;
  className?: string;
};

// Centered single-column layout for login, registration and quiz entry.
export default function AuthPageShell({ children, notice, className }: Props) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas px-4 py-10 sm:py-16">
      <Link href="/" className="mx-auto flex items-center gap-2.5">
        <Image src="/logo-final.png" alt="" width={28} height={28} className="h-7 w-7 object-contain" />
        <AppLogo className="text-lg" />
      </Link>

      <main className={cn("mx-auto mt-10 w-full max-w-md", className)}>
        {notice && <div className="mb-4">{notice}</div>}

        <div className="rounded-xl border border-line bg-surface p-6 sm:p-8">{children}</div>
      </main>
    </div>
  );
}
