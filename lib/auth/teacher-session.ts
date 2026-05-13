export type TeacherSession = {
  id: string;
  name: string;
};

export function getTeacherSession(): TeacherSession | null {
  if (typeof window === "undefined") return null;

  const id = sessionStorage.getItem("teacherId");
  const name = sessionStorage.getItem("teacherName");

  if (!id) return null;

  return {
    id,
    name: name || "Teacher",
  };
}

export function setTeacherSession(session: TeacherSession) {
  sessionStorage.setItem("teacherId", session.id);
  sessionStorage.setItem("teacherName", session.name);
}

export function clearTeacherSession() {
  sessionStorage.removeItem("teacherId");
  sessionStorage.removeItem("teacherName");
}