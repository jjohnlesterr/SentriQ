"use client";

import { Suspense } from "react";

import PageLoader from "@/components/shared/PageLoader";
import TeacherDashboardContent from "@/components/teacher/dashboard/TeacherDashboardContent";

export default function TeacherDashboardPage() {
  return (
    <Suspense fallback={<PageLoader label="Loading dashboard..." />}>
      <TeacherDashboardContent />
    </Suspense>
  );
}