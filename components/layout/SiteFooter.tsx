"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

import AppLogo from "@/components/shared/AppLogo";
import { cn } from "@/lib/shared/utils";

type SiteFooterProps = {
  className?: string;
};

type ModalAction = "login" | "signup" | "quiz";

const navigationLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Roles", href: "#roles" },
];

const accountLinks: {
  label: string;
  action: ModalAction;
}[] = [
  { label: "Teacher Login", action: "login" },
  { label: "Teacher Sign Up", action: "signup" },
  { label: "Enter Quiz Code", action: "quiz" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
];

export default function SiteFooter({ className }: SiteFooterProps) {
  return (
    <footer className={cn("border-t border-white/10", className)}>
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 md:px-10 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_2.2fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2">
                <Image
                  src="/logo-final.png"
                  alt="SentriQ Logo"
                  fill
                  sizes="56px"
                  className="object-contain"
                />
              </div>

              <AppLogo className="text-4xl tracking-tight" />
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-6 text-slate-400">
              Secure quiz monitoring platform for modern education systems.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <FooterLinkGroup title="Navigation" links={navigationLinks} />
            <FooterActionGroup title="Account" links={accountLinks} />
            <FooterLinkGroup title="Legal" links={legalLinks} />
          </div>
        </div>

        <div className="my-10 h-px w-full bg-white/10" />

        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <SocialIcon href="https://github.com/jjohnlesterr" label="GitHub">
              <GithubMark />
            </SocialIcon>

            <SocialIcon
              href="https://www.instagram.com/jjohnlesterr"
              label="Instagram"
            >
              <InstagramMark />
            </SocialIcon>
          </div>

          <p className="text-sm text-slate-500">
            © 2026 SentriQ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

type FooterLinkGroupProps = {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
};

function FooterLinkGroup({ title, links }: FooterLinkGroupProps) {
  return (
    <div>
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

type FooterActionGroupProps = {
  title: string;
  links: {
    label: string;
    action: ModalAction;
  }[];
};

function FooterActionGroup({ title, links }: FooterActionGroupProps) {
  function openModal(action: ModalAction) {
    window.dispatchEvent(
      new CustomEvent("open-auth-modal", {
        detail: action,
      })
    );
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-violet-300">{title}</h3>

      <div className="mt-6 space-y-4">
        {links.map((link) => (
          <button
            key={link.label}
            type="button"
            onClick={() => openModal(link.action)}
            className="block text-left text-sm text-slate-400 transition hover:text-white"
          >
            {link.label}
          </button>
        ))}
      </div>
    </div>
  );
}

type SocialIconProps = {
  href: string;
  label: string;
  children: ReactNode;
};

function SocialIcon({ href, label, children }: SocialIconProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition hover:border-white/20 hover:bg-white/[0.08]"
    >
      {children}
    </Link>
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

function InstagramMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-current"
      aria-hidden="true"
    >
      <path d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm0 1.5A4.26 4.26 0 0 0 3.5 7.75v8.5A4.26 4.26 0 0 0 7.75 20.5h8.5a4.26 4.26 0 0 0 4.25-4.25v-8.5A4.26 4.26 0 0 0 16.25 3.5h-8.5Z" />
      <path d="M12 7.35A4.65 4.65 0 1 1 12 16.65A4.65 4.65 0 0 1 12 7.35Zm0 1.5A3.15 3.15 0 1 0 12 15.15A3.15 3.15 0 0 0 12 8.85Z" />
      <path d="M17.05 6.55a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1Z" />
    </svg>
  );
}