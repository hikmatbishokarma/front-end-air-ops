import * as React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Title } from 'react-admin';

export const Dashboard = () => (
    <Card>
        <Title title="Welcome to the administration" />
        <CardContent>Welcome to the Airops Admin Dashboard...</CardContent>
    </Card>
);