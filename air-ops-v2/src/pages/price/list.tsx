import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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

import { Outlet, useNavigate } from "react-router";
import PriceCreate from "./Create";
import { GET_PRICES } from "../../lib/graphql/queries/price";

export const PriceList = () => {
  const navigate = useNavigate();

  const [isNewPriceOpen, setIsNewPriceOpen] = useState(false);
  const [rows, setRows] = useState<any[]>([]);

  const getPrices = async () => {
    try {
      const data = await useGql({
        query: GET_PRICES,
        queryName: "prices",
        queryType: "query",
        variables: {},
      });
      setRows(() => {
        return data.map((price: any) => {
          return {
            id: price.id,
             aircraft:price.aircraft.name,
            createdAt: price.createdAt,
            updatedAt: price.updatedAt,
          };
        });
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getPrices();
  }, []);

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="right">Aircraft</TableCell>
              <TableCell align="right">Updated At</TableCell>
              
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                onClick={() => navigate(`/prices/edit/${row.id}`)}
              >
                <TableCell component="th" scope="row">
                  {row.refrenceNo}
                </TableCell>
                <TableCell align="right">{row.aircraft}</TableCell>
                <TableCell align="right">{row.createdAt}</TableCell>
               
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
        <Button variant="contained" onClick={() => setIsNewPriceOpen(true)}>
          NEW PRICE
        </Button>
      </Box>

      <Dialog
        open={isNewPriceOpen}
        onClose={() => setIsNewPriceOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Create New Price</DialogTitle>
        <DialogContent>
        <PriceCreate/>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsNewPriceOpen(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
     
    </>
  );
};

export default PriceList;
