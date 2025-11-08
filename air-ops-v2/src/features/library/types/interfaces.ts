import { FileObject } from "@/shared/types/common";

export interface ILibrary {
  name: string;
  department: string;
  attachment: FileObject | null;
}

export interface LibraryEditProps {
  id: string | number | undefined; // Use the actual type of your ID (string is common for UUIDs, number for integers)

  /** Function to call to close the edit modal or form. */
  onClose: () => void;

  /** Function to call to refresh the list/table data after a successful save/update. */
  refreshList: () => void;
}

export interface LibraryCreateProps {
  /** Function to call to close the edit modal or form. */
  onClose: () => void;

  /** Function to call to refresh the list/table data after a successful save/update. */
  refreshList: () => void;
}
