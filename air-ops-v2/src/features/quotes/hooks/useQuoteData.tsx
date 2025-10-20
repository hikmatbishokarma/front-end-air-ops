import { useState, useEffect, useCallback } from "react";
import useGql from "../../../lib/graphql/gql";
import { GET_AIRCRAFT_CATEGORIES } from "../../../lib/graphql/queries/aircraft-categories";
import { GET_AIRCRAFT } from "../../../lib/graphql/queries/aircraft-detail";
import { GET_REPRESENTATIVES } from "../../../lib/graphql/queries/representative";
import { GET_CLIENTS } from "../../../lib/graphql/queries/clients";
import {
  Iaircraft,
  IaircraftCategory,
  Iclient,
  Irepresentative,
} from "../../../interfaces/quote.interface";
import { useSession } from "../../../SessionContext";

export const useQuoteData = () => {
  const { session, loading } = useSession();
  const operatorId = session?.user.operator?.id || null;
  const [aircrafts, setAircrafts] = useState<Iaircraft[]>([]);
  const [representatives, setRepresentatives] = useState<Irepresentative[]>([]);
  const [clients, setClients] = useState<Iclient[]>([]);

  const fetchAircrafts = useCallback(async () => {
    try {
      const data = await useGql({
        query: GET_AIRCRAFT,
        queryName: "aircraftDetails",
        queryType: "query",
        variables: {
          filter: {
            ...(operatorId && { operatorId: { eq: operatorId } }),
          },
        },
      });
      setAircrafts(data);
    } catch (error) {
      console.error("Error fetching aircrafts:", error);
    }
  }, [operatorId]);

  const fetchRepresentatives = useCallback(
    async (clientId: string | undefined) => {
      try {
        const data = await useGql({
          query: GET_REPRESENTATIVES,
          queryName: "representatives",
          queryType: "query",
          variables: clientId
            ? {
                filter: { client: { eq: clientId } },
                sorting: [{ field: "createdAt", direction: "DESC" }],
              }
            : {},
        });
        setRepresentatives(data);
      } catch (error) {
        console.error("Error fetching representatives:", error);
      }
    },
    []
  );

  const fetchClients = useCallback(async () => {
    try {
      const data = await useGql({
        query: GET_CLIENTS,
        queryName: "clients",
        queryType: "query",
        variables: {
          filter: {
            ...(operatorId && { operatorId: { eq: operatorId } }),
          },
          sorting: [{ field: "createdAt", direction: "DESC" }],
        },
      });
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  }, [operatorId]);

  // Initial data fetch
  useEffect(() => {
    fetchClients();
    fetchAircrafts();
  }, [fetchClients, fetchAircrafts]);

  return {
    aircrafts,
    representatives,
    clients,
    fetchAircrafts,
    fetchRepresentatives,
    fetchClients,
  };
};
