import { getStatusColor } from '@/lib/utils';

export default function StatusBadge({ status }) {
  const colorClass = getStatusColor(status);
  const label = status?.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  );
}