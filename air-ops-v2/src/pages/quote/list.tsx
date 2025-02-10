import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { QuoteStatus } from "../../lib/utils";
import useGql from "../../lib/graphql/gql";
import { GET_QUOTES } from "../../lib/graphql/queries/quote";
import QuoteCreate from "./create";
import { Outlet, useNavigate } from "react-router";

export const QuoteList = () => {
  const navigate = useNavigate();

  const [isNewQuote, setIsNewQuote] = useState(false);
  const [rows, setRows] = useState<any[]>([]);

  const getQuotes = async () => {
    try {
      const data = await useGql({
        query: GET_QUOTES,
        queryName: "quotes",
        queryType: "query",
        variables: {},
      });
      setRows(() => {
        return data.map((quote: any) => {
          return {
            id: quote.id,
            refrenceNo: quote.referenceNumber,
            status: QuoteStatus[quote.status],
            requester: quote.requestedBy.name,
            // representative: quote.representative.name,
            itinerary: quote.itinerary
              .map((itinerary: any) => {
                return `${itinerary.source} - ${itinerary.destination} PAX ${itinerary.paxNumber}`;
              })
              .join(", "),
            createdAt: quote.createdAt,
            updatedAt: quote.updatedAt,
          };
        });
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getQuotes();
  }, []);

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Requester</TableCell>
              <TableCell align="right">Itinenary</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                onClick={() => navigate(`/quotes/edit/${row.id}`)}
              >
                <TableCell component="th" scope="row">
                  {row.refrenceNo}
                </TableCell>
                <TableCell align="right">{row.status}</TableCell>
                <TableCell align="right">{row.requester}</TableCell>
                <TableCell align="right">{row.itinerary}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
        <Button variant="contained" onClick={() => setIsNewQuote(true)}>
          NEW QUOTE
        </Button>
      </Box>
      <QuoteCreate isNewQuote={isNewQuote} setIsNewQuote={setIsNewQuote} />
    </>
  );
};

export default QuoteList;
