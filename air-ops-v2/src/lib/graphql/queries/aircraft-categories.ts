import { gql } from "@apollo/client";

export const GET_AIRCRAFT_CATEGORIES = gql`
  query aircraftcategories(
    $filter: AircraftCategoryFilter! = {}
    $paging: OffsetPaging! = { limit: 10 }
    $sorting: [AircraftCategorySort!]! = []
  ) {
    aircraftCategories(filter: $filter, paging: $paging, sorting: $sorting) {
      nodes {
        id
        name
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_AIRCRAFT_CATEGORY_BY_ID = gql`
  query aircraftCategoryById($id: ID!) {
    aircraftCategory(id: $id) {
      id
      name
      isActive
    }
  }
`;

export const CREATE_AIRCRAFT_CATEGORY = gql`
  mutation aircraftCategory($input: CreateOneAircraftCategoryInput!) {
    createOneAircraftCategory(input: $input) {
      id
    }
  }
`;
export const UPDATE_AIRCRAFT_CATEGORY = gql`
  mutation updateAircraftCategory($input: UpdateOneAircraftCategoryInput!) {
    updateOneAircraftCategory(input: $input) {
      id
    }
  }
`;
