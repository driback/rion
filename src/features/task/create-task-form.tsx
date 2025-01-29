'use client';

import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { ArrowUpIcon, LoaderIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { memo, useState } from 'react';
import { toast } from 'sonner';
import { CopyFileInput } from '~/server/api/routers/task/task.schema';
import { api } from '~/trpc/react';
import { InputConform } from '../../components/conform/input-conform';
import { Button } from '../../components/ui/button';
import FolderPicker from './folder-picker/folder-picker';

const CreateTaskForm = memo(() => {
  const [folderId, setFolderId] = useState<string | null>(null);
  const router = useRouter();

  const { mutateAsync, isPending } = api.task.copyFile.useMutation({
    onSuccess: () => {
      router.refresh();
      toast.success('File copied successfully');
    },
    onError: (error) => toast.error(error.message),
  });

  const [form, fields] = useForm({
    onValidate({ formData }) {
      const data = parseWithZod(formData, {
        schema: CopyFileInput.pick({ url: true }),
      });
      if (data.status !== 'success') {
        toast.error(data.error?.url);
      }
      return data;
    },
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onSubmit',
    onSubmit: (event, context) => {
      event.preventDefault();
      const data = parseWithZod(context.formData, {
        schema: CopyFileInput.pick({ url: true }),
      });
      if (data.status !== 'success') {
        return data.reply();
      }

      const { url } = data.value;
      if (folderId) {
        void mutateAsync({ url, folderId });
      } else {
        void mutateAsync({ url });
      }
    },
  });

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      noValidate
      className="relative flex w-full flex-col gap-2"
      aria-label="Google Drive URL submission form"
    >
      <div className="flex w-full flex-col overflow-hidden rounded-lg border bg-neutral-900">
        <InputConform
          type="url"
          meta={fields.url}
          placeholder="Paste public google drive file URL."
          className="h-auto rounded-none border-none p-3 focus-visible:ring-0"
          aria-label="Google Drive URL"
          aria-invalid={Boolean(fields.url.errors)}
          aria-busy={isPending}
          disabled={isPending}
        />
        <div className="flex items-center justify-between p-3">
          <FolderPicker onConfirm={setFolderId} disabled={isPending} />
          <Button
            type="submit"
            size="icon"
            className="size-7"
            disabled={isPending}
          >
            {isPending ? (
              <LoaderIcon className="size-4 animate-spin" />
            ) : (
              <ArrowUpIcon className="size-4" />
            )}
          </Button>
        </div>
      </div>
    </form>
  );
});

CreateTaskForm.displayName = 'CreateTaskForm';

export default CreateTaskForm;
