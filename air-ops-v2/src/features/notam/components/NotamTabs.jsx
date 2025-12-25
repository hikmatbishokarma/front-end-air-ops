import { Tabs, Tab, Box } from "@mui/material";

const CATEGORY = {
    DAILY: "Daily NOTAM",
    WATCH: "Watch NOTAM",
    PERMANENT: "Permanent NOTAM",
};

export default function NotamTabs({ value, onChange }) {
    return (
        <Box className="notam_daily">
            <Tabs
                value={value}
                onChange={(e, v) => onChange(v)}
                indicatorColor="primary"
                textColor="primary"
            >
                <Tab value="DAILY" label={CATEGORY.DAILY} />
                <Tab value="WATCH" label={CATEGORY.WATCH} />
                <Tab value="PERMANENT" label={CATEGORY.PERMANENT} />
            </Tabs>
        </Box>
    );
}
