"use client";

import AuthShell from "@/components/auth/AuthShell";
import JoinRequestForm from "@/components/student/join/JoinRequestForm";
import WaitingApprovalCard from "@/components/student/join/WaitingApprovalCard";
import { Card } from "@/components/ui/card";
import { useStudentJoin } from "@/hooks/student/useStudentJoin";

export default function StudentJoinForm() {
  const join = useStudentJoin();

  return (
    <AuthShell>
      <Card className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-0 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="relative p-5 sm:p-6 md:p-10">
          <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-violet-500/10 blur-2xl md:h-40 md:w-40" />

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
    </AuthShell>
  );
}