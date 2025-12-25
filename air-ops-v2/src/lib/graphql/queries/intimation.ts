import { gql } from '@apollo/client';

export const CREATE_INTIMATION = gql`
  mutation CreateIntimation($input: CreateIntimationInput!) {
    createIntimation(input: $input) {
      _id
      tripId
      sectorNo
      recipientType
      toEmail
      subject
      note
      attachmentUrl
      status
      createdAt
    }
  }
`;

export const UPDATE_INTIMATION = gql`
  mutation UpdateIntimation($id: String!, $input: UpdateIntimationInput!) {
    updateIntimation(id: $id, input: $input) {
      _id
      tripId
      sectorNo
      recipientType
      toEmail
      subject
      note
      attachmentUrl
      status
      updatedAt
    }
  }
`;

export const SEND_INTIMATION = gql`
  mutation SendIntimation($input: SendIntimationInput!) {
    sendIntimation(input: $input) {
      _id
      status
      sentAt
      errorMessage
    }
  }
`;

export const DELETE_INTIMATION = gql`
  mutation DeleteIntimation($id: String!) {
    deleteIntimation(id: $id)
  }
`;

export const GET_INTIMATIONS_BY_TRIP = gql`
  query GetIntimationsByTrip($tripId: String!) {
    getIntimationsByTrip(tripId: $tripId) {
      _id
      tripId
      sectorNo
      recipientType
      toEmail
      subject
      note
      attachmentUrl
      status
      sentAt
      sentBy
      errorMessage
      createdAt
      updatedAt
    }
  }
`;

export const GET_INTIMATIONS_BY_SECTOR = gql`
  query GetIntimationsBySector($tripId: String!, $sectorNo: Int!) {
    getIntimationsBySector(tripId: $tripId, sectorNo: $sectorNo) {
      _id
      tripId
      sectorNo
      recipientType
      toEmail
      subject
      note
      attachmentUrl
      status
      sentAt
      sentBy
      errorMessage
      createdAt
      updatedAt
    }
  }
`;
