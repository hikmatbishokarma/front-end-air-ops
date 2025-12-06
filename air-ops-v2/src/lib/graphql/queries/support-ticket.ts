import { gql } from "@apollo/client";

export const CREATE_SUPPORT_TICKET = gql`
  mutation createOneTicket($input: CreateOneTicketInput!){
  createOneTicket(input:$input){
    id
  }
}

`;


export const UPDATE_SUPPORT_TICKET = gql`
mutation updateOneTicket($input: UpdateOneTicketInput!){
  updateOneTicket(input:$input){
    id
  }
}

`;

export const ADD_MESSAGE_TO_TICKET = gql`
mutation addMessageToTicket($input: CreateMessageInput!){
  addMessageToTicket(input:$input){
    id
  }
}

`

export const GET_SUPPORT_TICKETS = gql`
query tickets(
$filter: TicketFilter! = {}
$paging: OffsetPaging! = {limit: 10}
$sorting: [TicketSort!]! = []
){
  tickets(filter:$filter,paging:$paging,sorting:$sorting){
    totalCount
    nodes
    {
      id
      subject
      priority
      status
      department
      messages{
        attachments
        message
        createdAt
        author{
          id
          displayName
          fullName
          profile
          phone
          email
        }
        
      }
      operator{
        id
        companyLogo
        companyName
        
      }
      requester{
        fullName
        email
        phone
        displayName
        profile
      }
      createdAt
      updatedAt
    }
  }
}
 `

export const GET_SUPPORT_TICKET = gql`
 query ticketById($id: ID!){
  ticket(id:$id)  {
      id
      subject
      priority
      department
      status
      messages{
        attachments
        message
        createdAt
        author{
          id
          displayName
          fullName
          profile
          phone
          email
        }
        
      }
      operator{
        id
        companyLogo
        companyName
        
      }
      requester{
        fullName
        email
        phone
        displayName
        profile
      }
      createdAt
      updatedAt
    }
}
 `