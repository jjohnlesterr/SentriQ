import type { ReactNode } from "react";
import Link from "next/link";

import OpenAuthModalButton from "@/components/landing/OpenAuthModalButton";
import AppLogo from "@/components/shared/AppLogo";
import { navLinks } from "@/constants/navigation";
import { cn } from "@/lib/shared/utils";

type SiteFooterProps = {
  className?: string;
};

const accountLinks = [
  { label: "Teacher login", modal: "login" as const },
  { label: "Teacher sign up", modal: "signup" as const },
  { label: "Enter quiz code", modal: "quiz" as const },
];

const footerLinkClass =
  "block text-sm text-slate-400 transition-colors hover:text-white";

export default function SiteFooter({ className }: SiteFooterProps) {
  return (
    <footer className={cn("border-t border-line", className)}>
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-block">
              <AppLogo className="text-lg" />
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">
              Online quizzes with live monitoring for classrooms.
            </p>
          </div>

          <FooterColumn title="Product">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={footerLinkClass}>
                {link.label}
              </Link>
            ))}
          </FooterColumn>

          <FooterColumn title="Account">
            {accountLinks.map((link) => (
              <OpenAuthModalButton
                key={link.label}
                modal={link.modal}
                variant="ghost"
                className={cn(
                  footerLinkClass,
                  "h-auto border-0 p-0 font-normal hover:bg-transparent",
                )}
              >
                {link.label}
              </OpenAuthModalButton>
            ))}
          </FooterColumn>

          <FooterColumn title="Legal">
            <Link href="/privacy-policy" className={footerLinkClass}>
              Privacy policy
            </Link>
          </FooterColumn>
        </div>

        <div className="mt-12 flex flex-col-reverse items-start justify-between gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-500">© 2026 SentriQ</p>

          <div className="flex items-center gap-1">
            <SocialLink href="https://github.com/jjohnlesterr" label="GitHub">
              <GithubMark />
            </SocialLink>
            <SocialLink href="https://www.instagram.com/jjohnlesterr" label="Instagram">
              <InstagramMark />
            </SocialLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
        {title}
      </h3>
      <div className="mt-4 flex flex-col items-start gap-3">{children}</div>
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-white/[0.05] hover:text-white"
    >
      {children}
    </a>
  );
}

function GithubMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56v-2.16c-3.2.7-3.87-1.38-3.87-1.38-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.74 2.67 1.24 3.32.95.1-.74.4-1.24.72-1.53-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18A10.9 10.9 0 0 1 12 6.05c.97 0 1.95.13 2.86.38 2.18-1.49 3.14-1.18 3.14-1.18.62 1.58.23 2.75.11 3.04.73.8 1.17 1.83 1.17 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.77 1.06.77 2.14v3.18c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function InstagramMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm0 1.5A4.26 4.26 0 0 0 3.5 7.75v8.5A4.26 4.26 0 0 0 7.75 20.5h8.5a4.26 4.26 0 0 0 4.25-4.25v-8.5A4.26 4.26 0 0 0 16.25 3.5h-8.5Z" />
      <path d="M12 7.35A4.65 4.65 0 1 1 12 16.65A4.65 4.65 0 0 1 12 7.35Zm0 1.5A3.15 3.15 0 1 0 12 15.15A3.15 3.15 0 0 0 12 8.85Z" />
      <path d="M17.05 6.55a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1Z" />
    </svg>
  );
}
