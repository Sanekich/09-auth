import type { Note, NoteTag } from "@/types/note";
import type { AuthCredentials, UpdateUserData, User } from "@/types/user";
import { api } from "./api";

export interface FetchNotesParams {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: string;
}

export async function register(credentials: AuthCredentials): Promise<User> {
  const { data } = await api.post<User>("/auth/register", credentials);
  return data;
}

export async function login(credentials: AuthCredentials): Promise<User> {
  const { data } = await api.post<User>("/auth/login", credentials);
  return data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function checkSession(): Promise<boolean> {
  const { data } = await api.get<{ success: boolean }>("/auth/session");
  return data.success;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/users/me");
  return data;
}

export async function updateMe(user: UpdateUserData): Promise<User> {
  const { data } = await api.patch<User>("/users/me", user);
  return data;
}

export async function fetchNotes({
  search = "",
  page = 1,
  perPage = 12,
  tag = "",
}: FetchNotesParams): Promise<Note[]> {
  const { data } = await api.get<Note[]>("/notes", {
    params: { search, page, perPage, tag },
  });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(note: {
  title: string;
  content: string;
  tag: NoteTag;
}): Promise<Note> {
  const { data } = await api.post<Note>("/notes", note);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}
