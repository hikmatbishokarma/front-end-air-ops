import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  TextField,
  Box,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import StatCard from "@/components/DashboardBoardSection";
import { IStatCard } from "@/shared/types/common";

const AuditControllerPage = () => {
  const [selectedTab, setSelectedTab] = useState("Audit");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<any>({});

  const statCards: IStatCard[] = [
    { status: ["Ops"], name: "Ops", countLabel: "ops" },
    {
      status: ["Tax Invoice", "Proforma Invoice"],
      name: "Invoices",
      countLabel: "invoices",
    },
    {
      status: ["Cancelled"],
      name: "Cancellations",
      countLabel: "cancellations",
    },
    { status: [], name: "Revenue", countLabel: "revenue" },
  ];

  const handleStatCardSelect = (data: IStatCard) => {
    setSelectedTab(data.name);
    // Filter logic can be added here when needed
    setFilter({});
  };

  const handelCreate = (selectedTab: string) => {
    // Create logic can be added here when needed
    console.log("Create:", selectedTab);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilter((prev: any) => ({
        ...prev,
        ...(searchTerm ? { search: searchTerm } : {}),
      }));
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  return (
    <>
      <StatCard
        selectedTab={selectedTab}
        categories={statCards}
        statData={{
          summary: {
            ops: 0,
            invoices: 0,
            cancellations: 0,
            revenue: 0,
          },
        }}
        onCreate={handelCreate}
        handleStatCardSelect={handleStatCardSelect}
        createEnabledTabs={["Audit"]}
      />

      <Box
        className="search_quo1"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          mt: 4,
          mb: 2,
          px: 2,
          py: 1,
          backgroundColor: "#f9f9f9",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Box sx={{ flex: "1 1 auto", maxWidth: 300 }}>
          <TextField
            variant="outlined"
            size="small"
            label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Button
          variant="outlined"
          onClick={() => {}}
          className="filter-date-range"
        >
          <FilterAltOutlinedIcon />
        </Button>
      </Box>

      {/* List will be added here when ready */}
      <Box sx={{ mt: 3, textAlign: "center", py: 5 }}>
        <Typography variant="h6" color="text.secondary">
          Coming soon
        </Typography>
      </Box>
    </>
  );
};

export default AuditControllerPage;
