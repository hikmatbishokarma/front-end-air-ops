import * as React from 'react';
import { AppBar, TitlePortal } from 'react-admin';
import { Box, useMediaQuery, Theme } from '@mui/material';

import { AppBarToolbar } from './AppBarToolbar';

const CustomAppBar = () => {
    const isLargeEnough = useMediaQuery<Theme>(theme =>
        theme.breakpoints.up('sm')
    );
    return (
        <AppBar color="secondary" toolbar={<AppBarToolbar />}>
            <TitlePortal />
            {isLargeEnough && <p>Custom App Bar</p>}
            {isLargeEnough && <Box component="span" sx={{ flex: 1 }} />}
        </AppBar>
    );
};

export default CustomAppBar;