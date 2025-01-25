'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRecentTaskStore } from './providers/recent-task-provider';

const RecentTasks = () => {
  const { tasks, _hasHydrated } = useRecentTaskStore((s) => ({
    tasks: s.task,
    _hasHydrated: s._hasHydrated,
  }));

  if (!_hasHydrated) {
    return <span className="text-center">loading...</span>;
  }

  if (!tasks.length) {
    return <span className="text-center">You dont have any recent task</span>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {tasks.map((data) => (
        <li key={data.id} className="flex items-center gap-2">
          <Image
            src={data.iconLink}
            alt={data.mimeType}
            width={16}
            height={16}
          />
          <Link
            href={data.webViewLink}
            target="_blank"
            className="text-sm hover:underline"
          >
            {data.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default RecentTasks;
