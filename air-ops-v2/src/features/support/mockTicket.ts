// /support/data/mockTickets.ts

export const mockTickets = [
  {
    id: "T-1001",
    subject: "Issue processing VISA Card",
    requester: { name: "Dean Taylor", email: "dean.taylor@gmail.com" },
    status: "OPEN",
    priority: "HIGH",
    department: "Sales",
    updatedAt: "2025-02-11T09:30:00Z",
    snippet: "I need help with processing a VISA card...",
    messages: [
      {
        id: "M-1",
        author: {
          name: "Dean Taylor",
          email: "dean.taylor@gmail.com",
          role: "requester",
        },
        createdAt: "2025-02-11T09:28:00Z",
        html: "<p>Hi, I need help processing my VISA card for transaction.</p>",
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
        author: { name: "Support Agent - Ryan", role: "agent" },
        createdAt: "2025-02-11T09:33:00Z",
        html: "<p>Sure Dean, I am looking into this.</p>",
        attachments: [],
      },
    ],
  },
  {
    id: "T-1002",
    subject: "Flight plan import failing",
    requester: { name: "Captain Sharma", email: "sharma@airlines.com" },
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    department: "Ops",
    updatedAt: "2025-02-10T16:10:00Z",
    snippet: "Import validation fails...",
    messages: [
      {
        id: "M-1",
        author: {
          name: "Captain Sharma",
          email: "sharma@airlines.com",
          role: "requester",
        },
        createdAt: "2025-02-10T15:40:00Z",
        html: "<p>Flight plan import error. Please assist.</p>",
      },
    ],
  },
];
