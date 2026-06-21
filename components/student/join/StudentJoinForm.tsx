"use client";

import JoinRequestForm from "@/components/student/join/JoinRequestForm";
import WaitingApprovalCard from "@/components/student/join/WaitingApprovalCard";
import { useStudentJoin } from "@/hooks/student/useStudentJoin";

export default function StudentJoinForm() {
  const join = useStudentJoin();

  return (
    <div className="space-y-6">
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
  );
}