import { LoaderIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Awaited from '~/components/awaited';
import type { TGetRecentTaskInput } from '~/server/api/routers/task/task.schema';
import { api } from '~/trpc/server';

const RecentTasks = (props: TGetRecentTaskInput) => {
  const res = api.task.getRecentTasks(props);

  return (
    <Awaited
      promise={res}
      loading={
        <LoaderIcon className="mx-auto size-4 animate-spin text-center" />
      }
    >
      {({ data }) => (
        <ul className="flex flex-col gap-3">
          {data.map((data) => (
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
      )}
    </Awaited>
  );
};

export default RecentTasks;
