import Image from 'next/image';
import { Input } from '~/components/ui/input';
import { Container, PageMain } from '~/components/wrapper';
import ConnectGoogle from '~/features/integration/connect-google';
import SettingsBlock from '~/features/settings/settings-block';
import SettingsSection from '~/features/settings/settings-section';
import { HydrateClient, api } from '~/trpc/server';

const SettingsPage = async () => {
  const { user, integration } = await api.auth.me();

  return (
    <HydrateClient>
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
                <Input
                  disabled
                  value={user.username as string}
                  className="w-48 bg-secondary"
                />
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
    </HydrateClient>
  );
};

export default SettingsPage;
