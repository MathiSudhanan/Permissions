import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Tab,
  Tabs,
} from "@mui/material";

import * as React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { theme, colors } from "../../styles/theme/Theme";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import agent from "../../api/agent";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { useCallback, useEffect, useState } from "react";
import ListBoxSearch from "../Common/ListBoxSearch";
import CategoryNotSet from "../Category/CategoryNotSet";
import CategoryNonPermissioned from "../Category/CategoryNonPermissioned";
import CategoryPermissioned from "../Category/CategoryPermissioned";

import StatPermissions from "../Stat/StatPermissions";
import { sortCategoryArray, sortStatArray } from "../../Utils/arrayUtils";
import {
  getCUGProfileByIdAsync,
  getNewCUGAndBaseProfile,
} from "../../features/CUGProfile/CUGProfileSlice";
import { ICUGProfileStat } from "../../models/CUGProfileStat";
import { ICUGProfileCategory } from "../../models/CUGProfileCategory";
import { getBaseProfilesAsync } from "../../features/BaseProfile/baseProfileSlice";
import { ICUGProfile } from "../../models/CUGProfile";
import FormInputText from "../../form-components/FormInputText";
import { FormInputDropdown } from "../../form-components/FormInputDropdown";
import FormControlSwitch from "../../form-components/FormControlSwitch";
import FormBackButton from "../../form-components/FormBackButton";
import FormSubmitButton from "../../form-components/FormSubmitButton";
import { getCompanyUserGroupAsync } from "../../features/CompanyUserGroup/companyUserGroupSlice";
import CategoryPermissions from "../Category/CategoryPermissions";
import FormTabPanelList from "../../form-components/FormTabPanelList";

const defaultValues = {
  name: "",
  description: "",
  isActive: true,
  baseProfileId: "",
  companyUserGroupId: "",

  CUGProfileCategories: [],
  CUGProfileStats: [],
};

