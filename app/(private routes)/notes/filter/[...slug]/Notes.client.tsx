"use client";

import Link from "next/link";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";
import { useParams } from "next/navigation";
import { fetchNotes } from "@/lib/api/clientApi";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import type { Note } from "@/types/note";
import css from "./NotesPage.module.css";

const PER_PAGE = 12;

interface NotesClientProps {
  tag?: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const params = useParams<{ slug?: string[] }>();
  const routeTag = params.slug?.[0] ?? "all";
  const activeTag = tag ?? (routeTag === "all" ? "" : routeTag);
  const [page, setPage] = useState<number>(1);
  const [inputValue, setInputValue] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const { data, isLoading, isError } = useQuery<Note[]>({
    queryKey: ["notes", page, search, activeTag],
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search, tag: activeTag }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const notes: Note[] = data ?? [];
  const totalPages = notes.length === PER_PAGE ? page + 1 : page;

  return (
    <main className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={inputValue}
          onChange={(value: string) => {
            setInputValue(value);
            debouncedSearch(value);
          }}
        />
        <Link className={css.button} href="/notes/action/create">
          Create note +
        </Link>
      </header>
      {isLoading && <p>Loading notes...</p>}
      {isError && <p>Something went wrong. Please try again.</p>}
      {!isLoading && !isError && notes.length === 0 && <p>No notes found.</p>}
      {notes.length > 0 && <NoteList notes={notes} />}
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={page}
          onPageChange={(nextPage: number) => setPage(nextPage)}
        />
      )}
    </main>
  );
}
