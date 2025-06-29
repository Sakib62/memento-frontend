export type ProfileTab = 'created' | 'liked' | 'commented';

export const profileTabLabels: Record<ProfileTab, string> = {
  created: 'Stories',
  liked: 'Liked',
  commented: 'Commented',
};
