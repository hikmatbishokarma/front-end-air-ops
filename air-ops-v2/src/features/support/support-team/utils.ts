import { Message } from "./types";

// ---------- Helpers ----------
export const formatKB = (bytes?: number) =>
  !bytes ? "" : Math.max(1, Math.round(bytes / 1024)) + " KB";

export const isRequester = (msg: Message, requesterEmail?: string) =>
  msg.author.email && requesterEmail
    ? msg.author.email.toLowerCase() === requesterEmail.toLowerCase()
    : msg.author.role === "requester";
