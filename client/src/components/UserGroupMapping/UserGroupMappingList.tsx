import { Box, Button, Card, CardActions, CardHeader } from "@mui/material";
import React, { useEffect } from "react";
import { colors } from "../../styles/theme/Theme";
import { generatePath, useNavigate } from "react-router";

import { useAppDispatch, useAppSelector } from "../../store/configureStore";

import { GridColDef } from "@mui/x-data-grid";
import { getUserGroupMappingAsync } from "../../features/UserGroupMapping/userGroupMappingSlice";
import GridList from "../Common/GridList";

const VISIBLE_FIELDS = ["company", "userGroupName", "userName", "isActive"];

const UserGroupMappingList = () => {
  const { userGroupMappingList } = useAppSelector(
    (state) => state.userGroupMapping
  );
  const dispatch = useAppDispatch();
  // const handleChange = (event: SelectChangeEvent, setAction: any) => {
  //   setAction(event.target.value as string);
  // };
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUserGroupMappingAsync());
  }, [dispatch]);

  console.log("UGM", userGroupMappingList);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90, hideable: true },
    {
      field: "companyId",
      headerName: "Company Id",

      hideable: true,
    },
    {
      field: "company",
      headerName: "Company",
      flex: 2,

      headerClassName: "super-app-theme--header",
    },
    {
      field: "userGroupName",
      headerName: "User Group",
      flex: 2,

      headerClassName: "super-app-theme--header",
    },
    {
      field: "userName",
      headerName: "User",
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

  const rows = userGroupMappingList;
  return (
    <Box>
      <Card sx={{ mt: "1em" }}>
        <CardHeader
          title="User Group Mapping List"
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
            console.log(row.row);
            const navURL = generatePath(
              `/UserGroupMapping/${row.row.id}/${row.row.companyId}`
            );

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
              navigate("/UserGroupMapping");
            }}
          >
            Add
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default UserGroupMappingList;
