import Link from 'next/link';
import AuthUser from '~/features/auth/auth-user';
import { PageHeader } from '~/features/wrapper';
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
