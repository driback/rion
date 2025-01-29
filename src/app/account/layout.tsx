import { FlickeringGrid } from '~/components/ui/flickering-grid';
import { PageMain } from '~/features/wrapper';
import type { LayoutProps } from '~/types';

const AuthLayout = ({ children }: LayoutProps) => {
  return (
    <PageMain className="grid h-[100dvh] grid-cols-[auto_1fr] divide-x">
      {children}
      <FlickeringGrid
        className="relative inset-0 z-0 [mask-image:radial-gradient(450px_circle_at_center,white,transparent)]"
        squareSize={4}
        gridGap={6}
        color="#60A5FA"
        maxOpacity={0.5}
        flickerChance={0.1}
      />
    </PageMain>
  );
};

export default AuthLayout;
