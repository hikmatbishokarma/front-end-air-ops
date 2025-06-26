import { gql } from "@apollo/client";

export const CREATE_CREW_DETAIL = gql`
  mutation createCrewDetail($input: CreateOneCrewDetailInput!) {
    createOneCrewDetail(input: $input) {
      id
    }
  }
`;

export const UPDATE_CREW_DETAIL = gql`
  mutation updateCrewDetail($input: UpdateOneCrewDetailInput!) {
    updateOneCrewDetail(input: $input) {
      id
    }
  }
`;
export const GET_CREW_DETAILS = gql`
  query getCrewDetails(
    $filter: crewDetailFilter! = {}
    $paging: OffsetPaging! = { limit: 10 }
    $sorting: [crewDetailSort!]! = []
  ) {
    crewDetails(filter: $filter, paging: $paging, sorting: $sorting) {
      totalCount
      nodes {
        id
        firstName
        lastName
        middleName
        email
        mobileNumber
        type
        createdAt
        updatedAt
      }
    }
  }
`;
export const GET_CREW_DETAIL_BY_ID = gql`
  query getCrewDetailById($id: ID!) {
    crewDetail(id: $id) {
      id
      firstName
      middleName
      lastName
      location
      type
      profile
      email
      anniversaryDate
      martialStatus
      religion
      nationality
      mobileNumber
      aadhar
      pan
      gender
      dateOfBirth
      bloodGroup
      designation
      education
      experience
      alternateContact
      pinCode
      temporaryAddress
      permanentAddress
      certifications {
        certification
        validTill
        uploadCertificate
      }
      nominees {
        fullName
        idProof
        gender
        mobileNumber
        alternateContact
      }
    }
  }
`;

export const DELETE_CREW_DETAIL = gql`
  mutation deleteCrewDetail($input: DeleteOneCrewDetailInput!) {
    deleteOneCrewDetail(input: $input) {
      id
    }
  }
`;
