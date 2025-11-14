import UserTicketListPane from "@/features/support/user/components/UserTicketListPage";
import { useUserTickets } from "@/features/support/user/hooks/useUserTicketQueries.hook";
import RightPaneController from "@/features/support/user/pages/RightPaneController";
import SupportLayout from "@/features/support/user/pages/SupportLayout";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function UserTicketListPage() {
  const { tickets, loading } = useUserTickets();
  const navigate = useNavigate();

  //   const handleOpen = (id: string) => {
  //     navigate(`/app/my-tickets/${id}`);
  //   };

  const [view, setView] = useState<{
    type: "welcome" | "create" | "details";
    id?: string;
  }>({ type: "welcome" });

  //   return <UserTicketListPane tickets={tickets} onOpenTicket={handleOpen} />;

  return (
    <SupportLayout
      left={
        <UserTicketListPane
          tickets={tickets}
          onCreate={() => setView({ type: "create" })}
          onOpenTicket={(id) => setView({ type: "details", id })}
        />
      }
      right={<RightPaneController view={view} setView={setView} />}
    />
  );
}
