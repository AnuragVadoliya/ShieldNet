export const formatDate = (iso?: string | null): string => {
  if (!iso) return 'N/A';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

export const timeAgo = (iso?: string | null): string => {
  if (!iso) return 'N/A';
  const then = new Date(iso).getTime();
  if (isNaN(then)) return 'N/A';
  const seconds = Math.floor((Date.now() - then) / 1000);
  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export const formatPercent = (value: number, digits = 0): string =>
  `${(value * 100).toFixed(digits)}%`;

export const shortenRef = (ref: string, head = 6, tail = 4): string => {
  if (ref.length <= head + tail + 1) return ref;
  return `${ref.slice(0, head)}…${ref.slice(-tail)}`;
};