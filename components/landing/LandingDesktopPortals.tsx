"use client";

import { BookOpen, Users } from "lucide-react";

import PortalCard from "@/components/landing/PortalCard";

const portals = [
  {
    key: "teacher",
    icon: BookOpen,
    title: "Teacher Portal",
    description:
      "Create quizzes, manage assessments, and monitor student activity with a secure and streamlined dashboard.",
    buttonText: "Teacher Login",
    href: "/teacher/login",
    variant: "primary" as const,
    glowClass: "bg-blue-500/10",
    iconClass: "border border-blue-400/20 bg-blue-500/10 text-blue-300",
  },
  {
    key: "student",
    icon: Users,
    title: "Student Portal",
    description:
      "Request access using a quiz code and complete your exam in a focused, monitored environment.",
    buttonText: "Request Access",
    href: "/student/join",
    variant: "secondary" as const,
    glowClass: "bg-violet-500/10",
    iconClass: "border border-violet-400/20 bg-violet-500/10 text-violet-300",
  },
];

type Props = {
  loadingTarget: string | null;
  onNavigate: (key: string, href: string) => void;
};

export default function LandingDesktopPortals({
  loadingTarget,
  onNavigate,
}: Props) {
  return (
    <div className="relative mx-auto mt-7 hidden w-full max-w-5xl grid-cols-2 gap-5 md:grid lg:mt-8">
      <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-px w-10 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-400/40 to-violet-400/40 lg:block" />

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
          onClick={() => onNavigate(portal.key, portal.href)}
        />
      ))}
    </div>
  );
}