// app/notes/[id]/page.tsx
import { fetchNoteById } from "@/lib/api";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import NoteDetailsClient from "./NoteDetails.client";

export default async function NoteDetails({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <NoteDetailsClient noteId={id} dehydratedState={dehydrate(queryClient)} />
  );
}
