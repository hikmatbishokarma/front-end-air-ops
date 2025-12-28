import { gql } from "@apollo/client";

export const CREATE_TRIP_DETAILS = gql`
  mutation createTripDetail($input: CreateOneTripDetailInput!) {
    createOneTripDetail(input: $input) {
      id
    }
  }
`;

export const UPDATE_TRIP_DETAILS = gql`
  mutation updateTripDetail(
    $data: UpdateTripDetailDataInput!
    $where: UpdateTripDetailWhereInput!
  ) {
    updateTripDetail(data: $data, where: $where) {
      id
    }
  }
`;

export const GET_TRIP_DETAILS = gql`
  query getTripDetails(
    $filter: TripDetailFilter! = {}
    $paging: OffsetPaging! = { limit: 10 }
    $sorting: [TripDetailSort!]! = []
  ) {
    tripDetails(filter: $filter, paging: $paging, sorting: $sorting) {
      totalCount
      nodes {
        id
        tripId
        createdAt
        quotation {
          id
          category
          aircraft {
            code
            name
          }
        }
        status
        quotationNo
        sectors {
          sectorNo
          status
          source {
            code
            name
            lat
            long
            city
            country
          }
          destination {
            code
            name
            lat
            long
            city
            country
          }
          depatureDate
          depatureTime
          arrivalDate
          arrivalTime
          pax
          flightTime
          fuelRecord {
            fuelGauge
            fuelLoaded
            fuelStation
            fuelOnArrival
          }
          documents {
            type
            externalLink
            fileUrl
          }
          assignedCrews {
            designation
            crews
          }
          baInfo {
            baMachine
            baPersons {
              name
              age
              gender
              certNo
            }
            baReports {
              name
              reading
              record
              conductedDate
              video
            }
          }
        }
      }
    }
  }
`;

export const GET_CREW_DOC_UPLODED_FOR_TRIP = gql`
  query tripDetailsWithCrewDocuments(
    $filter: TripDetailFilter! = {}
    $paging: OffsetPaging! = { limit: 10 }
    $sorting: [TripDetailSort!]! = []
  ) {
    tripDetailsWithCrewDocuments(
      filter: $filter
      paging: $paging
      sorting: $sorting
    ) {
      totalCount
      nodes {
        id
        tripId
        createdAt
        quotation {
          id
          category
          aircraft {
            code
            name
          }
        }
        status
        quotationNo
        sectors {
          sectorNo
          source {
            code
            name
            lat
            long
            city
            country
          }
          destination {
            code
            name
            lat
            long
            city
            country
          }
          depatureDate
          depatureTime
          arrivalDate
          arrivalTime
          pax
          flightTime
          assignedCrews {
            designation
            crews
          }
          tripDocByCrew {
            name
            url
            type
            crewDetails {
              id
              fullName
              designation
              profile
              email
            }
          }
        }
      }
    }
  }
`;

export const GET_TRIP_ASSIGNED_FOR_CREW = gql`
  query tripAssignedForCrew(
    $filter: TripFilterForCrewInput!
    $paging: PagingInput!
    $sort: SortInput
  ) {
    tripAssignedForCrew(filter: $filter, paging: $paging, sort: $sort) {
      totalCount
      result {
        tripId
        quotationNo
        quotation {
          id
          quotationNo
          aircraft {
            name
            code
            specifications
          }
        }
        sector {
          sectorNo
          source {
            name
            code
            country
            iata_code
          }
          destination {
            name
            code
            country
            iata_code
          }
          tripDocByCrew {
            type
            name
            url
            crewDetails {
              id
              fullName
              email
              profile
              phone
              designation
            }
          }
          crewGroup {
            designation
            crews {
              id
              fullName
              email
              profile
              phone
              designation
            }
          }
          documents {
            fileUrl
            type
            externalLink
          }
          flightTime
          depatureDate
          depatureTime
          arrivalDate
          arrivalTime
        }
      }
    }
  }
`;

export const CREATE_TRIP = gql`
  mutation createTrip($input: CreateTripInput!) {
    createTrip(input: $input) {
      id
    }
  }
`;

export const GET_TRIP_DETAILS_BY_ID = gql`
  query getTripDetailById($id: ID!) {
    tripDetail(id: $id) {
      id
      tripId
      createdAt
      quotation {
        id
        category
        aircraft {
          code
          name
        }
      }
      status
      quotationNo
      sectors {
        sectorNo
        status
        source {
          code
          name
          lat
          long
          city
          country
        }
        destination {
          code
          name
          lat
          long
          city
          country
        }
        depatureDate
        depatureTime
        arrivalDate
        arrivalTime
        pax
        flightTime
        fuelRecord {
          fuelStation
          uploadedDate
          fuelOnArrival
          fuelGauge
          fuelLoaded
          fuelReceipt
          handledBy
          designation
        }
        documents {
          type
          externalLink
          fileUrl
        }
        assignedCrews {
          designation
          crews
          crewsInfo{
          fullName
          displayName
          id
          crewId
          email
        }
        }
        baInfo {
          baMachine
          baPersons {
            name
            age
            gender
            certNo
          }
          baReports {
            name
            reading
            record
            conductedDate
            video
          }
        }
      }
    }
  }
`;

export const UPLOAD_TRIP_DOC_BY_CREW = gql`
  mutation uploadTripDocByCrew(
    $data: TripDocByCrewDataInput!
    $where: TripDocByCrewWhereInput!
  ) {
    uploadTripDocByCrew(data: $data, where: $where) {
      id
    }
  }
`;


export const GENERATE_PASSENGER_MANIFEST = gql`
mutation generatePassengerManifest($input: GeneratePassengerManifestInput!){
  generatePassengerManifest(input:$input)
    
  }


`




export const GET_OPS_DASHBOARD_SUMMARY = gql`
  query GetOpsDashboardSummary($operatorId: String) {
    opsDashboardSummary(operatorId: $operatorId) {
        saleConfirmations
        tripDetails
        crewTripsDoc
        reports
    }
  }
`;

export const TRIP_CONFIRMATION_PREVIEW = gql`
  query tripConfirmationPreview($tripId: String!) {
    tripConfirmationPreview(tripId: $tripId)
  }
`;