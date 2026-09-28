import AuthPageShell from "@/components/layout/AuthPageShell";
import StudentJoinForm from "@/components/student/join/StudentJoinForm";

export default function StudentJoinPage() {
  return (
    <AuthPageShell>
      <StudentJoinForm />
    </AuthPageShell>
  );
}
