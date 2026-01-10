import { gql } from "@apollo/client";

export const CREATE_PASSENGER_DETAILS = gql`
  mutation createPassengerDetail($input: CreateOnePassengerDetailInput!) {
    createOnePassengerDetail(input: $input) {
      id
    }
  }
`;

export const UPDATE_PASSENGER_DETAILS = gql`
  mutation updatePassengerDetail($input: UpdateOnePassengerDetailInput!) {
    updateOnePassengerDetail(input: $input) {
      id
    }
  }
`;

export const UPADTE_PASSANGER_DETAIL = gql`
  mutation updatePassengerDetail(
    $where: UpdatePassengerDetailWhereInput!
    $data: UpdatePassengerDetailDataInput!
  ) {
    updatePassengerDetail(where: $where, data: $data) {
      id
    }
  }
`;

export const GET_PASSENGER_DETAILS = gql`
  query passengerDetails(
    $filter: PassengerDetailFilter! = {}
    $paging: OffsetPaging! = { limit: 10 }
    $sorting: [PassengerDetailSort!]! = []
  ) {
    passengerDetails(filter: $filter, paging: $paging, sorting: $sorting) {
      nodes {
        id
        quotation {
          id
          aircraft {
            id
            name
            code
          }
        }
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
          passengers {
            name
            age
            gender
            aadharId
            weight
            nationality
            baggageCount
            baggageWeight
          }
          meals {
            category
            item
            instructions
            portions
            type
          }
          travel {
            seatingCapacity
            category
            vehicleChoice
            dropAt
            type
          }
          sourceGroundHandler {
            fullName
            companyName
            contactNumber
            alternateContactNumber
            email
          }
          destinationGroundHandler {
            fullName
            companyName
            contactNumber
            alternateContactNumber
            email
          }
        }
      }
    }
  }
`;

export const GET_PASSENGER_DETAIL_BY_ID = gql`
  query getPassengerDetailById($id: ID!) {
    passengerDetail(id: $id) {
      id
      quotation {
        id
        aircraft {
          id
          name
          code
        }
      }
      quotationNo
      sectors {
        id
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
        passengers {
          name
          age
          gender
          aadharId
          weight
          nationality
          baggageCount
          baggageWeight
        }
        meals {
          category
          item
          instructions
          portions
          type
        }
        travel {
          seatingCapacity
          category
          vehicleChoice
          dropAt
          type
        }
      }
    }
  }
`;

export const CHECK_FOR_PASSENGER = gql`
  query passengerDetails(
    $filter: PassengerDetailFilter! = {}
    $paging: OffsetPaging! = { limit: 10 }
    $sorting: [PassengerDetailSort!]! = []
  ) {
    passengerDetails(filter: $filter, paging: $paging, sorting: $sorting) {
      nodes {
        id
        quotationNo
      }
    }
  }
`;
