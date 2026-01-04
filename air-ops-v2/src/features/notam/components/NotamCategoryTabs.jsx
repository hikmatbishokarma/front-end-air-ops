import { Tabs, Tab, Box } from "@mui/material";

const categoryLabels = {
    DAILY: "Daily NOTAM",
    WATCH: "Watch NOTAM",
    PERMANENT: "Permanent NOTAM",
};

export default function NotamCategoryTabs({ value, onChange }) {
    return (
        <Box>
            <Tabs className="notam_bar_tab"
                value={value}
                onChange={(e, v) => onChange(v)}
                indicatorColor="primary"
                textColor="primary"
            >
                <Tab value="DAILY" label={categoryLabels.DAILY} />
                <Tab value="WATCH" label={categoryLabels.WATCH} />
                <Tab value="PERMANENT" label={categoryLabels.PERMANENT} />
            </Tabs>
        </Box>
    );
}
