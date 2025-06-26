export type ProfileTab = 'created' | 'liked' | 'commented' | 'statistics';

export const profileTabLabels: Record<ProfileTab, string> = {
  created: 'Stories',
  liked: 'Liked',
  commented: 'Commented',
  statistics: 'Statistics',
};
