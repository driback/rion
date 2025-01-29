import Image from 'next/image';
import Awaited from '~/components/awaited';
import ConnectGoogle from '~/features/integration/connect-google';
import SettingsBlock from '~/features/settings/settings-block';
import SettingsSection from '~/features/settings/settings-section';
import SettingsUsername from '~/features/settings/settings-username';
import { Container, PageMain } from '~/features/wrapper';
import { api } from '~/trpc/server';

const SettingsPage = () => {
  const res = api.auth.me();

  return (
    <Awaited promise={res}>
      {({ user, integration }) => (
        <PageMain>
          <Container className="flex flex-col gap-4">
            <SettingsBlock title="User settings">
              <SettingsSection
                title="Profile Picture"
                subtitle="You look good today!"
                rightContent={
                  <div className="overflow-hidden rounded-full">
                    <Image
                      src={user.image as string}
                      alt={user.username as string}
                      width={60}
                      height={60}
                    />
                  </div>
                }
              />
              <SettingsSection
                title="Username"
                subtitle="You can edit your username here."
                rightContent={
                  <SettingsUsername username={user.username as string} />
                }
              />
            </SettingsBlock>

            <SettingsBlock title="Integrations">
              <SettingsSection
                title="Google Drive"
                subtitle="Connect your Google Drive account."
                rightContent={<ConnectGoogle isConected={!!integration} />}
              />
            </SettingsBlock>
          </Container>
        </PageMain>
      )}
    </Awaited>
  );
};

export default SettingsPage;
