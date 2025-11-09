// /utils/crew.ts

import { AssignedCrew, Sector } from "../types/sector";

export const roleForUserInSector = (sector: Sector, userId: string) => {
  for (const ac of sector.assignedCrews) {
    if (ac.crews.includes(userId)) return ac.designation;
  }
  return undefined;
};

export const groupAssignedCrews = (assigned: AssignedCrew[]) =>
  assigned.filter((g) => g.crews.length);

// Helper function to get airport code (handles both string and object formats)
export const getAirportCode = (
  airport: string | { code: string; name?: string; country?: string }
): string => {
  return typeof airport === "object" ? airport.code : airport;
};
