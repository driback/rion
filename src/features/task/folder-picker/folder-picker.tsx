'use client';

import type { TFolderSchema } from '~/server/api/routers/folder/folder.schema';

import { FolderIcon, LoaderIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog';
import { Button } from '~/components/ui/button';
import { api } from '~/trpc/react';
import FolderBreadcrumbs from './folder-breadcrumb';
import FolderList from './folder-list';

type TBreadcrumbItem = {
  id: string;
  label: string;
};

const INITIAL_BREADCRUMB: TBreadcrumbItem = {
  id: 'root',
  label: '/',
} as const;

type FolderPickerProps = {
  onConfirm?: (folderId: string | null) => void;
  disabled?: boolean;
};

const FolderPicker = ({ onConfirm, disabled }: FolderPickerProps) => {
  const [selectedFolder, setSelectedFolder] = useState<TBreadcrumbItem | null>(
    null
  );
  const [{ breadCrumbs, folders }, setState] = useState({
    breadCrumbs: [INITIAL_BREADCRUMB],
    folders: [] as TFolderSchema[],
  });

  const { mutateAsync, isPending } = api.folder.get.useMutation({
    onSuccess: (data) => setState((prev) => ({ ...prev, folders: data.data })),
    onError: (err) => {
      toast.error(`Failed to fetch folders: ${err.message}`);
    },
  });

  const handleFolder = useCallback(
    async (props?: TBreadcrumbItem) => {
      try {
        await mutateAsync(props?.id ? { folderId: props.id } : undefined);
        setState((prev) => ({
          ...prev,
          breadCrumbs: props
            ? [...prev.breadCrumbs, props]
            : [INITIAL_BREADCRUMB],
        }));
        if (props) setSelectedFolder(props);
      } catch (err) {
        console.error('Failed to fetch folder:', err);
        toast.error('Failed to load folder. Please try again.');
      }
    },
    [mutateAsync]
  );

  const handleBreadCrumb = useCallback(
    async (props?: TBreadcrumbItem) => {
      try {
        await mutateAsync(props?.id ? { folderId: props.id } : undefined);
        setState((prev) => ({
          ...prev,
          breadCrumbs: props
            ? prev.breadCrumbs.slice(
                0,
                prev.breadCrumbs.findIndex((s) => s.id === props.id) + 1
              )
            : [INITIAL_BREADCRUMB],
        }));
      } catch (err) {
        console.error('Failed to navigate breadcrumb:', err);
        toast.error('Failed to navigate. Please try again.');
      }
    },
    [mutateAsync]
  );

  const handleConfirm = useCallback(() => {
    if (breadCrumbs.length < 2) {
      setSelectedFolder(null);
      onConfirm?.(null);
      return;
    }
    onConfirm?.(selectedFolder?.id ?? null);
  }, [selectedFolder, onConfirm, breadCrumbs.length]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-auto px-2"
          onClick={() => handleFolder()}
          aria-label="Open folder picker"
          disabled={disabled}
        >
          <FolderIcon className="mr-1 size-4" />
          {!selectedFolder ? '/' : `/ ${selectedFolder?.label}`}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-4">
        <AlertDialogHeader>
          <AlertDialogTitle>Select folder</AlertDialogTitle>
        </AlertDialogHeader>

        <FolderBreadcrumbs
          breadCrumbs={breadCrumbs}
          onNavigate={handleBreadCrumb}
        />

        <div className="block max-h-96 min-h-80 w-full overflow-y-auto">
          {isPending ? (
            <div className="flex h-full items-center justify-center">
              <LoaderIcon className="size-4 animate-spin" />
            </div>
          ) : (
            <FolderList
              folders={folders}
              onSelect={handleFolder}
              isPending={isPending}
              selectedFolderId={selectedFolder?.id}
            />
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedFolder(null)}
            >
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button size="sm" onClick={handleConfirm}>
              Confirm
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FolderPicker;
