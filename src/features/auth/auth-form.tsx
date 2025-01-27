'use client';
import { ArrowRightIcon, LoaderIcon } from 'lucide-react';
import { CheckboxConform } from '~/components/conform/checkbox-conform';
import FieldConform from '~/components/conform/field-conform';
import { InputConform } from '~/components/conform/input-conform';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import useSignInForm from './hooks/use-sign-in-hook';
import useSignUpForm from './hooks/use-sign-up-hook';

export const SignUpForm = () => {
  const [form, fields, isPending] = useSignUpForm();

  return (
    <form
      className="flex flex-col gap-4"
      id={form.id}
      onSubmit={form.onSubmit}
      noValidate
    >
      <FieldConform errors={fields.email.errors}>
        <Label htmlFor={fields.email.id}>Email</Label>
        <InputConform
          meta={fields.email}
          type="text"
          placeholder="me@example.com"
          disabled={isPending}
        />
      </FieldConform>
      <FieldConform errors={fields.password.errors}>
        <Label htmlFor={fields.password.id}>Password</Label>
        <InputConform
          meta={fields.password}
          type="password"
          placeholder="******"
          disabled={isPending}
        />
      </FieldConform>
      <Button type="submit" disabled={isPending}>
        Sign up
        {isPending ? (
          <LoaderIcon className="size-4" />
        ) : (
          <ArrowRightIcon className="size-4" />
        )}
      </Button>
    </form>
  );
};

export const SignInForm = () => {
  const [form, fields, isPending] = useSignInForm();

  return (
    <form
      className="flex flex-col gap-4"
      id={form.id}
      onSubmit={form.onSubmit}
      noValidate
    >
      <FieldConform errors={fields.email.errors}>
        <Label htmlFor={fields.email.id}>Email</Label>
        <InputConform
          meta={fields.email}
          type="text"
          placeholder="me@example.com"
          disabled={isPending}
        />
      </FieldConform>
      <FieldConform errors={fields.password.errors}>
        <Label htmlFor={fields.password.id}>Password</Label>
        <InputConform
          meta={fields.password}
          type="password"
          placeholder="******"
          disabled={isPending}
        />
      </FieldConform>
      <FieldConform
        errors={fields.rememberMe.errors}
        className="flex-row items-center"
      >
        <CheckboxConform meta={fields.rememberMe} disabled={isPending} />
        <Label htmlFor={fields.rememberMe.id} className="font-medium text-sm">
          Remember me
        </Label>
      </FieldConform>
      <Button type="submit" disabled={isPending}>
        Sign In
        {isPending ? (
          <LoaderIcon className="size-4" />
        ) : (
          <ArrowRightIcon className="size-4" />
        )}
      </Button>
    </form>
  );
};
