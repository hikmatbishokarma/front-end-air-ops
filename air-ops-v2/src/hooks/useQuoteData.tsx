import { useState, useEffect } from "react";
import useGql from "../lib/graphql/gql";
import { GET_AIRCRAFT_CATEGORIES } from "../lib/graphql/queries/aircraft-categories";
import { GET_AIRCRAFT } from "../lib/graphql/queries/aircraft-detail";
import { GET_REPRESENTATIVES } from "../lib/graphql/queries/representative";
import { GET_CLIENTS } from "../lib/graphql/queries/clients";
import {
  Iaircraft,
  IaircraftCategory,
  Iclient,
  Irepresentative,
} from "../interfaces/quote.interface";
import { useSession } from "../SessionContext";

export const useQuoteData = () => {
  const [aircraftCategories, setAircraftCategories] = useState<
    IaircraftCategory[]
  >([]);

  const { session, setSession, loading } = useSession();

  const agentId = session?.user.agent?.id || null;

  const [aircrafts, setAircrafts] = useState<Iaircraft[]>([]);
  const [representatives, setRepresentatives] = useState<Irepresentative[]>([]);
  const [clients, setClients] = useState<Iclient[]>([]);

  // Fetch aircraft categories
  const fetchAircraftCategories = async () => {
    try {
      const data = await useGql({
        query: GET_AIRCRAFT_CATEGORIES,
        queryName: "aircraftCategories",
        queryType: "query",
        variables: {
          filter: {
            ...(agentId && { agentId: { eq: agentId } }),
          },
        },
      });
      setAircraftCategories(data);
    } catch (error) {
      console.error("Error fetching aircraft categories:", error);
    }
  };

  // Fetch aircrafts based on category
  const fetchAircrafts = async (categoryId) => {
    try {
      const data = await useGql({
        query: GET_AIRCRAFT,
        queryName: "aircraftDetails",
        queryType: "query",
        // variables: categoryId
        //   ? {
        //       sorting: [{ field: "category", direction: "ASC" }],

        //     }
        //   : {},
        variables: {
          filter: {
            ...(agentId && { agentId: { eq: agentId } }),
          },
          ...(categoryId && {
            sorting: [{ field: "category", direction: "ASC" }],
          }),
        },
      });
      setAircrafts(data);
    } catch (error) {
      console.error("Error fetching aircrafts:", error);
    }
  };

  // Fetch representatives based on client
  const fetchRepresentatives = async (clientId) => {
    try {
      const data = await useGql({
        query: GET_REPRESENTATIVES,
        queryName: "representatives",
        queryType: "query",
        variables: clientId ? { filter: { client: { eq: clientId } } } : {},
      });
      setRepresentatives(data);
    } catch (error) {
      console.error("Error fetching representatives:", error);
    }
  };

  // Fetch clients
  const fetchClients = async () => {
    try {
      const data = await useGql({
        query: GET_CLIENTS,
        queryName: "clients",
        queryType: "query",
        variables: {
          filter: {
            ...(agentId && { agentId: { eq: agentId } }),
          },
        },
      });
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  // Fetch initial data
  useEffect(() => {
    fetchAircraftCategories();
    fetchClients();
  }, []);

  return {
    aircraftCategories,
    aircrafts,
    representatives,
    clients,
    fetchAircrafts,
    fetchRepresentatives,
    fetchClients,
  };
};
