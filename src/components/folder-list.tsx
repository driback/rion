import { FolderIcon } from 'lucide-react';
import List from './list';
import { Button } from './ui/button';

type TFolderSchema = {
  id: string;
  name: string;
};

type FolderListProps = {
  folders: TFolderSchema[];
  onSelect: (folder: { id: string; label: string }) => void;
  isPending: boolean;
  selectedFolderId?: string;
};

const FolderList = ({
  folders,
  onSelect,
  isPending,
  selectedFolderId,
}: FolderListProps) => {
  return (
    <ul className="flex flex-col gap-1">
      {!folders.length && !isPending && (
        <li className="p-2 text-center text-gray-500 text-sm">
          No folders found
        </li>
      )}
      <List of={folders}>
        {(folder) => (
          <li key={folder.id}>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start truncate text-sm"
              onClick={() => onSelect({ id: folder.id, label: folder.name })}
              disabled={isPending}
              aria-selected={selectedFolderId === folder.id}
            >
              <FolderIcon className="mr-1 size-4 shrink-0" />
              {folder.name}
            </Button>
          </li>
        )}
      </List>
    </ul>
  );
};

export default FolderList;
