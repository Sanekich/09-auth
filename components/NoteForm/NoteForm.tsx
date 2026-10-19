"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createNote } from "@/lib/api";
import { useNoteStore } from "@/lib/store/noteStore";
import type { NoteTag } from "@/types/note";
import css from "./NoteForm.module.css";

interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

const TAGS: NoteTag[] = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const draft = useNoteStore((state) => state.draft);
  const setDraft = useNoteStore((state) => state.setDraft);
  const clearDraft = useNoteStore((state) => state.clearDraft);

  const [error, setError] = useState("");

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createNote,
  });

  const formAction = async (formData: FormData) => {
    const title = String(formData.get("title") ?? "");
    const content = String(formData.get("content") ?? "");
    const tag = String(formData.get("tag") ?? "Todo") as NoteTag;

    if (title.trim().length < 3) {
      setError("Title must be at least 3 characters");
      return;
    }

    if (title.length > 50) {
      setError("Title must be at most 50 characters");
      return;
    }

    if (content.length > 500) {
      setError("Content must be at most 500 characters");
      return;
    }

    setError("");

    const values: NoteFormValues = {
      title,
      content,
      tag,
    };

    try {
      await mutateAsync(values);

      clearDraft();

      await queryClient.invalidateQueries({
        queryKey: ["notes"],
      });

      router.push("/notes/filter/all");
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <form action={formAction} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>

        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          defaultValue={draft.title}
          onChange={(event) => {
            setDraft({
              title: event.target.value,
            });
          }}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>

        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={draft.content}
          onChange={(event) => {
            setDraft({
              content: event.target.value,
            });
          }}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>

        <select
          id="tag"
          name="tag"
          className={css.select}
          defaultValue={draft.tag}
          onChange={(event) => {
            setDraft({
              tag: event.target.value as NoteTag,
            });
          }}
        >
          {TAGS.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      {error && <span className={css.error}>{error}</span>}

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={css.submitButton}
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
