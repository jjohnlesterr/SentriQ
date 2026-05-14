"use client";

import { useParams } from "next/navigation";

import StudentResultsContent from "@/components/student/results/StudentResultsContent";

export default function StudentResultsPage() {
  const params = useParams();
  const sessionId = params.id as string;

  return <StudentResultsContent sessionId={sessionId} />;
}