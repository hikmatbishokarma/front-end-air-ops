import { gql } from "@apollo/client";

export const CREATE_LIBRARY = gql`
  mutation CreateLibrary($input: CreateOneLibraryInput!) {
    createOneLibrary(input: $input) {
      id
    }
  }
`;

export const UPDATE_LIBRARY = gql`
  mutation UpdateLibrary($input: UpdateOneLibraryInput!) {
    updateOneLibrary(input: $input) {
      id
    }
  }
`;

export const DELETE_LIBRARY = gql`
  mutation deleteLibrary($input: DeleteOneLibraryInput!) {
    deleteOneLibrary(input: $input) {
      id
    }
  }
`;

export const GET_LIBRARIES = gql`
  query libraries(
    $filter: libraryFilter! = {}
    $paging: OffsetPaging! = { limit: 10 }
    $sorting: [librarySort!]! = []
  ) {
    libraries(filter: $filter, paging: $paging, sorting: $sorting) {
      totalCount
      nodes {
        id
        name
        department
        attachment
        createdAt
        updatedAt
        createdBy {
          id
          profile
          displayName
          fullName
        }
      }
    }
  }
`;

export const GET_LIBRARY_BY_ID = gql`
  query library($id: ID!) {
    library(id: $id) {
      id
      name
      department
      attachment
    }
  }
`;
