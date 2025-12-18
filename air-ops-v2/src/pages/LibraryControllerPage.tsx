import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import AddIcon from "@mui/icons-material/Add";
import { IBaseFilter, useAppFilter } from "@/hooks/useAppFilter";
import ReusableFilterPanel from "@/components/ReusableFilterPanel";
import GridViewIcon from "@mui/icons-material/GridView";
import ListViewIcon from "@mui/icons-material/ViewList";
import moment from "moment";
import { DEPARTMENT_TYPES } from "@/shared/utils";
import { LibraryList } from "@/features/library";

interface ILibraryFilter extends IBaseFilter {
  department?: { eq: string };
}

export const LibraryControllerPage = () => {
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [selectedDepartment, setSelectedDepartment] = useState<any>();

  // --- DATE FILTER STATES ---
  const [finalGqlFilter, setFinalGqlFilter] = useState<ILibraryFilter>({});

  // --- STABLE FILTER MERGE FUNCTION (The core fix) ---
  const handleFilterChange = useCallback(
    (newBaseFilter: IBaseFilter) => {
      // 1. Map the generic properties from the hook's output
      const { searchTermValue, ...rest } = newBaseFilter;

      // 2. Map the generic searchTermValue to the specific GQL field
      const searchFilter = searchTermValue
        ? {
          or: [
            { name: { iLike: searchTermValue.iLike } },
            { department: { iLike: searchTermValue.iLike } },
          ],
        }
        : {};

      const departmentFilter = selectedDepartment
        ? { department: { eq: selectedDepartment } }
        : {};

      const mergedFilter = {
        ...rest, // Contains date filter (createdAt)
        ...searchFilter,
        ...departmentFilter,
      };

      // 3. Update the final state, breaking the useEffect loop
      setFinalGqlFilter(mergedFilter);
    },
    [selectedDepartment]
  );

  // 2. Use the minimal hook
  const {
    filter: baseFilter, // Renaming to baseFilter for clarity
    searchTerm,
    setSearchTerm,
    handleFilterOpen,
    filterAnchorEl,
    handleFilterClose,
    dateFilterType,
    setDateFilterType,
    customFromDate,
    setCustomFromDate,
    customToDate,
    setCustomToDate,
    handelOnApply,
    handelOnReset,
    openFilter,
  } = useAppFilter<IBaseFilter>(
    {},
    handleFilterChange // The hook updates the final GQL filter state
  );

  // Handle search input change
  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    [setSearchTerm]
  );

  // Update filter when department changes
  const handleDepartmentChange = useCallback(
    (e: any) => {
      const newDepartment = e.target.value;
      setSelectedDepartment(newDepartment);
      // Trigger filter update
      handelOnApply();
    },
    [handelOnApply]
  );

  // Update filter when search term changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const searchFilter = searchTerm
        ? {
          or: [
            { name: { iLike: `%${searchTerm}%` } },
            { department: { iLike: `%${searchTerm}%` } },
          ],
        }
        : {};

      const departmentFilter = selectedDepartment
        ? { department: { eq: selectedDepartment } }
        : {};

      const currentFilter = baseFilter || {};
      const { searchTermValue, ...rest } = currentFilter;

      const mergedFilter = {
        ...rest, // Contains date filter (createdAt)
        ...searchFilter,
        ...departmentFilter,
      };

      setFinalGqlFilter(mergedFilter);
    }, 400); // Debounce search

    return () => clearTimeout(timer);
  }, [searchTerm, selectedDepartment, baseFilter]);

  const handleFinalReset = useCallback(() => {
    setSelectedDepartment(""); // Reset local state
    handelOnReset(); // Reset hook state (date/search)
  }, [handelOnReset]);

  return (
    <>
      <h3>Library</h3>
      <Box
        className="security_filter_bar"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <TextField className="fidels_security_md"
          variant="outlined"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearchChange}
          size="small"
          sx={{ width: 300, mr: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" >
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            variant="outlined"
            onClick={handleFilterOpen}
            className="filter-date-range"
          >
            <FilterAltOutlinedIcon />
          </Button>

          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              color={viewMode === "grid" ? "primary" : "default"}
              onClick={() => setViewMode("grid")}
              aria-label="grid view"
            >
              <GridViewIcon />
            </IconButton>
            <IconButton
              color={viewMode === "list" ? "primary" : "default"}
              onClick={() => setViewMode("list")}
              aria-label="list view"
            >
              <ListViewIcon />
            </IconButton>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            color="primary"
          >
            Add Docs
          </Button>
        </Box>
      </Box>

      <LibraryList
        filter={finalGqlFilter}
        searchTerm={searchTerm}
        viewMode={viewMode}
        open={open}
        setOpen={setOpen}
      />

      <ReusableFilterPanel
        open={openFilter}
        anchorEl={filterAnchorEl}
        onClose={handleFilterClose}
        title="Filter"
        showDateFilter
        dateFilterType={dateFilterType}
        onDateFilterChange={setDateFilterType}
        fromDate={customFromDate ? moment(customFromDate) : null}
        toDate={customToDate ? moment(customToDate) : null}
        onFromDateChange={(date: moment.Moment | null) => {
          if (date) {
            if (dateFilterType !== "custom") {
              setDateFilterType("custom");
            }
            setCustomFromDate(date.format("YYYY-MM-DD"));
          } else {
            setCustomFromDate("");
          }
        }}
        onToDateChange={(date: moment.Moment | null) => {
          if (date) {
            if (dateFilterType !== "custom") {
              setDateFilterType("custom");
            }
            setCustomToDate(date.format("YYYY-MM-DD"));
          } else {
            setCustomToDate("");
          }
        }}
        onApply={() => {
          handelOnApply();
          handleFilterClose();
        }}
        onReset={handleFinalReset}
      >
        <Typography variant="subtitle2" gutterBottom>
          Department
        </Typography>
        <Select
          fullWidth
          size="small"
          value={selectedDepartment}
          onChange={handleDepartmentChange}
          sx={{ mb: 3 }}
        >
          <MenuItem value="">All</MenuItem>
          {DEPARTMENT_TYPES.map((dept) => (
            <MenuItem key={dept.value} value={dept.value}>
              {dept.label}
            </MenuItem>
          ))}
        </Select>
      </ReusableFilterPanel>
    </>
  );
};
