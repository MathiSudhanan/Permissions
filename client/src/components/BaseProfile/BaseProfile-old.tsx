import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControlLabel,
  Switch,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";

import * as React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { theme, colors } from "../../styles/theme/Theme";
import { LoadingButton } from "@mui/lab";
import { FieldValues, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import agent from "../../api/agent";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { useEffect, useState } from "react";
import ListBoxSearch from "../Common/ListBoxSearch";
import CategoryNotSet from "../Category/CategoryNotSet";
import CategoryNonPermissioned from "../Category/CategoryNonPermissioned";
import CategoryPermissioned from "../Category/CategoryPermissioned";
import { ISelectModel } from "../../models/Select";
import StatPermissions from "../Stat/StatPermissions";
import { sortCategoryArray, sortStatArray } from "../../Utils/arrayUtils";

import {
  getBaseProfileNewAsync,
  getBaseProfileByIdAsync,
} from "../../features/BaseProfile/baseProfileSlice";
import { IBaseProfileStat } from "../../models/BaseProfileStat";
import { IBaseProfileCategory } from "../../models/BaseProfileCategory";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{
        border: `1px solid ${colors.gray}`,
        // backgroundColor: `linear-gradient(180deg, ${colors.gray} 0%, ${colors.white} 35%, ${colors.blue} 100%)`,
      }}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
interface IPermissionModel extends ISelectModel {
  isPermissioned: number;
  groupName: string;
}

