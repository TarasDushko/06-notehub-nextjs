import { fetchNotes } from "@/lib/api";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import NotesClient from "./Notes.client";

export default async function NotesPage() {
  const queryClient = new QueryClient();

  //  через React Query
  await queryClient.prefetchQuery({
    queryKey: ["notes", { page: 1, search: "" }],
    queryFn: () => fetchNotes("", 1),
  });

  // Гідрація стану
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient />
    </HydrationBoundary>
  );
}
