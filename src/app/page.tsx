import { FileCheckIcon } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import AuthGoogle from '~/components/auth-google';
import GoogleDriveForm from '~/components/form';
import Greetings from '~/components/greetings';
import { RecentTaskStoreProvider } from '~/components/providers/recent-task-provider';
import RecenTasks from '~/components/recent-tasks';
import { COOKIE_NAME } from '~/lib/constants';

const Home = async () => {
  const cookieStore = await cookies();
  const googleSub = cookieStore.get(COOKIE_NAME.GOOGlE_SUB)?.value;

  return (
    <RecentTaskStoreProvider>
      <div className="relative flex min-h-[100dvh] w-dvw flex-col overflow-clip px-4">
        <header className="flex items-center justify-between py-4">
          <Link href="/">Rion</Link>
          <AuthGoogle />
        </header>
        <main className="relative flex w-full flex-col gap-8 pb-20">
          <div className="mx-auto mt-6 flex w-full max-w-4xl flex-col items-center gap-2">
            <Greetings />
          </div>

          <div
            aria-disabled={!googleSub}
            className="relative mx-auto flex w-full max-w-4xl justify-center aria-disabled:pointer-events-none aria-disabled:select-none"
          >
            <GoogleDriveForm />
            <div
              aria-disabled={!googleSub}
              className="absolute inset-0 hidden aria-disabled:pointer-events-none aria-disabled:block aria-disabled:bg-background/60"
            />
          </div>

          <div
            aria-disabled={!googleSub}
            className="relative mx-auto flex w-full max-w-2xl flex-col gap-4 aria-disabled:pointer-events-none aria-disabled:select-none"
          >
            <div className="flex items-center">
              <FileCheckIcon className="mr-2 size-4" />
              <h2 className="text-sm">Your recent tasks</h2>
            </div>
            <RecenTasks />
            <div
              aria-disabled={!googleSub}
              className="absolute inset-0 hidden aria-disabled:block aria-disabled:bg-background/60"
            />
          </div>
        </main>
      </div>
    </RecentTaskStoreProvider>
  );
};

export default Home;
