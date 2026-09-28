import AuthPageShell from "@/components/layout/AuthPageShell";
import FormMessage from "@/components/shared/FormMessage";
import TeacherLoginForm from "@/components/teacher/login/TeacherLoginForm";
import { getSafeNextPath } from "@/lib/auth/redirect";

const ERROR_MESSAGES: Record<string, string> = {
  confirmation:
    "We couldn't sign you in from that link. If you just confirmed your email, please log in below.",
};

export default async function TeacherLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : null;
  const errorKey = typeof params.error === "string" ? params.error : null;
  const errorMessage = errorKey ? ERROR_MESSAGES[errorKey] : null;

  return (
    <AuthPageShell notice={errorMessage && <FormMessage>{errorMessage}</FormMessage>}>
      <TeacherLoginForm nextPath={getSafeNextPath(next)} />
    </AuthPageShell>
  );
}
