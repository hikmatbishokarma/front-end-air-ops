import React, { useEffect, useState } from 'react';
import { Box, Typography, styled, keyframes } from '@mui/material';
import { GET_ACTIVE_NOTICE } from '../../lib/graphql/queries/notice-board';
import useGql from '../../lib/graphql/gql';

const scroll = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`;

const MarqueeContainer = styled(Box)(({ theme }) => ({
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    width: '100%',
    maxWidth: '600px',
    display: 'flex',
    alignItems: 'center',
    // marginRight: 'auto', // REMOVED: This was pushing it to the left
    [theme.breakpoints.down('md')]: {
        display: 'none',
    },
}));

const MarqueeText = styled(Typography)(({ theme }) => ({
    display: 'inline-block',
    animation: `${scroll} 20s linear infinite`,
    color: theme.palette.error.main,
    fontWeight: 'bold',
    paddingLeft: '100%',
}));

export default function NoticeBoardMarquee() {
    const [activeNotice, setActiveNotice] = useState<any>(null);

    const fetchActiveNotice = async () => {
        try {
            const response = await useGql({
                query: GET_ACTIVE_NOTICE,
                queryName: "activeNoticeBoard",
                queryType: "query-without-edge",
                variables: {},
            });
            setActiveNotice(response);
        } catch (error) {
            console.error("Error fetching active notice:", error);
        }
    };

    useEffect(() => {
        fetchActiveNotice();
        // Poll every minute
        const interval = setInterval(fetchActiveNotice, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        // Add justifyContent="flex-end" to align content to the right (near the timer)
        <Box display="flex" alignItems="center" flexGrow={1} justifyContent="flex-end">
            {activeNotice && activeNotice.isActive && (
                <MarqueeContainer>
                    <MarqueeText variant="body2">
                        {activeNotice.message}
                    </MarqueeText>
                </MarqueeContainer>
            )}
        </Box>
    );
}
