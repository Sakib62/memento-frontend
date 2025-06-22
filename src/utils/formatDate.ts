const formatDate = (timestamp: string): string => {
  const now = new Date();
  const date = new Date(timestamp);

  const diffMS = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMS / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m`;
  if (diffHour < 24) return `${diffHour}h`;
  if (diffDay < 7) return `${diffDay}d`;
  if (diffWeek < 52) return `${diffWeek}w`;
  return `${diffYear}y`;
};

export default formatDate;
