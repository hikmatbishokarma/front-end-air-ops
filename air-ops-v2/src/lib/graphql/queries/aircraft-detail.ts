import { gql } from "@apollo/client";

export const GET_AIRCRAFT = gql`
  query aircraftDetails(
    $filter: AircraftDetailFilter! = {}
    $paging: OffsetPaging! = { limit: 10 }
    $sorting: [AircraftDetailSort!]! = []
  ) {
    aircraftDetails(filter: $filter, paging: $paging, sorting: $sorting) {
      totalCount
      nodes {
        id
        isActive
        name
        code
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

      noteText

      warningImage
      flightImage
      seatLayoutImage
      flightInteriorImages
      termsAndConditions
      specifications
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

export const DELETE_AIRCRAFT = gql`
  mutation deleteOneAircraftDetail($input: DeleteOneAircraftDetailInput!) {
    deleteOneAircraftDetail(input: $input) {
      id
    }
  }
`;
