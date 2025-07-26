import { useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { useFetchNotes } from '../../hooks/useFetchNotes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote, deleteNote } from '../../services/noteService';
import type { CreateNoteParams } from '../../services/noteService';

import { SearchBox } from '../SearchBox/SearchBox';
import { Pagination } from '../Pagination/Pagination';
import { NoteList } from '../NoteList/NoteList';
import { Modal } from '../Modal/Modal';
import { NoteForm } from '../NoteForm/NoteForm';

import css from './App.module.css';

const App = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const perPage = 12;

  const { data, isLoading, isError } = useFetchNotes(currentPage, perPage, debouncedSearch);

  const { mutate: addNote } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setModalOpen(false);
      setCurrentPage(1);
    },
  });

  const { mutate: removeNote } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleCreateNote = (values: CreateNoteParams) => {
    addNote(values);
  };

  const handleDeleteNote = (id: string) => {
    removeNote(id);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />

        {data?.totalPages && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        <button className={css.button} onClick={() => setModalOpen(true)}>
          Create note +
        </button>
      </header>

      {!isLoading && !isError && Array.isArray(data?.notes) && data.notes.length > 0 && (
        <NoteList notes={data.notes} onDelete={handleDeleteNote} />
      )}

      {isModalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <NoteForm onCancel={() => setModalOpen(false)} onSubmit={handleCreateNote} />
        </Modal>
      )}
    </div>
  );
};

export default App;
