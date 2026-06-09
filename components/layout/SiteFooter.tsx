import Link from "next/link";
import Image from "next/image";

import AppLogo from "@/components/shared/AppLogo";
import { cn } from "@/lib/shared/utils";

type SiteFooterProps = {
  className?: string;
};

const navigationLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Roles", href: "#roles" },
];

const accountLinks = [
  { label: "Teacher Login", href: "/teacher/login" },
  { label: "Student Login", href: "/student/login" },
  { label: "Register", href: "/teacher/register" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "#" },
];

export default function SiteFooter({ className }: SiteFooterProps) {
  return (
    <footer className={cn("border-t border-white/10", className)}>
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 md:px-10 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_2.2fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2">
                <Image
                  src="/logo.png"
                  alt="SentriQ Logo"
                  fill
                  sizes="56px"
                  className="object-contain p-2"
                />
              </div>

              <AppLogo className="text-4xl tracking-tight" />
            </Link>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            <FooterGroup title="Navigation" links={navigationLinks} />
            <FooterGroup title="Account" links={accountLinks} />
            <FooterGroup title="Legal" links={legalLinks} />
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            © 2026 SentriQ. All rights reserved.
          </p>

          <Link
            href="https://github.com/jjohnlesterr"
            target="_blank"
            rel="noreferrer"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition hover:border-white/20 hover:bg-white/[0.08]"
            aria-label="GitHub"
          >
            <GithubMark />
          </Link>
        </div>
      </div>
    </footer>
  );
}

type FooterGroupProps = {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
};

function FooterGroup({ title, links }: FooterGroupProps) {
  return (
    <div className="border-white/10 sm:border-l sm:pl-10">
      <h3 className="text-lg font-bold text-violet-300">{title}</h3>

      <div className="mt-6 space-y-4">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="block text-sm text-slate-400 transition hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function GithubMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-current"
      aria-hidden="true"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56v-2.16c-3.2.7-3.87-1.38-3.87-1.38-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.74 2.67 1.24 3.32.95.1-.74.4-1.24.72-1.53-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18A10.9 10.9 0 0 1 12 6.05c.97 0 1.95.13 2.86.38 2.18-1.49 3.14-1.18 3.14-1.18.62 1.58.23 2.75.11 3.04.73.8 1.17 1.83 1.17 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.77 1.06.77 2.14v3.18c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}