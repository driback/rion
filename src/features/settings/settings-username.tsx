'use client';

import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import {
  CheckIcon,
  CircleSlashIcon,
  Edit2Icon,
  LoaderIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { memo, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { InputConform } from '~/components/conform/input-conform';
import { Button } from '~/components/ui/button';
import { updateUser } from '~/configs/auth-client';

const UsernameSchema = z.object({ username: z.string().trim() });

const SettingsUsername = memo(({ username }: { username: string }) => {
  const [isEdit, setEdit] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [form, field] = useForm({
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: UsernameSchema }),
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onSubmit: (event, context) => {
      event.preventDefault();
      const data = parseWithZod(context.formData, { schema: UsernameSchema });
      if (data.status !== 'success') return data.reply();

      startTransition(() => {
        updateUser(
          { username: data.value.username },
          {
            onSuccess: () => {
              setEdit(false);
              toast.success(`'Username updated to ${data.value.username}`);
              router.refresh();
            },
            onError: (err) => {
              toast.error(err.error.message);
            },
          }
        );
      });
    },
  });

  const IconComponent = !isEdit ? Edit2Icon : CircleSlashIcon;
  const buttonTitle = !isEdit ? 'Edit username' : 'Cancel edit';
  const SubmitIcon = !isPending ? CheckIcon : LoaderIcon;

  return (
    <div className="relative flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        title={buttonTitle}
        onClick={() => setEdit((prev) => !prev)}
      >
        <IconComponent className="size-4" />
      </Button>

      <form
        id={form.id}
        onSubmit={form.onSubmit}
        noValidate
        className="relative"
      >
        <InputConform
          meta={field.username}
          type="text"
          disabled={!isEdit || isPending}
          defaultValue={username}
          className="w-48 bg-secondary pr-9"
        />
        {isEdit && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-0 right-0"
            disabled={isPending}
          >
            <SubmitIcon className="size-4 disabled:animate-spin" />
          </Button>
        )}
      </form>
    </div>
  );
});

export default SettingsUsername;
