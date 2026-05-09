"use server";

import { teachers } from "../data/mock-db";

export async function teacherLogin(
  email: string,
  password: string
): Promise<{ id: string; name: string; email: string }> {
  const existing = teachers.find(
    (teacher) => teacher.email.toLowerCase() === email.toLowerCase()
  );

  if (!existing || existing.password !== password) {
    throw new Error("Invalid email or password");
  }

  return {
    id: existing.id,
    name: existing.name,
    email: existing.email,
  };
}