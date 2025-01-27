import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { generateUsername } from 'unique-username-generator';
import { signUp } from '~/configs/auth-client';
import { api } from '~/trpc/react';
import { SignUpFormSchema } from '../auth-schema';

const useSignUpForm = () => {
  const { mutateAsync } = api.image.updateAvatar.useMutation();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [form, fields] = useForm({
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: SignUpFormSchema }),
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onSubmit: (event, context) => {
      event.preventDefault();
      const data = parseWithZod(context.formData, { schema: SignUpFormSchema });
      if (data.status !== 'success') {
        return data.reply();
      }

      const { email, password } = data.value;
      startTransition(async () => {
        const username = generateUsername('-', 0, 15);
        signUp.email({
          name: '',
          email,
          password,
          username,
          fetchOptions: {
            onError: (ctx) => {
              toast.error(ctx.error.message);
            },
            onSuccess: (ctx) => {
              void mutateAsync({
                username,
                imageUrl: `${ctx.request.url.origin}/api/avatar`,
              });
              router.push('/');
            },
          },
        });
      });
    },
  });

  return [form, fields, isPending] as const;
};

export default useSignUpForm;
