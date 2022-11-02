import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  SelectChangeEvent,
} from "@mui/material";
import React, { useEffect } from "react";
import { colors } from "../../styles/theme/Theme";
// import { useNavigate } from "react-router";
import { generatePath, useNavigate } from "react-router";

import { useAppDispatch, useAppSelector } from "../../store/configureStore";

import {
  GridColDef,
} from "@mui/x-data-grid";

import { getBaseProfilesAsync } from "../../features/BaseProfile/baseProfileSlice";
import GridList from "../Common/GridList";

const VISIBLE_FIELDS = ["name", "description", "isActive"];

const BaseProfileList = () => {
  const [active, setActive] = React.useState("");

  const [securityLevel, setSecurityLevel] = React.useState("");
  const { baseProfileList } = useAppSelector((state) => state.baseProfile);
  const dispatch = useAppDispatch();
  const handleChange = (event: SelectChangeEvent, setAction: any) => {
    setAction(event.target.value as string);
  };
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getBaseProfilesAsync());
  }, []);

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
  ];

  const rows = baseProfileList;

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
          title="Base Profile List"
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
        <GridList
          rows={rows}
          columns={columns}
          visibleFields={VISIBLE_FIELDS}
          onRowDoubelClick={(row) => {
            const navURL = generatePath("/BaseProfile/:id", { id: row.id });

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
              navigate("/BaseProfile");
            }}
          >
            Add
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default BaseProfileList;
