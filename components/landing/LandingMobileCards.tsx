"use client";

import { BookOpen, Users } from "lucide-react";

import { Card } from "@/components/ui/card";

const portals = [
  {
    key: "teacher",
    icon: BookOpen,
    title: "For Teachers",
    description: "Create quizzes and monitor student activity.",
    iconClass: "border border-blue-400/20 bg-blue-500/10 text-blue-300",
  },
  {
    key: "student",
    icon: Users,
    title: "For Students",
    description: "Join assessments using a quiz code.",
    iconClass:
      "border border-violet-400/20 bg-violet-500/10 text-violet-300",
  },
];

export default function LandingMobileCards() {
  return (
    <div className="mx-auto mt-5 flex w-full max-w-md flex-col gap-3 md:hidden">
      {portals.map((portal) => {
        const Icon = portal.icon;

        return (
          <Card
            key={portal.key}
            className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${portal.iconClass}`}
              >
                <Icon className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-white">
                  {portal.title}
                </h2>

                <p className="mt-1 text-sm leading-5 text-slate-300">
                  {portal.description}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}