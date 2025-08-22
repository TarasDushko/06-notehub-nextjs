"use client";

import { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import { fetchNotes, FetchNotesResponse } from "@/lib/api";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import NoteForm from "@/components/NoteForm/NoteForm";
import Modal from "@/components/Modal/Modal";
import Loader from "../loading";

import css from "./Notes.page.module.css";

interface NotesClientProps {
  dehydratedState: unknown;
}

export default function NotesClient({ dehydratedState }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [queryClient] = useState(() => new QueryClient());

  const { data, isFetching, isError, error } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", debouncedSearch, page],
    queryFn: () => fetchNotes(debouncedSearch, page),
    initialData: undefined, // Дані будуть підхоплені серверною дегідратацією
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageChange = (selectedPage: number) => {
    setPage(selectedPage);
  };

  const closeModal = () => setIsModalOpen(false);
  const openModal = () => setIsModalOpen(true);

  return (
    <QueryClientProvider client={queryClient}>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox value={search} onChange={handleSearchChange} />
          {data && data.totalPages > 1 && (
            <Pagination
              pageCount={data.totalPages}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          )}
          <button className={css.button} onClick={openModal}>
            Create note +
          </button>
        </header>

        {isFetching && <Loader />}
        {isError && <p>Error: {(error as Error).message}</p>}
        {data && data.notes.length === 0 && !isFetching && (
          <p className={css.notfound}>
            {debouncedSearch
              ? `No notes found for "${debouncedSearch}"`
              : "No notes found"}
          </p>
        )}
        {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
        {isModalOpen && (
          <Modal onClose={closeModal}>
            <NoteForm onCancel={closeModal} />
          </Modal>
        )}
      </div>
    </QueryClientProvider>
  );
}
