import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";

export default async function NotesPage() {
  const queryClient = new QueryClient();

  // Завантажуємо нотатки
  const initialData = await fetchNotes("", 1);

  // Встановлюємо дані у queryClient
  queryClient.setQueryData(["notes", { page: 1 }], initialData);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialData={initialData} />
    </HydrationBoundary>
  );
}
