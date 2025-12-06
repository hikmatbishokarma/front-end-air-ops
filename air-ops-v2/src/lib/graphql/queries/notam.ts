import { gql } from "@apollo/client";

export const CREATE_NOTAM = gql`
 mutation createNotam($input: CreateOneNotamInput!) {
  createOneNotam(input: $input) {
    id
  }
}

`;


export const UPDATE_NOTAMS = gql`
mutation updateNotam($input: UpdateOneNotamInput!) {
  updateOneNotam(input: $input) {
    id
  }
}
`

export const GET_NOTAMS_BY_ID = gql`
query getNotamsById($id: ID!) {
  notam(id: $id) {
    id
    region
    
    fileName
    category
    createdAt
    updatedAt
  }
}

`


export const GET_NOTAMS = gql`
query getNotams(
  $filter: NotamFilter! = {}
  $paging: OffsetPaging! = { limit: 10 }
  $sorting: [NotamSort!]! = []
) {
  notams(filter: $filter, paging: $paging, sorting: $sorting) {
    nodes {
      id
      region
     
      fileName
      category
      operator {
        id
        name
        companyLogo
        companyName
      }
      createdAt
      updatedAt
    }
  }
}
`