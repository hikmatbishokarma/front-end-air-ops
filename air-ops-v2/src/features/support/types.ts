/* ----------------------------------------
   Ticket List Item (User & Admin shared)
----------------------------------------- */
export interface UserTicket {
  id: string;
  subject: string;

  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  department: string;

  lastMessageSnippet?: string;
  updatedAt: string; // ISO timestamp
}

export interface TicketRequester {
  id: string;
  name: string;
  email: string;
  designation: string;
}

/* ----------------------------------------
   Attachment type for messages
----------------------------------------- */
export interface TicketAttachment {
  id: string;
  name: string;
  url: string;
  size?: number;
  mime?: string;
}

/* ----------------------------------------
   Message inside Thread
----------------------------------------- */
export interface ThreadMessage {
  id: string;
  author: {
    id: string;
    name: string;
    email: string;
    role: string;
    designation: string;
  };

  message: string; // HTML or plain text
  createdAt: string; // ISO timestamp

  attachments?: any[];
}

/* ----------------------------------------
   Ticket Details (full thread)
----------------------------------------- */
export interface TicketDetails {
  id: string;
  subject: string;

  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  department: string;
  requester: TicketRequester; // ⭐ YOU WERE MISSING THIS
  updatedAt: string;
  messages: ThreadMessage[];
}
