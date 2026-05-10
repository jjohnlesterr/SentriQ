"use client";

import Image from "next/image";
import { LayoutDashboard, LogOut, X } from "lucide-react";

type Props = {
  teacherName: string;
  open?: boolean;
  onClose?: () => void;
  onLogout: () => void;
};

export default function TeacherSidebar({
  teacherName,
  open = false,
  onClose,
  onLogout,
}: Props) {
  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={
          open
            ? "fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-white/10 bg-slate-950/95 px-4 py-5 text-white shadow-2xl backdrop-blur-2xl transition-transform lg:hidden"
            : "hidden h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-slate-950/60 px-4 py-5 text-white backdrop-blur-xl lg:flex"
        }
      >
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-xl">
              <Image
                src="/logo.png"
                alt="SentriQ Logo"
                fill
                sizes="36px"
                className="object-contain"
                priority
              />
            </div>

            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-xl font-extrabold text-transparent">
              SentriQ
            </span>
          </div>

          {open && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-white/10 hover:text-white lg:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <nav className="space-y-2">
          <div className="flex items-center gap-3 rounded-2xl border border-blue-400/20 bg-blue-500/10 px-4 py-3 text-sm font-medium text-blue-200">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </div>
        </nav>

        <div className="mt-auto space-y-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-sm font-bold text-white">
                {teacherName?.charAt(0)?.toUpperCase() || "T"}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {teacherName || "Teacher"}
                </p>
                <p className="text-xs text-slate-500">Teacher Account</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
