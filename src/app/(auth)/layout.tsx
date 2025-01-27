import Link from 'next/link';
import { PageHeader } from '~/components/wrapper';
import AuthUser from '~/features/auth/auth-user';
import type { LayoutProps } from '~/types';

const PageLayout = ({ children }: LayoutProps) => {
  return (
    <>
      <PageHeader>
        <Link href="/">Rion</Link>
        <div className="flex items-center gap-2">
          <AuthUser />
        </div>
      </PageHeader>
      {children}
    </>
  );
};

export default PageLayout;
