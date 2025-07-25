import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNotes, createNote, deleteNote } from '../../services/noteService';
import { Note, CreateNoteParams } from '../../types/note';
import { useDebounce } from '../../hooks/useDebounce';

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

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', currentPage, debouncedSearch],
    queryFn: () => fetchNotes(currentPage, perPage, debouncedSearch),
    keepPreviousData: true,
    onSuccess: (data) => {
      console.log('Fetched notes:', data);
    }
  });

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

        {data?.totalPages > 1 && (
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

      {!isLoading && !isError && data?.notes.length > 0 && (
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