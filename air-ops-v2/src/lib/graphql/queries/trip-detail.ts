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
          source
          destination
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
