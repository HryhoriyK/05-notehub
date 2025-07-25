import axios from 'axios';
import type { Note } from '../types/note';

axios.defaults.baseURL = 'https://notehub-public.goit.study/api';
axios.defaults.headers.common['Authorization'] = `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`;


export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  currentPage: number;
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: Note['tag'];
}

export interface CreateNoteResponse {
  note: Note;
}

export interface DeleteNoteResponse {
  note: Note;
}

export const fetchNotes = async (
  page: number,
  perPage: number,
  search?: string
): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = {
    page,
    perPage,
  };
  if (search) params.search = search;

  const { data } = await axios.get<FetchNotesResponse>('/notes', { params });
  return data;
};

export const createNote = async (
  noteData: CreateNoteParams
): Promise<CreateNoteResponse> => {
  const { data } = await axios.post<CreateNoteResponse>('/notes', noteData);
  return data;
};

export const deleteNote = async (id: string): Promise<DeleteNoteResponse> => {
  const { data } = await axios.delete<DeleteNoteResponse>(`/notes/${id}`);
  return data;
};
