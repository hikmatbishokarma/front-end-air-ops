// src/features/support/user/RightPaneController.tsx

import { useState } from "react";
import FAQSection from "../components/FAQSection";

import UserTicketDetailsPage from "../components/UserTicketDetailsPage";
import WelcomePane from "../components/WelcomePanel";
import CreateTicketPane from "../components/CreateTicketPane";

export default function RightPaneController({
  view,
  setView,
}: {
  view: { type: "welcome" | "create" | "details"; id?: string };
  setView: React.Dispatch<
    React.SetStateAction<{
      type: "welcome" | "create" | "details";
      id?: string;
    }>
  >;
}) {
  const faqs = [
    // ============================
    // OPERATIONS
    // ============================
    {
      id: "ops-1",
      category: "Operations",
      question: "How do I add or update an aircraft in the fleet?",
      answer: `
      <p>
        You can add or modify aircraft from the <strong>Operations → Fleet</strong> 
        section. Click <em>“Add Aircraft”</em> and fill required details such as 
        registration number, aircraft type, crew configuration, and performance limits.
      </p>
      <p>
        After saving, the aircraft will automatically appear during trip creation 
        and scheduling workflows.
      </p>
    `,
    },
    {
      id: "ops-2",
      category: "Operations",
      question: "How do I update crew availability and assign crew to trips?",
      answer: `
      <p>
        Crew availability can be managed from the <strong>Operations → Crew</strong> panel. 
        You can set leaves, duty periods, or add any operational restrictions.
      </p>
      <p>
        When generating a trip, the system will automatically suggest available crew 
        based on duty hours, qualifications, and recent assignments.
      </p>
    `,
    },

    // ============================
    // QUOTES & PRICING
    // ============================
    {
      id: "quotes-1",
      category: "Quotes & Pricing",
      question: "How do I generate a new charter quote?",
      answer: `
      <p>
        Navigate to the <strong>Sales → Quotes</strong> module and click 
        <em>“Create Quote”</em>. Enter route details, aircraft, schedule, and passenger count.
      </p>
      <p>
        Pricing will be auto-calculated using your predefined cost templates 
        (fuel, handling, landing, crew allowances, and markups).
      </p>
    `,
    },
    {
      id: "quotes-2",
      category: "Quotes & Pricing",
      question: "Why is the quote pricing showing different from expected?",
      answer: `
      <p>
        Pricing variations may occur if:
      </p>
      <ul>
        <li>Your fuel price or handling charges were recently updated</li>
        <li>The aircraft selected has different cost configurations</li>
        <li>Temporary NOTAMs, night charges, or route-specific fees apply</li>
        <li>Fallback airport alternates were auto-added</li>
      </ul>
      <p>
        You can review cost breakdown inside the quote's <strong>“Pricing Details”</strong> tab.
      </p>
    `,
    },
  ];

  return (
    <>
      {view.type === "welcome" && (
        <WelcomePane
          faq={<FAQSection faqs={faqs || []} />}
          onCreate={() => setView({ type: "create" })}
        />
      )}

      {view.type === "create" && (
        <CreateTicketPane
          faq={<FAQSection faqs={faqs || []} />}
          onBack={() => setView({ type: "welcome" })}
          onCreated={(newId) => setView({ type: "details", id: newId })}
        />
      )}

      {view.type === "details" && (
        <UserTicketDetailsPage
          ticketId={view.id!}
          onBack={() => setView({ type: "welcome" })}
        />
      )}
    </>
  );
}
