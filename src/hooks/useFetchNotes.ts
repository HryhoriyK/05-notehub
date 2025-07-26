import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchNotes } from '../services/noteService';
import type { FetchNotesResponse } from '../services/noteService';

export const useFetchNotes = (
  currentPage: number,
  perPage: number,
  search?: string
) => {
  return useQuery<FetchNotesResponse>({
    queryKey: ['notes', currentPage, perPage, search],
    queryFn: () => fetchNotes(currentPage, perPage, search),
    placeholderData: keepPreviousData,
  });
};
