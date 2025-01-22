
import * as React from 'react';
import { useState } from 'react';
import { Box } from '@mui/material';
import { Menu, useSidebarState } from 'react-admin';
import LabelIcon from '@mui/icons-material/Label';

export const MyMenu = () => {
    const [open] = useSidebarState();
  return (
    <Box
    sx={{
        width: open ? 200 : 50,
        marginTop: 1,
        marginBottom: 1,
        transition: theme =>
            theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
    }}
>
    <Menu>
        <Menu.ResourceItems />
        <Menu.Item to="/custom-route" primaryText="Miscellaneous" leftIcon={<LabelIcon />} />
    </Menu>
    </Box>
);

}