const CUGProfile = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const defaultIdValue = "111111111111111111111111";

  const { id } = useParams();
  const isAddMode = !id;

  const { cugProfile } = useAppSelector((state) => state.cugProfile);

  const [filteredStats, setFilteredStats] = useState<ICUGProfileStat[]>([]);

  const [permissionedStats, setPermissionedStats] = useState<ICUGProfileStat[]>(
    []
  );

  const [baseProfileId, setBaseProfileId] = useState("");

  const [notSetCategoriesList, setNotSetCategoriesList] = useState<
    ICUGProfileCategory[]
  >([]);
  const [permissionedCategoriesList, setPermissionedCategoriesList] = useState<
    ICUGProfileCategory[]
  >([]);
  const [nonPermissionedCategoriesList, setNonPermissionedCategoriesList] =
    useState<ICUGProfileCategory[]>([]);

  const { baseProfileNameList } = useAppSelector((state) => state.baseProfile);
  const { companyUserGroupNamesList } = useAppSelector(
    (state) => state.companyUserGroup
  );
  const [tabData, setTabData] = useState<any>([]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().optional().nullable(),
    baseProfileId: Yup.string().required("Base profile is required"),
  });

  const methods = useForm<ICUGProfile>({
    defaultValues: defaultValues,
    resolver: yupResolver(validationSchema),
    mode: "all",
  });
  const { handleSubmit, /*reset, watch,*/ control, setValue, formState } =
    methods;

  useEffect(() => {
    dispatch(getBaseProfilesAsync());
    dispatch(getCompanyUserGroupAsync());

    if (!isAddMode) {
      dispatch(getCUGProfileByIdAsync({ id }));
    }

    setNonPermissionedCategoriesList([]);
    setPermissionedCategoriesList([]);
    setPermissionedStats([]);
  }, [id, isAddMode, dispatch]);

  useEffect(() => {
    if (cugProfile) {
      if (!isAddMode) {
        const fields = [
          "name",
          "description",
          "baseProfileId",
          "companyUserGroupId",
          "isActive",
        ];
        fields.forEach((field) => setValue(field, cugProfile[field]));
      }

      if (cugProfile.CUGProfileStats.length) {
        let pStatList = sortStatArray([...cugProfile.CUGProfileStats]);
        setPermissionedStats(sortStatArray(pStatList));
        setFilteredStats(sortStatArray(pStatList));
      }

      let nsCategoryList = cugProfile?.CUGProfileCategories.filter((x) => {
        return x.isPermissioned === null;
      });
      if (nsCategoryList.length) {
        setNotSetCategoriesList(sortCategoryArray(nsCategoryList));
      }

      let pCategoryList = cugProfile?.CUGProfileCategories.filter((x) => {
        return x.isPermissioned;
      });
      if (pCategoryList.length) {
        setPermissionedCategoriesList(sortCategoryArray(pCategoryList));
      }

      let npCategoryList = cugProfile?.CUGProfileCategories.filter((x) => {
        return x.isPermissioned === false;
      });
      if (npCategoryList) {
        setNonPermissionedCategoriesList(sortCategoryArray(npCategoryList));
      }
    }
  }, [cugProfile, isAddMode, setValue]);

  const moveItem = useCallback(
    (from, to, itemId) => {
      setValue("CUGProfileCategories", [], { shouldDirty: true });
      switch (from.toLowerCase()) {
        case "notset":
          if (to === "permissioned") {
            const notSetToPermissioned = notSetCategoriesList.find(
              (x) => x.categoryId === itemId
            );

            if (notSetToPermissioned) {
              const pCatList = [...permissionedCategoriesList];

              pCatList.push({
                ...notSetToPermissioned,
                isPermissioned: true,
                isModified: true,
              });
              setPermissionedCategoriesList(sortCategoryArray(pCatList));
            }
          } else {
            const notSetToNonPermissioned = notSetCategoriesList.find(
              (x) => x.categoryId === itemId
            );
            if (notSetToNonPermissioned) {
              const npCatList = [...nonPermissionedCategoriesList];

              npCatList.push({
                ...notSetToNonPermissioned,
                isPermissioned: false,
                isModified: true,
              });
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
            permissionedCategoriesList.push({
              ...toPermissioned,
              isPermissioned: true,
              isModified: true,
            });
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
            nonPermissionedCategoriesList.push({
              ...toNonPermissioned,
              isPermissioned: false,
              isModified: true,
            });
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
      console.log("Dirty", formState.isSubmitting);
    },
    [
      nonPermissionedCategoriesList,
      notSetCategoriesList,
      permissionedCategoriesList,
      setValue,
    ]
  );

  useEffect(() => {
    setTabData([
      {
        name: "Categories",
        Props: {
          Categories: cugProfile?.CUGProfileCategories,
          notSetCategoriesList: notSetCategoriesList,
          permissionedCategoriesList: permissionedCategoriesList,
          nonPermissionedCategoriesList: nonPermissionedCategoriesList,
          moveItem: moveItem,
          setNotSetCategoriesList: setNotSetCategoriesList,
          setPermissionedCategoriesList: setPermissionedCategoriesList,
          setNonPermissionedCategoriesList: setNonPermissionedCategoriesList,
        },
        component: CategoryPermissions,
        control: control,
      },
      {
        name: "Stats",
        Props: {
          Stats: cugProfile?.CUGProfileStats,
          nsStats: cugProfile?.CUGProfileStats,
          filteredStats: filteredStats,
          setFilteredStats: setFilteredStats,
        },

        component: StatPermissions,
        control: control,
      },
    ]);
  }, [
    control,
    cugProfile?.CUGProfileCategories,
    cugProfile?.CUGProfileStats,
    filteredStats,
    moveItem,
    nonPermissionedCategoriesList,
    notSetCategoriesList,
    permissionedCategoriesList,
  ]);

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

  const submitForm = async (data: ICUGProfile) => {
    data.CUGProfileCategories = [
      ...permissionedCategoriesList,
      ...nonPermissionedCategoriesList,
    ];

    data.CUGProfileStats = [
      ...filteredStats.filter((x) => x.isModified && x.isPermissioned !== null),
    ];
    console.log("Submit Data", data);
    return isAddMode
      ? createCUGProfileAsync(data)
      : updateCUGProfileAsync(id, data);
  };

  const createCUGProfileAsync = async (data: ICUGProfile) => {
    try {
      const cugProfileData = { ...data };
      cugProfileData.CUGPCategories = [];
      cugProfileData.CUGPStats = [];

      data.CUGProfileCategories.forEach((x) => {
        if (x.isModified) {
          cugProfileData.CUGPCategories.push({
            id: "",
            categoryId: x.categoryId,
            isPermissioned: x.isPermissioned,
            isActive: true,
            isModified: x.isModified,
          });
        }
      });

      data.CUGProfileStats.forEach((x) => {
        if (x.isModified) {
          cugProfileData.CUGPStats.push({
            id: "",
            statId: x.statId,
            isPermissioned: x.isPermissioned === 1 ? true : false,
            isActive: true,
            isModified: x.isModified,
          });
        }
      });

      console.log("success:", cugProfileData);
      await agent.CUGProfile.create(cugProfileData);
      toast.info("CUG Profile Saved");
      navigate("/CUGProfileList");
    } catch (error) {
      toast.error(error?.error?.error);
    }
  };

  const updateCUGProfileAsync = async (id: string, data: ICUGProfile) => {
    const cugProfileData = { ...data };
    cugProfileData.CUGPCategories = [];
    cugProfileData.CUGPStats = [];

    data.CUGProfileCategories.forEach((x) => {
      if (x.isModified) {
        cugProfileData.CUGPCategories.push({
          // id: x.id,
          id: x.id === "" ? defaultIdValue : x.id,

          categoryId: x.categoryId,
          isPermissioned: x.isPermissioned,
          isActive: true,
          isModified: x.isModified,
        });
      }
    });

    data.CUGProfileStats.forEach((x) => {
      if (x.isModified && x.isPermissioned !== -1) {
        cugProfileData.CUGPStats.push({
          id: x.id === "" ? defaultIdValue : x.id,
          // id: x.id,
          statId: x.statId,
          isPermissioned: x.isPermissioned === 1 ? true : false,
          isActive: true,
        });
      }
    });
    console.log("CUG Profile Data", cugProfileData);
    console.log("CUG Profile", filteredStats);

    try {
      await agent.CUGProfile.modify(id, cugProfileData);
      toast.info("CUG Profile Saved");
      navigate("/CUGProfileList");
    } catch (error) {
      toast.error(error?.error?.error);
    }
  };

  useEffect(() => {
    if (baseProfileId) {
      dispatch(getNewCUGAndBaseProfile({ baseProfileId: baseProfileId }));
    }
  }, [baseProfileId]);

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
        title="Company User Group Profile"
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
            <FormInputText name="name" label="Name" control={control} />
          </Grid>
          <Grid xs={12} md={6}>
            <FormInputText
              name="description"
              label="Description"
              control={control}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <FormInputDropdown
              name="baseProfileId"
              label="Base Profile"
              control={control}
              options={baseProfileNameList}
              setValue={setBaseProfileId}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <FormInputDropdown
              name="companyUserGroupId"
              label="Company User Group"
              control={control}
              options={companyUserGroupNamesList}
              // setValue={setBaseProfileId}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <FormControlSwitch
              name="isActive"
              label="Active"
              control={control}
            />
          </Grid>
          <Grid xs={12}>
            <FormTabPanelList tabData={tabData} />
            {/* <Tabs
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
                    nonFilteredList={cugProfile?.CUGProfileCategories}
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
                nsStats={cugProfile?.CUGProfileStats}
                filteredStats={filteredStats}
                setFilteredStats={setFilteredStats}
                // updateStat={updateStat}
              />
            </TabPanel> */}
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
              <FormBackButton
                onClick={(e) => {
                  navigate("/CUGProfileList");
                  e.preventDefault();
                  e.stopPropagation();
                }}
              />
            </Grid>
            <Grid xs={6}>
              <FormSubmitButton
                isSubmitting={formState.isSubmitting}
                isValid={
                  formState.isValid ||
                  nonPermissionedCategoriesList.find((x) => x.isModified) ||
                  permissionedCategoriesList.find((x) => x.isModified) ||
                  filteredStats.find((x) => x.isModified)
                }
              />
            </Grid>
          </Grid>
        </Box>
      </CardActions>
    </Card>
  );
};

export default CUGProfile;
