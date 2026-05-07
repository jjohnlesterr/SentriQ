"use client";

import { LucideIcon, ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PortalCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  variant: "primary" | "secondary";
  glowClass: string;
  iconClass: string;
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}

export default function PortalCard({
  icon: Icon,
  title,
  description,
  buttonText,
  variant,
  glowClass,
  iconClass,
  loading,
  disabled,
  onClick,
}: PortalCardProps) {
  return (
    <Card className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-0 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="relative h-full p-8">
        <div
          className={`absolute right-0 top-0 h-32 w-32 rounded-full blur-2xl ${glowClass}`}
        />

        <div className="relative z-10">
          <div
            className={`mb-8 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg ${iconClass}`}
          >
            <Icon className="h-8 w-8" />
          </div>

          <h2 className="text-3xl font-extrabold text-white">{title}</h2>

          <p className="mt-5 max-w-md text-lg leading-7 text-slate-300">
            {description}
          </p>

          <Button
            type="button"
            variant={variant}
            onClick={onClick}
            className="mt-8 h-12 w-full cursor-pointer text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed"
            disabled={disabled}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Redirecting...
              </>
            ) : (
              <>
                {buttonText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}