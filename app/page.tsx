"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, ShieldCheck, Users } from "lucide-react";

import PageShell from "@/components/layout/PageShell";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import PortalCard from "@/components/landing/PortalCard";
import SectionHeading from "@/components/shared/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const portals = [
  {
    key: "teacher",
    icon: BookOpen,
    title: "Teacher Portal",
    shortTitle: "For Teachers",
    description:
      "Create quizzes, manage assessments, and monitor student activity with a secure and streamlined dashboard.",
    mobileDescription: "Create quizzes and monitor student activity.",
    buttonText: "Teacher Login",
    mobileButtonText: "Teacher Login",
    href: "/teacher/login",
    variant: "primary",
    glowClass: "bg-blue-500/10",
    iconClass: "border border-blue-400/20 bg-blue-500/10 text-blue-300",
  },
  {
    key: "student",
    icon: Users,
    title: "Student Portal",
    shortTitle: "For Students",
    description:
      "Request access using a quiz code and complete your exam in a focused, monitored environment.",
    mobileDescription: "Join assessments using a quiz code.",
    buttonText: "Request Access",
    mobileButtonText: "Enter Quiz Code",
    href: "/student/join",
    variant: "secondary",
    glowClass: "bg-violet-500/10",
    iconClass: "border border-violet-400/20 bg-violet-500/10 text-violet-300",
  },
] as const;

type PortalKey = (typeof portals)[number]["key"];

export default function LandingPage() {
  const router = useRouter();
  const [loadingTarget, setLoadingTarget] = useState<PortalKey | null>(null);

  function handlePortalClick(key: PortalKey, href: string) {
    setLoadingTarget(key);
    router.push(href);
  }

  return (
    <PageShell>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />

        <main className="relative flex flex-1 overflow-hidden">
          <div className="pointer-events-none absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="pointer-events-none absolute right-16 top-40 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />

          <section className="relative mx-auto flex w-full max-w-7xl flex-1 px-4 pb-10 pt-8 sm:px-6 sm:pt-10 md:px-10 md:pt-12 lg:px-16">
            <div className="flex w-full flex-col justify-center">
              <div className="mx-auto max-w-5xl text-center">
                <Badge className="mb-5 px-4 py-2 text-slate-300 sm:mb-6">
                  <ShieldCheck className="h-4 w-4 text-cyan-300" />
                  Secure quiz monitoring for modern classrooms
                </Badge>

                <SectionHeading
                  title="SentriQ"
                  description="A modern platform for digital assessments, real-time monitoring, and seamless academic experiences."
                  variant="hero"
                  align="center"
                  titleClassName="text-4xl sm:text-5xl md:text-6xl"
                  descriptionClassName="mx-auto mt-2 max-w-2xl text-sm leading-6 sm:text-base md:mt-3 md:text-lg"
                />

                <div className="mx-auto mt-6 grid max-w-md gap-3 md:hidden">
                  {portals.map((portal) => (
                    <Button
                      key={portal.key}
                      type="button"
                      variant={portal.variant}
                      onClick={() => handlePortalClick(portal.key, portal.href)}
                      disabled={loadingTarget !== null}
                      className="h-12 w-full text-sm"
                    >
                      {portal.mobileButtonText}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
              </div>

              <div className="relative mx-auto mt-8 hidden max-w-5xl grid-cols-2 gap-5 md:grid lg:mt-9">
                <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-px w-12 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-400/40 to-violet-400/40 lg:block" />

                {portals.map((portal) => (
                  <PortalCard
                    key={portal.key}
                    icon={portal.icon}
                    title={portal.title}
                    description={portal.description}
                    buttonText={portal.buttonText}
                    variant={portal.variant}
                    glowClass={portal.glowClass}
                    iconClass={portal.iconClass}
                    loading={loadingTarget === portal.key}
                    disabled={loadingTarget !== null}
                    onClick={() => handlePortalClick(portal.key, portal.href)}
                  />
                ))}
              </div>

              <div className="mx-auto mt-5 grid max-w-md gap-3 md:hidden">
                {portals.map((portal) => {
                  const Icon = portal.icon;

                  return (
                    <Card
                      key={portal.key}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${portal.iconClass}`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>

                        <div>
                          <h2 className="text-lg font-bold text-white">
                            {portal.shortTitle}
                          </h2>

                          <p className="mt-1 text-sm leading-5 text-slate-300">
                            {portal.mobileDescription}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </PageShell>
  );
}