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
        fullName
        email
        mobileNumber
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
      roles {
        id
        name
      }
      profile
      location
      designation
      fullName
      displayName
      gender
      dateOfBirth
      mobileNumber
      alternateContact
      email
      education
      experience

      martialStatus
      anniversaryDate
      religion
      nationality

      aadhar
      pan
      passportNo
      currentAddress
      permanentAddress
      bloodGroup

      certifications {
        name
        licenceNo
        dateOfIssue
        validTill
        issuedBy
      }
      nominees {
        fullName
        idProof
        gender
        mobileNumber
        alternateContact
        relation
        address
        insurance
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

export const GET_STAFF_CERTIFICATION = gql`
  query getStaffCertifications($args: StaffCertificationInput) {
    staffCertificates(args: $args) {
      data
      totalCount
    }
  }
`;
