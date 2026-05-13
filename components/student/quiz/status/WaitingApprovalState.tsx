"use client";

import { Loader2 } from "lucide-react";

import { Card } from "@/components/ui/card";

export default function WaitingApprovalState() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-yellow-400/20 bg-yellow-500/10 text-yellow-300">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>

        <h1 className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-3xl font-extrabold text-transparent">
          Waiting for Approval
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-300">
          Your teacher has not approved your request yet.
        </p>

        <p className="mt-2 text-xs text-slate-500">
          This page refreshes automatically.
        </p>
      </Card>
    </div>
  );
}