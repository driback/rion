import { FileCheckIcon, InfoIcon } from 'lucide-react';
import Greetings from '~/components/greetings';
import ConnectGoogle from '~/features/integration/connect-google';
import CreateTaskForm from '~/features/task/create-task-form';
import RecenTasks from '~/features/task/recent-tasks';
import { Container, PageMain } from '~/features/wrapper';
import { api } from '~/trpc/server';

const Home = async () => {
  const me = await api.auth.me();

  const isIntegrated = !!me.integration?.id;

  return (
    <PageMain>
      {isIntegrated ? null : (
        <div className="mx-auto flex w-fit items-center gap-2 rounded-full border px-3 py-2 font-medium text-sm">
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
          <CreateTaskForm />
          <div className="absolute inset-0 hidden" />
        </Container>

        <Container className="relative flex flex-col gap-4">
          <div className="flex items-center">
            <FileCheckIcon className="mr-2 size-4" />
            <h2 className="text-sm">Your recent tasks</h2>
          </div>
          <RecenTasks userId={me.user.id} page={1} limit={20} />
          <div className="absolute inset-0 hidden" />
        </Container>
        <div className="absolute inset-0 hidden group-aria-disabled:block group-aria-disabled:bg-background/60" />
      </div>
    </PageMain>
  );
};

export default Home;
