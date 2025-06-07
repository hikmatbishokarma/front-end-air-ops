import { gql } from "@apollo/client";

export const CREATE_OPERATOR = gql`
  mutation createOperator($operator: OperatorDto!) {
    createOperator(operator: $operator) {
      id
    }
  }
`;

export const GET_OPERATORS = gql`
  query operators(
    $filter: operatorFilter! = {}
    $paging: OffsetPaging! = { limit: 10 }
    $sorting: [operatorSort!]! = []
  ) {
    operators(filter: $filter, paging: $paging, sorting: $sorting) {
      nodes {
        id
        name
        email
        phone
        address
        pinCode
        city
        companyName
        supportEmail
        isActive
      }
    }
  }
`;

export const GET_OPERATOR_BY_ID = gql`
  query operator($id: ID!) {
    operator(id: $id) {
      id
      name
      email
      phone
      address
      pinCode
      city
      companyName
      companyLogo
      websiteUrl
      supportEmail
      themeColor
      isActive
    }
  }
`;

export const UPDATE_OPERATOR = gql`
  mutation updateOperator($input: UpdateOneOperatorInput!) {
    updateOneOperator(input: $input) {
      id
    }
  }
`;
