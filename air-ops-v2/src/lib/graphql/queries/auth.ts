import { gql } from "@apollo/client";

export const SIGN_IN = gql`
  query signIn($input: SignInInput!) {
    signIn(input: $input) {
      access_token
      user {
        name
        email
        roleType
      }
    }
  }
`;

export const GET_LOGIN = gql`
  query login($input: LoginInput!) {
    login(input: $input) {
      access_token
      user {
        name

        email
        roleType
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation signUp($input: SignUpInput!) {
    signUp(input: $input) {
      id
    }
  }
`;
