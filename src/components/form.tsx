'use client';

import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { LoaderIcon } from 'lucide-react';
import { memo } from 'react';
import { toast } from 'sonner';
import { CopyInput } from '~/server/api/routers/file/file.schema';
import { api } from '~/trpc/react';
import { InputConform } from './conform/input';
import GoogleDriveIcon from './icons/google-drive';
import { useRecentTaskStore } from './providers/recent-task-provider';
import { Button } from './ui/button';

const GoogleDriveForm = memo(() => {
  const setTask = useRecentTaskStore((s) => s.setTask);

  const { mutateAsync, isPending } = api.file.copy.useMutation({
    onSuccess: (data) => {
      setTask(data);
      toast.success('File copied successfully');
    },
    onError: (error) => toast.error(error.message),
  });

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: CopyInput });
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onSubmit: (event, context) => {
      event.preventDefault();
      const data = parseWithZod(context.formData, { schema: CopyInput });
      if (data.status !== 'success') {
        return data.reply();
      }

      const parsedData = data.value;
      console.log('🚀 ~ GoogleDriveForm ~ parsedData:', parsedData);
      void mutateAsync(parsedData);
    },
  });

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      noValidate
      className="flex w-full max-w-2xl gap-2"
      aria-label="Google Drive URL submission form"
    >
      <div className="w-full">
        <div className="relative w-full">
          <GoogleDriveIcon
            data-state={Boolean(fields.url.errors)}
            className="-translate-y-1/2 absolute top-1/2 left-3 size-4 opacity-60 data-[state=true]:text-red-500 data-[state=false]:opacity-100 data-[state=true]:opacity-100"
            aria-hidden="true"
          />

          <InputConform
            type="url"
            meta={fields.url}
            placeholder="https://drive.google.com/file/d/..."
            className="bg-neutral-900 pl-9 aria-[invalid=true]:border-destructive aria-[invalid=true]:text-red-500 aria-[invalid=true]:focus-visible:border-destructive aria-[invalid=true]:focus-visible:ring-destructive/20"
            aria-label="Google Drive URL"
            aria-invalid={Boolean(fields.url.errors)}
            aria-busy={isPending}
            disabled={isPending}
          />
        </div>
        {fields.url.errors && (
          <p role="alert" className="mt-2 text-red-500 text-xs">
            {fields.url.errors}
          </p>
        )}
      </div>
      <Button type="submit" className="w-20 rounded-lg" disabled={isPending}>
        {isPending ? <LoaderIcon className="size-4 animate-spin" /> : 'Copy'}
      </Button>
    </form>
  );
});

GoogleDriveForm.displayName = 'GoogleDriveForm';

export default GoogleDriveForm;
