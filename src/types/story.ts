export interface Story {
  id: string;
  title: string;
  description: string;
  authorUsername: string;
  authorName: string;
  createdAt: Date;
  tags: string[];
  likeCount: number;
  commentCount: number;
}

export interface Stories {
  created: Story[];
  liked: Story[];
  commented: Story[];
}
