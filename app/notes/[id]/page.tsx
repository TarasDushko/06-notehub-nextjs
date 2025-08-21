import { fetchNoteById } from "@/lib/api";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import NoteDetailsClient from "./NoteDetails.client";

const NoteDetails = async (props: unknown) => {
  const params = (props as { params: { id: string } }).params;
  const { id } = params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <NoteDetailsClient noteId={id} dehydratedState={dehydrate(queryClient)} />
  );
};

export default NoteDetails;
