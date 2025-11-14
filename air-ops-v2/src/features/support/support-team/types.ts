// ---------- Types ----------
export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH";
export type Department = "Sales" | "Support" | "Marketing" | "Ops" | string;

export interface Attachment {
  id: string;
  name: string;
  mime?: string;
  sizeBytes?: number;
  url?: string;
}

export interface Author {
  id?: string;
  name: string;
  email?: string;
  role?: "requester" | "agent" | "engineer" | "system";
}

export interface Message {
  id: string;
  author: Author;
  createdAt: string; // ISO
  html: string; // from rich editor
  attachments?: Attachment[];
  internalNote?: boolean;
}

export interface TicketDetail {
  id: string;
  subject: string;
  requester: Author; // owner of ticket
  status: TicketStatus;
  priority: TicketPriority;
  department: Department;
  messages: Message[]; // chronological (oldest -> newest)
}
