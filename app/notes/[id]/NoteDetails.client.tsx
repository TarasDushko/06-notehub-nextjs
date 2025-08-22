"use client";

import {
  DehydratedState,
  useQuery,
  HydrationBoundary,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import Loader from "@/app/loading";

import css from "./NoteDetails.page.module.css";

// Типи props
interface NoteDetailsClientProps {
  noteId: string;
  dehydratedState?: DehydratedState;
}

// Тип даних нотатки
interface NoteType {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function NoteDetailsClient({
  noteId,
  dehydratedState,
}: NoteDetailsClientProps) {
  return (
    // Передаємо серверний стан React Query, якщо він є
    <HydrationBoundary state={dehydratedState}>
      <NoteContent noteId={noteId} />
    </HydrationBoundary>
  );
}

function NoteContent({ noteId }: { noteId: string }) {
  const {
    data: note,
    isLoading,
    error,
  } = useQuery<NoteType>({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
    refetchOnMount: false,
  });

  if (isLoading) return <Loader />;
  if (error || !note) return <p>Something went wrong.</p>;

  const createdDate = new Date(note.createdAt);
  const formattedDate = isNaN(createdDate.getTime())
    ? "Invalid date"
    : createdDate.toLocaleDateString();

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>{formattedDate}</p>
      </div>
    </div>
  );
}
