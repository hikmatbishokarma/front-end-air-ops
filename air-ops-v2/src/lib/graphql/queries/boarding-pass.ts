import { gql } from "@apollo/client";

export const GENERATE_BOARDING_PASS = gql`
  mutation generateBoardingPass($input: GenerateBoardingPassInput!) {
    generateBoardingPass(input: $input) {
      boardingPassId
      tripId
      quotationNo
      sectorNo
      passenger {
        name
        gender
        age
        govtId
      }
      flight {
        fromCode
        fromCity
        toCode
        toCity
        departureDate
        departureTime
        arrivalDate
        arrivalTime
        flightTime
        aircraft
      }
      groundHandlers {
        source {
          name
          email
          phone
          airportCode
        }
        destination {
          name
          email
          phone
          airportCode
        }
      }
      operationType
      status
    }
  }
`;

export const GET_BOARDING_PASSES = gql`
  query getBoardingPasses($tripId: String!, $sectorNo: Int!) {
    getBoardingPasses(tripId: $tripId, sectorNo: $sectorNo) {
      boardingPassId
      tripId
      quotationNo
      sectorNo
      passenger {
        name
        gender
        age
        govtId
      }
      flight {
        fromCode
        fromCity
        toCode
        toCity
        departureDate
        departureTime
        arrivalDate
        arrivalTime
        flightTime
        aircraft
      }
      groundHandlers {
        source {
          name
          email
          phone
          airportCode
        }
        destination {
          name
          email
          phone
          airportCode
        }
      }
      operationType
      status
    }
  }
`;
