// /utils/transform.ts
import {
  Sector,
  AssignedCrew,
  SectorDocument,
  AircraftInfo,
} from "../types/sector";

interface ApiTripResult {
  tripId: string;
  quotationNo: string;
  quotation: {
    id: string;
    quotationNo: string;
    aircraft: {
      name: string;
      code: string;
      specifications?: any;
    };
  };
  sector: {
    source: {
      name: string;
      code: string;
      country: string;
      iata_code?: string;
    };
    destination: {
      name: string;
      code: string;
      country: string;
      iata_code?: string;
    };
    tripDocByCrew?: Array<{
      type: string;
      name: string;
      url: string;
      crewDetails: {
        id: string;
        fullName: string;
        email: string;
        profile?: string;
        phone?: string;
        designation: string;
      };
    }>;
    crewGroup?: Array<{
      designation: string;
      crews: Array<{
        id: string;
        fullName: string;
        email: string;
        profile?: string;
        phone?: string;
        designation: string;
      }>;
    }>;
    documents?: Array<{
      fileUrl?: string;
      type: string;
      externalLink?: string;
    }>;
    flightTime: string;
    depatureDate: string;
    depatureTime: string;
    arrivalDate: string;
    arrivalTime: string;
  };
}

export const transformApiDataToSectors = (
  apiResults: ApiTripResult[]
): Sector[] => {
  return apiResults.flatMap((result) => {
    const sector = result.sector;
    const aircraft = result.quotation?.aircraft
      ? {
          name: result.quotation.aircraft.name || "",
          code: result.quotation.aircraft.code || "",
          specifications: result.quotation.aircraft.specifications,
        }
      : undefined;

    // Transform crewGroup to assignedCrews format
    const assignedCrews: AssignedCrew[] =
      sector.crewGroup?.map((group) => ({
        designation: group.designation as any,
        crews: group.crews.map((crew) => crew.id),
      })) || [];

    // Transform documents
    const documents: SectorDocument[] =
      sector.documents?.map((doc) => ({
        type: doc.type,
        externalLink: doc.externalLink || doc.fileUrl || undefined,
      })) || [];

    // Create a unique ID for this sector (tripId + source + destination + depatureDate)
    const sectorId = `${result.tripId}-${sector.source.code}-${sector.destination.code}-${sector.depatureDate}`;

    return {
      _id: sectorId,
      sectorNo: 1, // API doesn't provide sectorNo, defaulting to 1
      source: {
        code: sector.source.code,
        name: sector.source.name,
        country: sector.source.country,
      },
      destination: {
        code: sector.destination.code,
        name: sector.destination.name,
        country: sector.destination.country,
      },
      depatureDate: sector.depatureDate,
      depatureTime: sector.depatureTime,
      arrivalDate: sector.arrivalDate,
      arrivalTime: sector.arrivalTime,
      flightTime: sector.flightTime,
      assignedCrews,
      documents,
      // Store additional data for later use
      tripId: result.tripId,
      aircraft,
      quotationNo: result.quotationNo,
      // Store full crew details for CrewTab
      crewDetails:
        sector.crewGroup?.reduce(
          (acc, group) => {
            group.crews.forEach((crew) => {
              acc[crew.id] = {
                id: crew.id,
                name: crew.fullName,
                email: crew.email,
                phone: crew.phone,
                profile: crew.profile,
                designation: crew.designation,
              };
            });
            return acc;
          },
          {} as Record<string, any>
        ) || {},
      // Store crew uploaded documents
      crewUploadedDocs: sector.tripDocByCrew || [],
    } as Sector & {
      tripId: string;
      aircraft: AircraftInfo;
      quotationNo: string;
      crewDetails: Record<string, any>;
      crewUploadedDocs: any[];
    };
  });
};
