import { gql } from "@apollo/client";

export const CREATE_AGENT = gql`
  mutation createAgent($agent: AgentDto!) {
    createAgent(agent: $agent) {
      id
    }
  }
`;

export const GET_AGENTS = gql`
  query agents(
    $filter: agentFilter! = {}
    $paging: OffsetPaging! = { limit: 10 }
    $sorting: [agentSort!]! = []
  ) {
    agents(filter: $filter, paging: $paging, sorting: $sorting) {
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

export const GET_AGENT_BY_ID = gql`
  query agent($id: ID!) {
    agent(id: $id) {
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

export const UPDATE_AGENT = gql`
  mutation updateAgent($input: UpdateOneAgentInput!) {
    updateOneAgent(input: $input) {
      id
    }
  }
`;
