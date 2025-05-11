import { gql } from "@apollo/client";

export const GET_SALES_DASHBOARD = gql`
  query getSalesDashboard(
    $range: DateRange! = today
    $endDate: String
    $startDate: String
    $agentId: String
  ) {
    getSalesDashboardData(
      endDate: $endDate
      range: $range
      startDate: $startDate
      agentId: $agentId
    )
  }
`;
