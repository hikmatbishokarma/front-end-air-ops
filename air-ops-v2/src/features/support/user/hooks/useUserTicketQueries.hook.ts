// src/features/support/user/hooks/useUserTicketQueries.hook.ts

import { useEffect, useState } from "react";
import { TicketDetails } from "../../types";

/****************************************************
 * STATIC MOCK DATA — replace with GraphQL later
 ****************************************************/
const MOCK_TICKETS: TicketDetails[] = [
  {
    id: "T-1001",
    subject: "Issue processing VISA Card",
    requester: {
      id: "1221",
      name: "Dean Taylor",
      email: "dean.taylor@gmail.com",
      designation: "PILOT",
    },
    status: "OPEN",
    priority: "HIGH",
    department: "Sales",
    updatedAt: "2025-02-11T09:30:00Z",

    messages: [
      {
        id: "M-1",
        author: {
          id: "2121",
          name: "Dean Taylor",
          email: "dean.taylor@gmail.com",
          role: "requester",
          designation: "ADMIN",
        },
        createdAt: "2025-02-11T09:28:00Z",
        message:
          "<p>Hi, I need help processing my VISA card for transaction.</p>",
        attachments: [
          {
            id: "A-1",
            name: "doc.pdf",
            mime: "application/pdf",
            sizeBytes: 29000,
            url: "#",
          },
          {
            id: "A-2",
            name: "image.jpg",
            mime: "image/jpeg",
            sizeBytes: 31000,
            url: "#",
          },
        ],
      },
      {
        id: "M-2",
        author: {
          id: "223",
          name: "Support Agent - Ryan",
          email: "dean.taylor@gmail.com",
          role: "agent",
          designation: "ADMIN",
        },
        createdAt: "2025-02-11T09:33:00Z",
        message: "<p>Sure Dean, I am looking into this.</p>",
        attachments: [],
      },
    ],
  },
  {
    id: "T-1002",
    subject: "Flight plan import failing",
    requester: {
      id: "1221",
      name: "Dean Taylor",
      email: "dean.taylor@gmail.com",
      designation: "PILOT",
    },
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    department: "Ops",
    updatedAt: "2025-02-10T16:10:00Z",
    messages: [
      {
        id: "M-1",
        author: {
          id: "22323",
          name: "Captain Sharma",
          email: "sharma@airlines.com",
          role: "requester",
          designation: "PILOT",
        },
        createdAt: "2025-02-10T15:40:00Z",
        message: "<p>Flight plan import error. Please assist.</p>",
      },
    ],
  },
];

const MOCK_DETAILS: Record<string, TicketDetails> = {
  "T-1001": {
    id: "T-1002",
    subject: "Flight plan import failing",
    requester: {
      id: "1221",
      name: "Dean Taylor",
      email: "dean.taylor@gmail.com",
      designation: "PILOT",
    },
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    department: "Ops",
    updatedAt: "2025-02-10T16:10:00Z",
    messages: [
      {
        id: "M-1",
        author: {
          id: "22323",
          name: "Captain Sharma",
          email: "sharma@airlines.com",
          role: "requester",
          designation: "PILOT",
        },
        createdAt: "2025-02-10T15:40:00Z",
        message: "<p>Flight plan import error. Please assist.</p>",
      },
    ],
  },

  "T-1002": {
    id: "T-1001",
    subject: "Issue processing VISA Card",
    requester: {
      id: "1221",
      name: "Dean Taylor",
      email: "dean.taylor@gmail.com",
      designation: "PILOT",
    },
    status: "OPEN",
    priority: "HIGH",
    department: "Sales",
    updatedAt: "2025-02-11T09:30:00Z",

    messages: [
      {
        id: "M-1",
        author: {
          id: "2121",
          name: "Dean Taylor",
          email: "dean.taylor@gmail.com",
          role: "requester",
          designation: "ADMIN",
        },
        createdAt: "2025-02-11T09:28:00Z",
        message:
          "<p>Hi, I need help processing my VISA card for transaction.</p>",
        attachments: [
          {
            id: "A-1",
            name: "doc.pdf",
            mime: "application/pdf",
            sizeBytes: 29000,
            url: "#",
          },
          {
            id: "A-2",
            name: "image.jpg",
            mime: "image/jpeg",
            sizeBytes: 31000,
            url: "#",
          },
        ],
      },
      {
        id: "M-2",
        author: {
          id: "223",
          name: "Support Agent - Ryan",
          email: "dean.taylor@gmail.com",
          role: "agent",
          designation: "ADMIN",
        },
        createdAt: "2025-02-11T09:33:00Z",
        message: "<p>Sure Dean, I am looking into this.</p>",
        attachments: [],
      },
    ],
  },
};

/****************************************************
 * HOOK 1: get all tickets
 ****************************************************/
export function useUserTickets() {
  const [tickets, setTickets] = useState<TicketDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = () => {
    setLoading(true);
    setTimeout(() => {
      setTickets(MOCK_TICKETS);
      setLoading(false);
    }, 400);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return {
    tickets,
    loading,
    refetch: fetchTickets,
  };
}

/****************************************************
 * HOOK 2: get single ticket details with messages
 ****************************************************/
export function useUserTicketDetails(ticketId: string) {
  const [details, setDetails] = useState<TicketDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = () => {
    setLoading(true);
    setTimeout(() => {
      setDetails(MOCK_DETAILS[ticketId] ?? null);
      setLoading(false);
    }, 400);
  };

  useEffect(() => {
    if (ticketId) fetchDetails();
  }, [ticketId]);

  return {
    details,
    loading,
    refetch: fetchDetails,
  };
}
