import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NoteTag } from "@/types/note";

interface NoteDraft {
  title: string;
  content: string;
  tag: NoteTag;
}

interface NoteStore {
  draft: NoteDraft;
  setDraft: (draft: Partial<NoteDraft>) => void;
  clearDraft: () => void;
}

const initialDraft: NoteDraft = {
  title: "",
  content: "",
  tag: "Todo",
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,

      setDraft: (newDraft) =>
        set((state) => ({
          draft: {
            ...state.draft,
            ...newDraft,
          },
        })),

      clearDraft: () =>
        set({
          draft: initialDraft,
        }),
    }),
    {
      name: "note-draft",
      partialize: (state) => ({
        draft: state.draft,
      }),
    },
  ),
);
