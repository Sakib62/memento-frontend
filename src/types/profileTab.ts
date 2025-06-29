export type ProfileTab = 'created' | 'liked' | 'commented';

export const profileTabLabels: Record<ProfileTab, string> = {
  created: 'stories',
  liked: 'liked',
  commented: 'commented',
};
