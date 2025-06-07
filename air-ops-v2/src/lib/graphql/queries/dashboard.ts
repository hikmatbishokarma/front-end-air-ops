import { gql } from "@apollo/client";

export const GET_SALES_DASHBOARD = gql`
  query getSalesDashboard(
    $range: DateRange! = today
    $endDate: String
    $startDate: String
    $operatorId: String
  ) {
    getSalesDashboardData(
      endDate: $endDate
      range: $range
      startDate: $startDate
      operatorId: $operatorId
    )
  }
`;
