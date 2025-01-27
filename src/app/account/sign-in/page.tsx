import { SignInForm } from '~/features/auth/auth-form';
import AuthHeader from '~/features/auth/auth-header';
import AuthSocialButtons from '~/features/auth/auth-social-buttons';
import AuthToggleLink from '~/features/auth/auth-toggle-link';
import AuthWrapper from '~/features/auth/auth-wrapper';
import OrDivider from '~/features/auth/or-divider';

const SignIn = () => {
  return (
    <AuthWrapper>
      <AuthHeader title="Welcome Back" description="Sign in to your account" />
      <div className="flex flex-col gap-6">
        <AuthSocialButtons />
        <OrDivider />
        <SignInForm />
      </div>
      <AuthToggleLink mode="sign-in" />
    </AuthWrapper>
  );
};

export default SignIn;
