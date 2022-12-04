import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  Box,
  Button,
  CardActions,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { getClientFundsByCompanyIdAsync } from "../../features/ClientFund/clientFundSlice";
import { getCompanyAsync } from "../../features/Company/companySlice";
import {
  clearFinalPermissions,
  getFinalPermissionsAsync,
} from "../../features/FinalPermissions/finalPermissionsSlice";
import { getUsersByCompanyIdAsync } from "../../features/User/userSlice";

import { FormSearchDropdown } from "../../form-components/FormSearchDropdown";
import FormTabPanelList from "../../form-components/FormTabPanelList";
import { IFinalPermissions } from "../../models/FinalPermissions";
import { IFinalPermissionsCategory } from "../../models/FinalPermissionsCategory";
import { IFinalPermissionsStat } from "../../models/FinalPermissionsStat";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { colors, theme } from "../../styles/theme/Theme";
import { sortCategoryArray, sortStatArray } from "../../Utils/arrayUtils";
import CategoryFinalPermissions from "../Category/CategoryFinalPermissions";
import StatFP from "../Stat/StatFP";
import StatPermissions from "../Stat/StatPermissions";

const FinalPermissions = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const defaultIdValue = "111111111111111111111111";

  const [companyId, setCompanyId] = useState("");
  const [clientFundId, setClientFundId] = useState("");
  const [userId, setUserId] = useState("");

  const { clientFundNamesList } = useAppSelector((state) => state.clientFund);
  const { companyNamesList, companyList } = useAppSelector(
    (state) => state.company
  );
  const { userNameList } = useAppSelector((state) => state.user);

  const { finalPermissions } = useAppSelector(
    (state) => state.finalPermissions
  );

  const [filteredStats, setFilteredStats] = useState<IFinalPermissionsStat[]>(
    []
  );
  const [permissionedStats, setPermissionedStats] = useState<
    IFinalPermissionsStat[]
  >([]);

  const [categoriesList, setCategoriesList] = useState<
    IFinalPermissionsCategory[]
  >([]);
  const [filteredCategoriesList, setFilteredCategoriesList] = useState<
    IFinalPermissionsCategory[]
  >([]);

  const [tabData, setTabData] = useState<any>([]);

  useEffect(() => {
    dispatch(getCompanyAsync());
    setFilteredCategoriesList([]);
    setCompanyId("");
    setClientFundId("");
    setUserId("");
    return () => {
      dispatch(clearFinalPermissions());
    };
  }, [dispatch]);

  useEffect(() => {
    if (companyId) {
      dispatch(getClientFundsByCompanyIdAsync({ companyId }));
      dispatch(getUsersByCompanyIdAsync({ companyId }));
    }
  }, [companyId, dispatch]);

  useEffect(() => {
    if (clientFundId && userId) {
      dispatch(getFinalPermissionsAsync({ clientFundId, userId }));
    }
  }, [clientFundId, dispatch, userId]);

  useEffect(() => {
    if (finalPermissions) {
      if (finalPermissions.FinalPermissionsStats?.length) {
        let pStatList = sortStatArray([
          ...finalPermissions.FinalPermissionsStats,
        ]);
        setPermissionedStats(sortStatArray(pStatList));
        setFilteredStats(sortStatArray(pStatList));
        setCategoriesList(finalPermissions.FinalPermissionsCategories);
      }
    }
  }, [finalPermissions]);
  const moveItem = useCallback((from, to, itemId) => {}, []);

  useEffect(() => {
    setTabData([
      {
        name: "Categories",
        Props: {
          setFilteredCategoriesList: setFilteredCategoriesList,
          filteredCategoriesList: filteredCategoriesList,
          categoriesList: categoriesList,
          setCategoriesList: setCategoriesList,
        },
        component: CategoryFinalPermissions,
      },
      {
        name: "Stats",
        Props: {
          Stats: finalPermissions?.FinalPermissionsStats,
          nsStats: finalPermissions?.FinalPermissionsStats,
          filteredStats: filteredStats,
          setFilteredStats: setFilteredStats,
        },

        component: StatFP,
      },
    ]);
  }, [
    finalPermissions?.FinalPermissionsCategories,
    finalPermissions?.FinalPermissionsStats,
    filteredStats,

    filteredCategoriesList,
  ]);

  return (
    <Card
      component="form"
      // onSubmit={handleSubmit(submitForm)}
      noValidate
      sx={{
        mt: "2%",
        borderRadius: "20px",
        // [theme.breakpoints.up("md")]: {
        //   mt: "5%",
        //   ml: "25%",
        //   mr: "25%",
        // },
        [theme.breakpoints.down("md")]: { m: "1%" },
      }}
    >
      <CardHeader
        title="Final Permissions"
        sx={{
          backgroundColor: colors.gray,
        }}
        titleTypographyProps={{
          color: colors.black,
          textAlign: "center",
          fontWeight: 400,
          fontSize: "3em",
          fontFamily: '"montez","cursive"',
        }}
      ></CardHeader>
      <CardContent>
        <Grid container spacing={1}>
          <Grid xs={12} md={6} item>
            <FormSearchDropdown
              name="companyId"
              label="Company"
              value={companyId}
              options={companyNamesList}
              onHandleChange={(event: any) => {
                if (event) {
                  setCompanyId(event?.target.value);
                }
              }}
            />
          </Grid>
          <Grid xs={12} md={6} item>
            <FormSearchDropdown
              name="clientFundId"
              label="ClientFund"
              value={clientFundId}
              options={clientFundNamesList}
              onHandleChange={(event: any) => {
                if (event) {
                  setClientFundId(event?.target.value);
                }
              }}
            />
          </Grid>
          <Grid xs={12} md={6} item>
            <FormSearchDropdown
              name="userId"
              label="User"
              value={userId}
              options={userNameList}
              onHandleChange={(event: any) => {
                if (event) {
                  setUserId(event?.target.value);
                }
              }}
            />
          </Grid>
          <Grid xs={12} item>
            <FormTabPanelList tabData={tabData} />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          mt: "2em",
          backgroundColor: colors.gray,
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={3}>
            <Grid xs={6} item>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  borderRadius: "20px",
                  fontSize: "1em",
                  backgroundColor: colors.blackPrimary,
                }}
                onClick={(e) => {
                  navigate("/");
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                Home
              </Button>
            </Grid>
            <Grid xs={6} item>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  borderRadius: "20px",
                  fontSize: "1em",
                  backgroundColor: colors.blackPrimary,
                }}
                onClick={(e) => {
                  setCompanyId("");
                  setClientFundId("");
                  setUserId("");
                  setCategoriesList([]);
                  setFilteredCategoriesList([]);
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardActions>
    </Card>
  );
};

export default FinalPermissions;
