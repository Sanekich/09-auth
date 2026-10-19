"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import Link from "next/link";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import css from "./NotesPage.module.css";

const PER_PAGE = 12;

export default function NotesClient({ tag }: { tag: string }) {
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, search, tag],
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search, tag }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);
  const notes = data?.notes ?? [];
  return (
    <main className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={inputValue}
          onChange={(value) => {
            setInputValue(value);
            debouncedSearch(value);
          }}
        />
        {(data?.totalPages ?? 0) > 1 && (
          <Pagination
            totalPages={data?.totalPages ?? 0}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
      <Link className={css.button} href="/notes/action/create">
        Create note +
      </Link>
      </header>
      {isLoading && <p>Loading notes...</p>}
      {isError && <p>Something went wrong. Please try again.</p>}
      {notes.length > 0 && <NoteList notes={notes} />}

    </main>
  );
}
