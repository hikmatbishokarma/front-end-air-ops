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

  const operatorId = session?.user.operator?.id || null;

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
            ...(operatorId && { operatorId: { eq: operatorId } }),
          },
        },
      });
      setAircraftCategories(data);
    } catch (error) {
      console.error("Error fetching aircraft categories:", error);
    }
  };

  // Fetch aircrafts based on category
  const fetchAircrafts = async () => {
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
  };

  // Fetch representatives based on client
  const fetchRepresentatives = async (clientId) => {
    try {
      const data = await useGql({
        query: GET_REPRESENTATIVES,
        queryName: "representatives",
        queryType: "query",
        variables: clientId
          ? {
              filter: { client: { eq: clientId } },
              sorting: [{ "field": "createdAt", "direction": "DESC" }],
            }
          : {},
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
            ...(operatorId && { operatorId: { eq: operatorId } }),
          },
          sorting: [{ "field": "createdAt", "direction": "DESC" }],
        },
      });
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  // Fetch initial data
  useEffect(() => {
    //  fetchAircraftCategories();
    fetchClients();
    fetchAircrafts();
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
