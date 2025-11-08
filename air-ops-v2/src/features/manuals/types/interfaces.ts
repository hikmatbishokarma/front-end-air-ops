import { FileObject } from "@/shared/types/common";

export interface IManual {
  name: string;
  department: string;
  attachment: FileObject | null;
}

export interface ManualEditProps {
  id: string | number; // Use the actual type of your ID (string is common for UUIDs, number for integers)

  /** Function to call to close the edit modal or form. */
  onClose: () => void;

  /** Function to call to refresh the list/table data after a successful save/update. */
  refreshList: () => void;
}

export interface ManualCreateProps {
  /** Function to call to close the edit modal or form. */
  onClose: () => void;

  /** Function to call to refresh the list/table data after a successful save/update. */
  refreshList: () => void;
}
