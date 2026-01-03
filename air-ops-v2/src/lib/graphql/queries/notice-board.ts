import { gql } from "@apollo/client";

export const GET_ACTIVE_NOTICE = gql`
  query activeNoticeBoard {
    activeNoticeBoard {
      id
      message
      isActive
      startDate
      endDate
    }
  }
`;

export const CREATE_NOTICE_BOARD = gql`
  mutation createNoticeBoard($input: CreateNoticeBoardInput!) {
    createNoticeBoard(createNoticeBoardInput: $input) {
      id
      message
      startDate
      endDate
      isActive
    }
  }
`;

export const GET_NOTICE_BOARDS = gql`
  query noticeBoards(
    $filter: noticeBoardFilter! = {}
    $paging: OffsetPaging! = { limit: 10 }
    $sorting: [noticeBoardSort!]! = []
  ) {
    noticeBoards(filter: $filter, paging: $paging, sorting: $sorting) {
      totalCount
      nodes {
        id
        isActive
        startDate
        endDate
        message
        createdAt
      }
    }
  }
`;

export const GET_NOTICE_BOARD_BY_ID = gql`
  query noticeBoardById($id: ID!) {
    noticeBoard(id: $id) {
      id
      isActive
      startDate
      endDate
      message
      createdAt
    }
  }
`;

export const UPDATE_NOTICE_BOARD = gql`
  mutation updateOneNoticeBoard($input: UpdateOneNoticeBoardInput!) {
    updateOneNoticeBoard(input: $input) {
      id
    }
  }
`;

export const DELETE_NOTICE_BOARD = gql`
  mutation delete($input: DeleteOneNoticeBoardInput!){
  deleteOneNoticeBoard(input:$input){
    id
  }
}
`;