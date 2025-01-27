import { FileCheckIcon, InfoIcon } from 'lucide-react';
import { cookies } from 'next/headers';
import GoogleDriveForm from '~/components/form';
import Greetings from '~/components/greetings';
import { RecentTaskStoreProvider } from '~/components/providers/recent-task-provider';
import RecenTasks from '~/components/recent-tasks';
import { Container, PageMain } from '~/components/wrapper';
import ConnectGoogle from '~/features/integration/connect-google';
import { COOKIE_NAME } from '~/lib/constants';

const Home = async () => {
  const cookieStore = await cookies();
  const googleIntegration = cookieStore.get(
    COOKIE_NAME.GOOGLE_INTEGRATION
  )?.value;

  const isIntegrated = !!googleIntegration;

  return (
    <RecentTaskStoreProvider>
      <PageMain>
        {isIntegrated ? null : (
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-[.8rem]">
            <InfoIcon className="size-4" />
            <p>You have to connect your google drive before using it.</p>
            <ConnectGoogle minimal />
          </div>
        )}

        <Container className="mt-6 flex flex-col items-center gap-2">
          <Greetings />
        </Container>

        <div
          aria-disabled={!isIntegrated}
          className="group relative isolate flex flex-col gap-6 aria-disabled:pointer-events-none"
        >
          <Container className="relative flex justify-center">
            <GoogleDriveForm />
            <div className="absolute inset-0 hidden" />
          </Container>

          <Container className="relative flex flex-col gap-4">
            <div className="flex items-center">
              <FileCheckIcon className="mr-2 size-4" />
              <h2 className="text-sm">Your recent tasks</h2>
            </div>
            <RecenTasks />
            <div className="absolute inset-0 hidden" />
          </Container>
          <div className="absolute inset-0 hidden group-aria-disabled:block group-aria-disabled:bg-background/60" />
        </div>
      </PageMain>
    </RecentTaskStoreProvider>
  );
};

export default Home;
