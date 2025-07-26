import { gql } from "@apollo/client";

export const GET_NOTIFICATIONS = gql`
  query systemNotifications($where: SystemNotificationWhereInput) {
    systemNotifications(where: $where) {
      id
      type
      title
      message
      metadata
      refId
      refType
      isReadBy
      createdAt
    }
  }
`;

export const MARK_NOTIFICATIO_AS_READ = gql`
  mutation markNotificationsAsRead($input: MarkAsReadInput!) {
    markNotificationsAsRead(input: $input)
  }
`;

export const HANDEL_ACCESS_REQUEST_STATUS = gql`
  mutation updateAccessRequestStatus(
    $notificationId: String!
    $status: AccessRequestStatus!
  ) {
    updateAccessRequestStatus(
      notificationId: $notificationId
      status: $status
    ) {
      id
    }
  }
`;
