import { gql } from "@apollo/client";

export const SIGN_IN = gql`
  query signIn($input: SignInInput!) {
    signIn(input: $input) {
      access_token
      user {
        id
        name
        email
        image
        role {
          name
          type
          accessPermissions
        }
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
        role {
          name
          type
          accessPermissions
        }
      }
    }
  }
`;

export const SIGN_UP = gql`
  mutation signUp($input: SignUpInput!) {
    signUp(input: $input) {
      id
    }
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation forgotPassword($email: String!) {
    forgotPassword(email: $email) {
      message
      status
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation resetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      status
      message
    }
  }
`;
