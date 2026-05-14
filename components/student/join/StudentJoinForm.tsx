"use client";

import { ArrowLeft } from "lucide-react";

import JoinRequestForm from "@/components/student/join/JoinRequestForm";
import WaitingApprovalCard from "@/components/student/join/WaitingApprovalCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useStudentJoin } from "@/hooks/student/useStudentJoin";

export default function StudentJoinForm() {
  const join = useStudentJoin();

  return (
    <section className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-5 sm:px-6 md:px-10 md:py-12 lg:px-16">
      <div className="w-full max-w-md">
        <Button
          type="button"
          variant="ghost"
          className="mb-4 h-10 border border-white/10 bg-white/5 px-4 text-sm md:mb-6"
          onClick={join.goBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Card className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-0 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="relative p-5 sm:p-6 md:p-8">
            <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-violet-500/10 blur-2xl md:h-32 md:w-32" />

            <div className="relative z-10">
              {join.isWaitingApproval ? (
                <WaitingApprovalCard
                  studentName={join.studentName}
                  quizCode={join.quizCode}
                  onCancel={join.resetRequest}
                />
              ) : (
                <JoinRequestForm
                  studentName={join.studentName}
                  quizCode={join.quizCode}
                  error={join.error}
                  isLoading={join.isLoading}
                  onStudentNameChange={join.setStudentName}
                  onQuizCodeChange={join.setQuizCode}
                  onSubmit={join.handleSubmit}
                />
              )}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}