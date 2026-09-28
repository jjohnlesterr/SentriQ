import AuthPageShell from "@/components/layout/AuthPageShell";
import TeacherRegisterForm from "@/components/teacher/register/TeacherRegisterForm";

export default function TeacherRegisterPage() {
  return (
    <AuthPageShell>
      <TeacherRegisterForm />
    </AuthPageShell>
  );
}
