import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '../../services/noteService';
import type { Note } from '../../types/note';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
}

export const NoteList = ({ notes }: NoteListProps) => {
  const queryClient = useQueryClient();

  const { mutate: removeNote, isPending } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  return (
    <ul className={css.list}>
      {notes.map(({ id, title, content, tag }) => (
        <li key={id} className={css.listItem}>
          <h3 className={css.title}>{title}</h3>
          <p className={css.content}>{content}</p>
          <div className={css.footer}>
          <span className={css.tag}>{tag}</span>
          <button
            className={css.button}
            onClick={() => removeNote(id)}
            disabled={isPending}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </button>
          </div>
        </li>
      ))}
    </ul>
  );
};
