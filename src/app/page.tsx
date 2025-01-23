import { FileCheckIcon } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import AuthGoogle from '~/components/auth-google';
import GoogleDriveForm from '~/components/form';
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
          <div className="mx-auto mt-6 flex w-full max-w-4xl flex-col items-center gap-7">
            <h1 className="font-medium text-[clamp(2rem,-1.5rem+8vw,3rem)] leading-none">
              Hello there
            </h1>
          </div>

          <div
            data-state={Boolean(googleSub)}
            className="relative mx-auto flex w-full max-w-4xl justify-center data-[state=false]:pointer-events-none"
          >
            <GoogleDriveForm />
            <div
              data-state={Boolean(googleSub)}
              className="absolute inset-0 data-[state=true]:hidden data-[state=false]:bg-background/60"
            />
          </div>

          <div className="relative mx-auto flex w-full max-w-2xl flex-col gap-4">
            <div className="flex items-center">
              <FileCheckIcon className="mr-2 size-4" />
              <h2 className="text-sm">Your recent tasks</h2>
            </div>
            <RecenTasks />
          </div>
        </main>
      </div>
    </RecentTaskStoreProvider>
  );
};

export default Home;
