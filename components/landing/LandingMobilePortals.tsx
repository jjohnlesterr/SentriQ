"use client";

import { ArrowRight, BookOpen, Users } from "lucide-react";

import { Button } from "@/components/ui/button";

const portals = [
  {
    key: "teacher",
    icon: BookOpen,
    buttonText: "Teacher Login",
    href: "/teacher/login",
    variant: "primary" as const,
  },
  {
    key: "student",
    icon: Users,
    buttonText: "Enter Quiz Code",
    href: "/student/join",
    variant: "secondary" as const,
  },
];

type Props = {
  loadingTarget: string | null;
  onNavigate: (key: string, href: string) => void;
};

export default function LandingMobilePortals({
  loadingTarget,
  onNavigate,
}: Props) {
  return (
    <div className="mx-auto mt-6 flex w-full max-w-md flex-col gap-3 md:hidden">
      {portals.map((portal) => (
        <Button
          key={portal.key}
          type="button"
          variant={portal.variant}
          onClick={() => onNavigate(portal.key, portal.href)}
          disabled={loadingTarget !== null}
          className="h-14 w-full rounded-xl text-sm font-semibold"
        >
          {portal.buttonText}
          <ArrowRight className="h-4 w-4" />
        </Button>
      ))}
    </div>
  );
}