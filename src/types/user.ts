export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  joinDate: Date;
  role: number;
}

export type UserWithStoryCount = User & {
  createdCount?: number;
  likedCount?: number;
  commentedCount?: number;
};
