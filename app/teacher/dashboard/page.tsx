"use client";

import { Suspense } from "react";

import LoginTransitionLoader from "@/components/shared/LoginTransitionLoader";
import TeacherDashboardContent from "@/components/teacher/dashboard/TeacherDashboardContent";

export default function TeacherDashboardPage() {
  return (
    <Suspense fallback={<LoginTransitionLoader />}>
      <TeacherDashboardContent />
    </Suspense>
  );
}