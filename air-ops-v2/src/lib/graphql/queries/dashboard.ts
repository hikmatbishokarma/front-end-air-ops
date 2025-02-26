import { gql } from "@apollo/client";

export const GET_SALES_DASHBOARD = gql`
  query getSalesDashboard(
    $range: DateRange! = lastMonth
    $endDate: String
    $startDate: String
  ) {
    getSalesDashboardData(
      endDate: $endDate
      range: $range
      startDate: $startDate
    )
  }
`;
