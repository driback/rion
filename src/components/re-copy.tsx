'use client';
import { LoaderIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { TCopyInput } from '~/server/api/routers/file/file.schema';
import { api } from '~/trpc/react';
import { Button } from './ui/button';

const ReCopy = (data: TCopyInput) => {
  const { mutateAsync, isPending } = api.file.copy.useMutation({
    onSuccess: () => {
      toast.success('File copied successfully');
    },
    onError: (error) => toast.error(error.message),
  });
  return (
    <Button
      variant="outline"
      size="sm"
      className="size-auto px-1.5 py-1"
      onClick={() => mutateAsync(data)}
    >
      {isPending ? <LoaderIcon className="size-4 animate-spin" /> : 're-copy'}
    </Button>
  );
};

export default ReCopy;
