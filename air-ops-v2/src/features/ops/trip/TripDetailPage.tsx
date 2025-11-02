import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";

import { useParams, useNavigate, useLocation } from "react-router";
import { useTrip } from "../hooks/useTrip";
import { PassengerDetailsTab } from "./components/tabs/PassengerDetailsTab";
import IntimationsTab from "./components/tabs/IntimationsTab";
import TripDetailsTab from "./components/tabs/TripDetailsTab";

export default function TripDetailPage() {
  const [tab, setTab] = useState(0);

  const { tripId } = useParams();

  const location = useLocation();
  const row = location.state;

  const { data: trip, loading, error } = useTrip(tripId!);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching trip</div>;
  if (!trip) return <div>No trip data found</div>;

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Box p={2}>
      <Box mb={2}>
        <h3>
          Trip ID: {trip?.tripId} &nbsp; | &nbsp; Quotation:{trip.quotationNo} –
          &nbsp;
          {trip?.requestedBy?.name || trip?.quotation?.category}
        </h3>
      </Box>

      <Tabs value={tab} onChange={handleTabChange}>
        <Tab label="Passengers" />
        <Tab label="Intimations" />
        <Tab label="Trip Details" />
        <Tab label="Checklist & Summary" />
      </Tabs>

      <Box mt={3}>
        {tab === 0 && (
          <PassengerDetailsTab
            quotation={trip?.quotation}
            quotationNo={trip?.quotationNo}
          />
        )}
        {tab === 1 && <IntimationsTab quotation={trip} />}
        {tab === 2 && <TripDetailsTab trip={trip} />}
        {/* {tab === 3 && <ChecklistTab />} */}
      </Box>
    </Box>
  );
}
