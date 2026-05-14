import Link from "next/link";

import { cn } from "@/lib/shared/utils";

type SiteFooterProps = {
  className?: string;
};

export default function SiteFooter({ className }: SiteFooterProps) {
  return (
    <footer
      className={cn(
        "mx-auto w-full max-w-7xl px-4 pb-5 sm:px-6 md:px-10 lg:px-16",
        className
      )}
    >
      <div className="border-t border-white/10 pt-5 text-center text-xs text-slate-500 sm:text-sm">
        © 2026 SentriQ. All rights reserved.
        <span className="mx-1.5 text-slate-700">•</span>
        <Link
          href="/privacy-policy"
          className="text-slate-400 transition hover:text-white"
        >
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}