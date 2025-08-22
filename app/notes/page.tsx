// app/notes/page.tsx
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

export default async function NotesPage() {
  const queryClient = new QueryClient();

  // Серверне попереднє завантаження даних
  await queryClient.prefetchQuery(["notes", "", 1], () => fetchNotes("", 1));

  const dehydratedState = dehydrate(queryClient);

  return <NotesClient dehydratedState={dehydratedState} />;
}
