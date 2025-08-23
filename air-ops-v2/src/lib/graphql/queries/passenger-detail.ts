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

export const GET_PASSENGER_DETAIL_BY_ID = gql`
  query getPassangerDetailById($id: ID!) {
    passengerDetail(id: $id) {
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
