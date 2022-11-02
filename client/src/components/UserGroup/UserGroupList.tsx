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
import { useNavigate, generatePath } from "react-router";

import { useAppDispatch, useAppSelector } from "../../store/configureStore";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { getUserGroupAsync } from "../../features/UserGroup/userGroupSlice";
import GridList from "../Common/GridList";

const VISIBLE_FIELDS = ["name", "description", "isActive", "isSecurityLevel"];

const UserGroupList = () => {
  const [active, setActive] = React.useState("");

  const { userGroupList } = useAppSelector((state) => state.userGroup);
  const dispatch = useAppDispatch();
  const handleChange = (event: SelectChangeEvent, setAction: any) => {
    setAction(event.target.value as string);
  };
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUserGroupAsync());
  }, [dispatch]);

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

      // editable: true,
      headerClassName: "super-app-theme--header",
    },
  ];

  const rows = userGroupList;

  return (
    <Box>
      <Card sx={{ mt: "1em" }}>
        <CardHeader
          title="User Group"
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
            const navURL = generatePath("/UserGroup/:id", { id: row.id });

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
              navigate("/UserGroup");
            }}
          >
            Add
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default UserGroupList;
