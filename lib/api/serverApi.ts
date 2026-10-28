import { cookies } from "next/headers";
import type { AxiosResponse } from "axios";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";
import { api } from "./api";

export async function fetchNotes(params: {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: string;
}): Promise<Note[]> {
  const cookieStore = await cookies();
  const { data } = await api.get<Note[]>("/notes", {
    params,
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const cookieStore = await cookies();
  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
}

export async function getMe(): Promise<User> {
  const cookieStore = await cookies();
  const { data } = await api.get<User>("/users/me", {
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
}

export async function checkSession(): Promise<AxiosResponse<{ success: boolean }>> {
  const cookieStore = await cookies();
  return api.get<{ success: boolean }>("/auth/session", {
    headers: { Cookie: cookieStore.toString() },
  });
}
