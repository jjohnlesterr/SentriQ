"use client";

import { ArrowRight, Loader2, LucideIcon } from "lucide-react";

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
    <Card className="h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-0 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="relative h-full p-4 sm:p-6 md:p-8">
        <div
          className={`absolute right-0 top-0 h-24 w-24 rounded-full blur-2xl md:h-32 md:w-32 ${glowClass}`}
        />

        <div className="relative z-10 flex h-full flex-col justify-between">
          <div>
            <div
              className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg sm:h-14 sm:w-14 md:mb-8 md:h-16 md:w-16 ${iconClass}`}
            >
              <Icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
            </div>

            <h2 className="text-xl font-extrabold text-white sm:text-2xl md:text-3xl">
              {title}
            </h2>

            <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-300 sm:text-base md:mt-5 md:max-w-md md:text-lg md:leading-7">
              {description}
            </p>
          </div>

          <Button
            type="button"
            variant={variant}
            onClick={onClick}
            disabled={disabled}
            className="mt-5 h-11 w-full cursor-pointer text-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed sm:text-sm md:mt-8 md:h-12 md:text-base"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin md:mr-2 md:h-5 md:w-5" />
                Redirecting...
              </>
            ) : (
              <>
                {buttonText}
                <ArrowRight className="h-4 w-4 md:ml-2 md:h-5 md:w-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}