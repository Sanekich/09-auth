import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

const PER_PAGE = 12;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const tag = slug[0] === "all" ? "All" : (slug[0] ?? "All");

  const title = `${tag} notes | NoteHub`;

  const description =
    tag === "All"
      ? "Browse all notes in NoteHub."
      : `Browse ${tag} notes in NoteHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://notehub.com/notes/filter/${slug.join("/" )}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: `${tag} notes in NoteHub`,
        },
      ],
    },
  };
}

export default async function FilteredNotesPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
} ) {
  const { slug } = await params;

  const tag = slug[0] === "all" ? "" : (slug[0] ?? "");

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: PER_PAGE,
        search: "",
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
