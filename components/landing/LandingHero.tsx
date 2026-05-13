"use client";

import { ShieldCheck } from "lucide-react";

import SectionHeading from "@/components/shared/SectionHeading";
import { Badge } from "@/components/ui/badge";

export default function LandingHero() {
  return (
    <div className="mx-auto max-w-5xl text-center">
      <Badge className="mb-4 px-4 py-2 text-slate-300">
        <ShieldCheck className="h-4 w-4 text-cyan-300" />
        Secure quiz monitoring for modern classrooms
      </Badge>

      <SectionHeading
        title="SentriQ"
        description="A modern platform for digital assessments, real-time monitoring, and seamless academic experiences."
        variant="hero"
        align="center"
        titleClassName="text-4xl sm:text-5xl md:text-6xl"
        descriptionClassName="mx-auto mt-2 max-w-2xl text-sm leading-6 sm:text-base md:text-lg"
      />
    </div>
  );
}