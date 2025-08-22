import { fetchNoteById } from "@/lib/api";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import NoteDetailsClient from "./NoteDetails.client";

// Оголошуємо правильний тип для props
interface NotePageProps {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function NoteDetails({ params }: NotePageProps) {
  const { id } = params;

  const queryClient = new QueryClient();

  // Серверне завантаження даних через React Query
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
