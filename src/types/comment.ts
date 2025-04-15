export interface Comment {
  id: string;
  userId: string | null;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  authorName: string | null;
  authorUsername: string | null;
}
