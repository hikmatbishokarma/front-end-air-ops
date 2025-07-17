import { gql } from "@apollo/client";

export const CREATE_AIRPORT = gql`
  mutation createAirport($input: CreateOneAirportInput!) {
    createOneAirport(input: $input) {
      id
    }
  }
`;

export const UPDATE_AIRPORT = gql`
  mutation updateAirport($input: UpdateOneAirportInput!) {
    updateOneAirport(input: $input) {
      id
    }
  }
`;

export const GET_AIRPORTS = gql`
  query airports(
    $filter: AirportFilter! = {}
    $paging: OffsetPaging! = { limit: 10 }
    $sorting: [AirportSort!]! = []
  ) {
    airports(filter: $filter, paging: $paging, sorting: $sorting) {
      totalCount
      nodes {
        id
        iata_code
        icao_code
        name
        city
        country
      }
    }
  }
`;

export const GET_AIRPORT_BY_ID = gql`
  query airportById($id: ID!) {
    airport(id: $id) {
      id
      name
      city
      country
      iata_code
      icao_code
      latitude
      longitude
      contactNumber
      email
      openHrs
      closeHrs
      groundHandlersInfo {
        fullName
        companyName
        contactNumber
        email
      }
    }
  }
`;
