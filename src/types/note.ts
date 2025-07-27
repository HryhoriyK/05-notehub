export interface Note {
  id: number;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string; 
}

export const NoteTag = {
  Todo: 'Todo',
  Work: 'Work',
  Personal: 'Personal',
  Meeting: 'Meeting',
  Shopping: 'Shopping',
} as const;

export type NoteTag = keyof typeof NoteTag;