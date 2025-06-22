import { Dispatch, SetStateAction } from 'react';

export interface Comment {
  id: string;
  userId: string | null;
  comment: string;
  createdAt: string;
  updatedAt: string;
  authorName: string | null;
  authorUsername: string | null;
  status?: string;
  prevUpdatedAt?: string;
  prevComment?: string;
}

export type SetState<T> = Dispatch<SetStateAction<T>>;
export type SetComments = SetState<Comment[]>;
