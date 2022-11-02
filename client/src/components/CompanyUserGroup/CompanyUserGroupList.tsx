import { Box, Button, Card, CardActions, CardHeader } from "@mui/material";
import React, { useEffect } from "react";
import { colors } from "../../styles/theme/Theme";
import { generatePath, useNavigate } from "react-router";

import { useAppDispatch, useAppSelector } from "../../store/configureStore";

import { GridColDef } from "@mui/x-data-grid";
import { getCompanyUserGroupAsync } from "../../features/CompanyUserGroup/companyUserGroupSlice";
import GridList from "../Common/GridList";

const VISIBLE_FIELDS = [
  "name",
  "description",
  "company",
  "userGroup",
  "isActive",
];

const CompanyUserGroupList = () => {
  const { companyUserGroupList } = useAppSelector(
    (state) => state.companyUserGroup
  );
  const dispatch = useAppDispatch();
  // const handleChange = (event: SelectChangeEvent, setAction: any) => {
  //   setAction(event.target.value as string);
  // };
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCompanyUserGroupAsync());
  }, [dispatch]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90, hideable: true },
    {
      field: "name",
      headerName: "Name",
      flex: 2,

      headerClassName: "super-app-theme--header",
    },
    {
      field: "description",
      headerName: "Description",
      flex: 2,

      headerClassName: "super-app-theme--header",
    },
    {
      field: "company",
      headerName: "Company",
      flex: 2,

      headerClassName: "super-app-theme--header",
    },
    {
      field: "userGroup",
      headerName: "User Group",
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

  const rows = companyUserGroupList;
  return (
    <Box>
      <Card sx={{ mt: "1em" }}>
        <CardHeader
          title="Company User Group List"
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
            const navURL = generatePath("/CompanyUserGroup/:id", {
              id: row.id,
            });

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
              navigate("/CompanyUserGroup");
            }}
          >
            Add
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default CompanyUserGroupList;
