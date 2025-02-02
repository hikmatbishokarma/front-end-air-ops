import { gql } from "@apollo/client";

export const CREATE_QUOTE = gql`
  mutation createQuote($input: CreateOneQuoteInput!) {
    createOneQuote(input: $input) {
      id
    }
  }
`;
