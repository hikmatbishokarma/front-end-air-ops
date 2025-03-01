// import * as React from 'react';
// import Typography from '@mui/material/Typography';

// export default function HomePage() {

//   return (
//       <Typography>
//         Welcome to Toolpad Core!
//       </Typography>
//   );
// }
import React, { useEffect, useState } from "react";
 import banner from "../../Asset/Images/dash_banner.png";
import level from "../../Asset/Images/level.png";
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import Paper from "@mui/material/Paper";

import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { dataset, valueFormatter } from '.././weather';
import CloseIcon from "@mui/icons-material/Close";
import useGql from "../../lib/graphql/gql";
import { GET_SALES_DASHBOARD } from "../../lib/graphql/queries/dashboard";
import { useNavigate } from "react-router";
export default function DashboardPage() {

    const navigate = useNavigate();

    const [salesDashboardData, setSalesDashboardData] = useState<any>()
    const [rows, setRows] = useState()

    // chart ˚
    const chartSetting = {
        yAxis: [
            {
                label: 'rainfall (mm)',
            },
        ],
        width: 500,
        height: 300,
        sx: {
            [`.${axisClasses.left} .${axisClasses.label}`]: {
                transform: 'translate(-20px, 0)',
            },
        },
    };

    const fethSalesDashboardData = async () => {

        try {
            const data = await useGql({
                query: GET_SALES_DASHBOARD,
                queryName: "getSalesDashboardData",
                queryType: "query-without-edge",
                variables: {
                    range: "lastMonth"
                },
            });
            console.log("data:::", data)
            setSalesDashboardData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }

    }


    useEffect(() => {
        fethSalesDashboardData();
    }, []);

    return (
        <div className="graphTotal">
            <div className="boxes">
                <div className="level">
                    <img src={level} alt="" />
                </div>
                <div className="text">
                    <p>New Quotes</p>
                    <h5>{salesDashboardData?.summary?.newQuotations}</h5>
                </div>
            </div>
            <div className="boxes">
                <div className="level">
                    <img src={level} alt="" />
                </div>
                <div className="text">
                    <p>Confirmed quotes</p>
                    <h5>{salesDashboardData?.summary?.confirmedQuotations}</h5>
                </div>
            </div>
            <div className="boxes">
                <div className="level">
                    <img src={level} alt="" />
                </div>
                <div className="text">
                    <p>Quote Sold</p>
                    <h5>{salesDashboardData?.summary?.sales}</h5>
                </div>
            </div>
            <div className="boxes">
                <div className="level">
                    <img src={level} alt="" />
                </div>
                <div className="text">
                    <p>Cancelled Quotes</p>
                    <h5>{salesDashboardData?.summary?.cancellations}</h5>
                </div>
            </div>
        </div>
    );
}
