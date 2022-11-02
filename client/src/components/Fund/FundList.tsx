import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import Grid from "@mui/system/Unstable_Grid";
import React, { useEffect } from "react";
import { colors } from "../../styles/theme/Theme";
import { useNavigate,generatePath } from "react-router";

import { useAppDispatch, useAppSelector } from "../../store/configureStore";

import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridPagination,
} from "@mui/x-data-grid";

import { getCategoriesAsync } from "../../features/Category/categorySlice";
import GridList from "../Common/GridList";
import { getFundsAsync } from "../../features/Fund/fundSlice";

const VISIBLE_FIELDS = [
  "name",
  "description",
  "startDate",
  "endDate",
  "isFOF",
  "isActive",
  "isSecurityLevel",
];

const FundList = () => {
  const [active, setActive] = React.useState("");

  const [securityLevel, setSecurityLevel] = React.useState("");
  const { fundList } = useAppSelector((state) => state.fund);
  const dispatch = useAppDispatch();
  const handleChange = (event: SelectChangeEvent, setAction: any) => {
    setAction(event.target.value as string);
  };
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getFundsAsync());
  }, [fundList]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90, hideable: true },
    {
      field: "name",
      headerName: "Name",
      flex: 1,

      headerClassName: "super-app-theme--header",
    },
    {
      field: "description",
      headerName: "Description",
      flex: 2,

      headerClassName: "super-app-theme--header",
    },
    {
      field: "isActive",
      headerName: "Active",
      type: "boolean",
      flex: 0.8,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "isSecurityLevel",
      headerName: "Security Level",
      description: "This column has a value getter and is not sortable.",
      flex: 0.8,

      headerClassName: "super-app-theme--header",
    },
    {
      field: "startDate",
      headerName: "Start Date",
      description: "This column has a value getter and is not sortable.",
      flex: 0.8,

      headerClassName: "super-app-theme--header",
    },
    {
      field: "endDate",
      headerName: "End Date",
      description: "This column has a value getter and is not sortable.",
      flex: 0.8,

      headerClassName: "super-app-theme--header",
    },
    {
      field: "isFOF",
      headerName: "Fund of Fund",
      description: "This column has a value getter and is not sortable.",
      flex: 0.8,

      headerClassName: "super-app-theme--header",
    },
  ];

  const rows = fundList;

  const data = {
    columns: columns,
    rows: rows,
    visibleFields: VISIBLE_FIELDS,
    // rowLength: 100,
  };
  // Otherwise filter will be applied on fields such as the hidden column id
  const columns1 = React.useMemo(
    () =>
      data.columns.filter((column) => VISIBLE_FIELDS.includes(column.field)),
    [data.columns]
  );

  return (
    <Box>
      <Card sx={{ mt: "1em" }}>
        <CardHeader
          title="Fund List"
          sx={{
            backgroundColor: colors.gray,
          }}
          titleTypographyProps={{
            color: colors.black,
            // textAlign: "center",
            fontWeight: 400,
            fontSize: "2em",
            fontFamily: '"montez","cursive"',
          }}
        ></CardHeader>
      </Card>
      <Card
        sx={{
          height: 400,
          width: "100%",
          mt: "1em",
          "& .super-app-theme--header": {
            backgroundColor: colors.gray,
          },
        }}
      >
        {/* <CardHeader
            title="Category"
            sx={{
              backgroundColor: colors.gray,
            }}
            titleTypographyProps={{
              color: colors.black,
              textAlign: "center",
              fontWeight: 400,
              fontSize: "2em",
              fontFamily: '"montez","cursive"',
            }}
          ></CardHeader> */}
        {/* <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            // checkboxSelection
            // disableSelectionOnClick
            // experimentalFeatures={{ newEditingApi: true }}
            initialState={{
              //...data.initialState,
              columns: {
                columnVisibilityModel: {
                  id: false,
                  brokerId: false,
                  status: false,
                },
              },
            }}
          /> */}

        {/* <DataGrid
            {...data}
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            // pageSize={5}
            // rowsPerPageOptions={[5]}
            columns={columns1}
            components={{ Toolbar: GridToolbar }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
          /> */}

        <GridList
          rows={rows}
          columns={columns}
          visibleFields={VISIBLE_FIELDS}
          onRowDoubelClick={(row) => {
            const navURL = generatePath("/Fund/:id", { id: row.id });

            navigate(navURL);
          }}
        />
      </Card>

      <Card>
        <CardActions
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "right",
          }}
        >
          <Button
            type="submit"
            // fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              borderRadius: "20px",
              fontSize: "1em",
              backgroundColor: colors.blackPrimary,
            }}
            // disabled={!isValid}
            onClick={(e) => {
              navigate("/");
            }}
          >
            Home
          </Button>
          <Button
            type="submit"
            // fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              borderRadius: "20px",
              fontSize: "1em",
              backgroundColor: colors.blackPrimary,
            }}
            // disabled={!isValid}
            onClick={(e) => {
              navigate("/Fund");
            }}
          >
            Add
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default FundList;
