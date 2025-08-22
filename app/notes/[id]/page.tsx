import { fetchNoteById } from "@/lib/api";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import NoteDetailsClient from "./NoteDetails.client";

// Серверний компонент
export default async function NoteDetails(props: unknown) {
  // props.params — це фактично Promise<{ id: string }>
  const { id } = await (props as { params: Promise<{ id: string }> }).params;

  const queryClient = new QueryClient();

  // Серверне завантаження даних
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient noteId={id} />
    </HydrationBoundary>
  );
}
