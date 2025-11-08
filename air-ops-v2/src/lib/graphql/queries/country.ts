import { gql } from "@apollo/client";

export const GET_COUNTRIES = gql`
  query countries(
    $filter: CountryFilter! = {}
    $paging: OffsetPaging! = { limit: 10 }
    $sorting: [CountrySort!]! = []
  ) {
    countries(filter: $filter, paging: $paging, sorting: $sorting) {
      nodes {
        id
        name
        isoCode
        currency
        flagUrl
        emoji
        timezone
        dialCode
        latitude
        longitude
      }
    }
  }
`;
