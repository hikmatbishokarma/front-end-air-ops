import { gql } from "@apollo/client";

export const GET_AIRCRAFT = gql`
  query aircraftDetails(
    $filter: AircraftDetailFilter! = {}
    $paging: OffsetPaging! = { limit: 10 }
    $sorting: [AircraftDetailSort!]! = []
  ) {
    aircraftDetails(filter: $filter, paging: $paging, sorting: $sorting) {
      nodes {
        id
        isActive
        name
        code
        category {
          id
          name
        }
      }
    }
  }
`;

export const GET_AIRCRAFT_DETAIL_BY_ID = gql`
  query aircraftDetailById($id: ID!) {
    aircraftDetail(id: $id) {
      id
      isActive
      name
      code
      description
      noteText
      warningText
      warningImage
      flightImages
      seatLayoutImage
      rangeMapImage
      termsAndConditions
      specifications
      category {
        id
        name
      }
    }
  }
`;

export const CREATE_AIRCRAFT_DETAIL = gql`
  mutation createAirtcraftDetail($input: CreateOneAircraftDetailInput!) {
    createOneAircraftDetail(input: $input) {
      id
      name
    }
  }
`;

export const UPDATE_AIRCRAFT_DETAIL = gql`
  mutation updateAirtcraftDetail($input: UpdateOneAircraftDetailInput!) {
    updateOneAircraftDetail(input: $input) {
      id
      name
    }
  }
`;
