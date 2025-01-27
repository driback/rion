import { SignUpForm } from '~/features/auth/auth-form';
import AuthHeader from '~/features/auth/auth-header';
import AuthSocialButtons from '~/features/auth/auth-social-buttons';
import AuthToggleLink from '~/features/auth/auth-toggle-link';
import AuthWrapper from '~/features/auth/auth-wrapper';
import OrDivider from '~/features/auth/or-divider';

const SignUpPage = () => {
  return (
    <AuthWrapper>
      <AuthHeader title="Get Started" description="Create a new account" />
      <div className="flex flex-col gap-6">
        <AuthSocialButtons />
        <OrDivider />
        <SignUpForm />
      </div>
      <AuthToggleLink mode="sign-up" />
    </AuthWrapper>
  );
};

export default SignUpPage;