const BaseProfile = () => {
  const navigate = useNavigate();
  const defaultIdValue = "111111111111111111111111";

  const dispatch = useAppDispatch();

  const { baseProfile } = useAppSelector((state) => state.baseProfile);

  const [filteredStats, setFilteredStats] = useState<IBaseProfileStat[]>([]);

  const [permissionedStats, setPermissionedStats] = useState<
    IBaseProfileStat[]
  >([]);

  const [notSetCategoriesList, setNotSetCategoriesList] = useState<
    IBaseProfileCategory[]
  >([]);
  const [permissionedCategoriesList, setPermissionedCategoriesList] = useState<
    IBaseProfileCategory[]
  >([]);
  const [nonPermissionedCategoriesList, setNonPermissionedCategoriesList] =
    useState<IBaseProfileCategory[]>([]);

  useEffect(() => {
    if (isAddMode) {
      dispatch(getBaseProfileNewAsync());
    } else {
      dispatch(getBaseProfileByIdAsync({ id }));
      agent.BaseProfile.getById(id).then((bp) => {});
    }

    setNonPermissionedCategoriesList([]);
    setPermissionedCategoriesList([]);
    setPermissionedStats([]);
  }, []);

  useEffect(() => {
    if (
      notSetCategoriesList.length === 0 &&
      permissionedCategoriesList.length === 0 &&
      nonPermissionedCategoriesList.length === 0
    ) {
      if (baseProfile) {
        setNotSetCategoriesList(
          sortCategoryArray([
            ...baseProfile?.BaseProfileCategories.filter(
              (x) => x.isPermissioned === null
            ),
          ])
        );
        setPermissionedCategoriesList(
          sortCategoryArray([
            ...baseProfile?.BaseProfileCategories.filter(
              (x) => x.isPermissioned === true
            ),
          ])
        );
        setNonPermissionedCategoriesList(
          sortCategoryArray([
            ...baseProfile?.BaseProfileCategories.filter(
              (x) => x.isPermissioned === false
            ),
          ])
        );

        setFilteredStats(
          sortStatArray([
            ...baseProfile.BaseProfileStats.map((ps) => {
              return {
                id: ps.id,
                statId: ps.statId,
                statName: ps.statName,
                isPermissioned: ps.isPermissioned,
                isActive: true,
                isModified: false,
              };
            }),
          ])
        );
        setPermissionedStats([
          ...baseProfile.BaseProfileStats.filter(
            (x) => x.isPermissioned !== null
          ).map((ps) => {
            return {
              id: ps.id,
              statId: ps.statId,
              isPermissioned: ps.isPermissioned,
              isActive: true,
              isModified: false,
            };
          }),
        ]);

        // setFilteredStats([...baseProfile.BaseProfileStats]);

        if (!isAddMode) {
          const fields = ["name", "description", "isActive"];
          fields.forEach((field) => setValue(field, baseProfile[field]));
        }
      }
    }
  }, [baseProfile, notSetCategoriesList?.length]);

  const { id } = useParams();
  const isAddMode = !id;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    // description: Yup.string().required("description is required"),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { isSubmitting, errors, isValid },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "all",
  });

  const submitForm = async (data: FieldValues) => {
    return isAddMode
      ? createBaseProfileAsync(data)
      : updateBaseProfileAsync(id, data);
  };

  const createBaseProfileAsync = async (data: FieldValues) => {
    try {
      const baseProfileData = { ...data };
      baseProfileData.BPCategories = [];
      baseProfileData.BPStats = [];

      permissionedCategoriesList.forEach((x) =>
        baseProfileData.BPCategories.push({
          id: "",
          categoryId: x.categoryId,
          isPermissioned: true,
          isActive: true,
          isModified: true,
        })
      );

      nonPermissionedCategoriesList.forEach((x) =>
        baseProfileData.BPCategories.push({
          id: "",
          categoryId: x.categoryId,
          isPermissioned: false,
          isActive: true,
          isModified: true,
        })
      );
      permissionedStats.forEach((x) =>
        baseProfileData.BPStats.push({
          id: "",
          statId: x.statId,
          isPermissioned: x.isPermissioned,
          isActive: true,
          isModified: true,
        })
      );

      console.log("success:", baseProfileData);
      await agent.BaseProfile.create(baseProfileData);
      toast.info("Base Profile Saved");
      navigate("/BaseProfileList");
    } catch (error) {
      toast.error(error?.error?.error);
    }
  };

  const updateBaseProfileAsync = async (id: string, data: FieldValues) => {
    const baseProfileData = { ...data };
    baseProfileData.BPCategories = [];
    baseProfileData.BPStats = [];

    permissionedCategoriesList.forEach((x) =>
      baseProfileData.BPCategories.push({
        // id: x.id,
        id: x.id === "" ? defaultIdValue : x.id,

        categoryId: x.categoryId,
        isPermissioned: true,
        isActive: true,
      })
    );

    nonPermissionedCategoriesList.forEach((x) =>
      baseProfileData.BPCategories.push({
        // id: x.id,
        id: x.id === "" ? defaultIdValue : x.id,

        categoryId: x.categoryId,
        isPermissioned: false,
        isActive: true,
      })
    );
    filteredStats.forEach((x) => {
      if (x.isModified && x.isPermissioned !== -1) {
        baseProfileData.BPStats.push({
          id: x.id === "" ? defaultIdValue : x.id,
          // id: x.id,
          statId: x.statId,
          isPermissioned: x.isPermissioned === 1 ? true : false,
          isActive: true,
        });
      }
    });
    console.log("Base Profile Data", baseProfileData);
    console.log("Base Profile", filteredStats);

    try {
      await agent.BaseProfile.modify(id, baseProfileData);
      toast.info("Base Profile Saved");
      navigate("/BaseProfileList");
    } catch (error) {
      toast.error(error?.error?.error);
    }
  };

  useEffect(() => {}, []);

  function a11yProps(index: number) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }

  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const moveItem = (from, to, itemId) => {
    switch (from.toLowerCase()) {
      case "notset":
        if (to === "permissioned") {
          const notSetToPermissioned = notSetCategoriesList.find(
            (x) => x.categoryId === itemId
          );
          if (notSetToPermissioned) {
            const pCatList = [...permissionedCategoriesList];
            pCatList.push(notSetToPermissioned);
            setPermissionedCategoriesList(sortCategoryArray(pCatList));
          }
        } else {
          const notSetToNonPermissioned = notSetCategoriesList.find(
            (x) => x.categoryId === itemId
          );
          if (notSetToNonPermissioned) {
            const npCatList = [...nonPermissionedCategoriesList];
            npCatList.push(notSetToNonPermissioned);
            setNonPermissionedCategoriesList(sortCategoryArray(npCatList));
          }
        }
        let nsCatList = [
          ...notSetCategoriesList.filter((x) => x.categoryId !== itemId),
        ];

        setNotSetCategoriesList(nsCatList);
        break;
      case "nonpermissioned":
        const toPermissioned = nonPermissionedCategoriesList.find(
          (x) => x.categoryId === itemId
        );
        if (toPermissioned) {
          permissionedCategoriesList.push(toPermissioned);
        }
        const npcl = nonPermissionedCategoriesList.filter(
          (x) => x.categoryId !== itemId
        );

        setNonPermissionedCategoriesList(npcl);
        setPermissionedCategoriesList(
          sortCategoryArray(permissionedCategoriesList)
        );

        break;
      case "permissioned":
        const toNonPermissioned = permissionedCategoriesList.find(
          (x) => x.categoryId === itemId
        );
        if (toNonPermissioned) {
          nonPermissionedCategoriesList.push(toNonPermissioned);
        }

        setPermissionedCategoriesList(
          permissionedCategoriesList.filter((x) => x.categoryId !== itemId)
        );
        setNonPermissionedCategoriesList(
          sortCategoryArray(nonPermissionedCategoriesList)
        );

        break;
      default:
        break;
    }
  };

  // const updateStat = (item, value) => {
  //   console.log("Before stat", filteredStats);

  //   const modifiedStats = filteredStats.map((x) => {
  //     if (x.statId === item.statId) {
  //       return { ...x, isPermissioned: value, isModified: true };
  //     }
  //     return x;
  //   });
  //   setFilteredStats(modifiedStats);
  //   console.log("after stat", modifiedStats);
  // };

  const handleTriChkChange = () => {
    console.log("hi");
  };

  return (
    <Card
      component="form"
      onSubmit={handleSubmit(submitForm)}
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
        title="Base Profile"
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
          <Grid xs={12} md={6}>
            <TextField
              fullWidth
              label={isAddMode ? "Name" : ""}
              variant="standard"
              autoFocus
              {...register("name", { required: "Name is required" })}
              error={!!errors.name}
              helperText={errors?.name?.message.toString()}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              fullWidth
              label={isAddMode ? "Description" : ""}
              variant="standard"
              {...register("description", {
                required: "Description is required",
              })}
              error={!!errors.name}
              helperText={errors?.description?.message.toString()}
            />
          </Grid>

          <Grid xs={12}>
            <FormControlLabel
              // value="isActive"
              control={
                <Switch
                  color="primary"
                  defaultChecked={true}
                  {...register("isActive")}
                />
              }
              label="Active"
              labelPlacement="start"
              sx={{
                mt: "1.5em",
                ml: "1%",
                color: colors.brown,
              }}
            />
          </Grid>
          <Grid xs={12}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="secondary"
              textColor="inherit"
              variant="fullWidth"
              aria-label="full width tabs example"
            >
              <Tab
                label="Category Permissions"
                {...a11yProps(0)}
                sx={{
                  background: `linear-gradient(180deg, ${colors.gray} 0%, ${colors.white} 35%, ${colors.blue} 100%)`,
                  borderTopLeftRadius: "15px",

                  ml: "1px",
                }}
              />
              <Tab
                label="Stat permissions"
                {...a11yProps(1)}
                sx={{
                  background: `linear-gradient(180deg, ${colors.gray} 0%, ${colors.white} 35%, ${colors.blue} 100%)`,
                  borderTopLeftRadius: "15px",
                  ml: "1px",
                }}
              />
            </Tabs>
            <TabPanel value={tabValue} index={0}>
              <Grid container xs={12} component="div">
                <Grid md={4} xs={12}>
                  <ListBoxSearch
                    title="Non Permissioned"
                    nonFilteredList={[]}
                    filteredList={nonPermissionedCategoriesList}
                    setFilteredList={setNonPermissionedCategoriesList}
                    ListBoxDataComponent={CategoryNonPermissioned}
                    moveItem={moveItem}
                  ></ListBoxSearch>
                </Grid>
                <Grid md={4} xs={12}>
                  <ListBoxSearch
                    title="Not Assigned"
                    nonFilteredList={baseProfile?.BaseProfileCategories}
                    filteredList={notSetCategoriesList}
                    setFilteredList={setNotSetCategoriesList}
                    ListBoxDataComponent={CategoryNotSet}
                    moveItem={moveItem}
                  ></ListBoxSearch>
                </Grid>
                <Grid md={4} xs={12}>
                  <ListBoxSearch
                    title="Permissioned"
                    nonFilteredList={[]}
                    filteredList={permissionedCategoriesList}
                    setFilteredList={setPermissionedCategoriesList}
                    ListBoxDataComponent={CategoryPermissioned}
                    moveItem={moveItem}
                  ></ListBoxSearch>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <StatPermissions
                nsStats={baseProfile?.BaseProfileStats}
                filteredStats={filteredStats}
                setFilteredStats={setFilteredStats}
                // updateStat={updateStat}
              />
            </TabPanel>
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
            <Grid xs={6}>
              <Button
                // loading={isSubmitting}
                type="submit"
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
                  navigate("/baseProfileList");
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                Back
              </Button>
            </Grid>
            <Grid xs={6}>
              <LoadingButton
                loading={isSubmitting}
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  borderRadius: "20px",
                  fontSize: "1em",
                  backgroundColor: colors.blackPrimary,
                }}
                disabled={!isValid}
              >
                Save
              </LoadingButton>
            </Grid>
          </Grid>
        </Box>
      </CardActions>
    </Card>
  );
};

export default BaseProfile;
