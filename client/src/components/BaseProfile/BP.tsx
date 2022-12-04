import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  clearBaseProfile,
  getBaseProfileByIdAsync,
  getBaseProfileNewAsync,
} from "../../features/BaseProfile/baseProfileSlice";
import { IBaseProfileCategory } from "../../models/BaseProfileCategory";
import { IBaseProfileStat } from "../../models/BaseProfileStat";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { IBaseProfile } from "../../models/BaseProfile";
import { useForm } from "react-hook-form";
import FormSubmitButton from "../../form-components/FormSubmitButton";
import FormBackButton from "../../form-components/FormBackButton";
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  CardActions,
  Box,
} from "@mui/material";
import { colors, theme } from "../../styles/theme/Theme";
import CategoryPermissions from "../Category/CategoryPermissions";

import FormInputText from "../../form-components/FormInputText";
import FormControlSwitch from "../../form-components/FormControlSwitch";
import FormTabPanelList from "../../form-components/FormTabPanelList";
import { sortCategoryArray, sortStatArray } from "../../Utils/arrayUtils";
import StatPermissions from "../Stat/StatPermissions";
import agent from "../../api/agent";
import { toast } from "react-toastify";

const defaultValues = {
  name: "",
  description: "",
  isActive: true,
  baseProfileId: "",
  BaseProfileCategories: [],
  BaseProfileStats: [],
};

const BP = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const defaultIdValue = "111111111111111111111111";

  const { id } = useParams();
  const isAddMode = !id;

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

  const [tabData, setTabData] = useState<any>([]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    // description: Yup.string().required("description is required"),
  });

  const methods = useForm<IBaseProfile>({
    defaultValues: defaultValues,
    resolver: yupResolver(validationSchema),
    mode: "all",
  });
  const { handleSubmit, /*reset, watch,*/ control, setValue, formState } =
    methods;

  useEffect(() => {
    if (isAddMode) {
      dispatch(getBaseProfileNewAsync());
    } else {
      dispatch(getBaseProfileByIdAsync({ id }));
    }
  }, [id, isAddMode, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearBaseProfile());
    };
  }, [dispatch]);

  useEffect(() => {
    if (baseProfile) {
      if (!isAddMode) {
        const fields = ["name", "description", "isActive"];
        fields.forEach((field) => setValue(field, baseProfile[field]));
      }

      if (baseProfile.BaseProfileStats.length) {
        let pStatList = sortStatArray([...baseProfile.BaseProfileStats]);
        setPermissionedStats(sortStatArray(pStatList));
        setFilteredStats(sortStatArray(pStatList));
      }

      let nsCategoryList = baseProfile.BaseProfileCategories.filter((x) => {
        return x.isPermissioned === null;
      });
      if (nsCategoryList.length) {
        setNotSetCategoriesList(sortCategoryArray(nsCategoryList));
      }

      let pCategoryList = baseProfile.BaseProfileCategories.filter((x) => {
        return x.isPermissioned;
      });
      if (pCategoryList.length) {
        setPermissionedCategoriesList(sortCategoryArray(pCategoryList));
      }

      let npCategoryList = baseProfile.BaseProfileCategories.filter((x) => {
        return x.isPermissioned === false;
      });
      if (npCategoryList) {
        setNonPermissionedCategoriesList(sortCategoryArray(npCategoryList));
      }
    }
  }, [baseProfile, isAddMode, setValue]);

  const moveItem = useCallback(
    (from, to, itemId) => {
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
    },
    [
      nonPermissionedCategoriesList,
      notSetCategoriesList,
      permissionedCategoriesList,
    ]
  );

  useEffect(() => {
    setTabData([
      {
        name: "Categories",
        Props: {
          Categories: baseProfile?.BaseProfileCategories,
          notSetCategoriesList: notSetCategoriesList,
          permissionedCategoriesList: permissionedCategoriesList,
          nonPermissionedCategoriesList: nonPermissionedCategoriesList,
          moveItem: moveItem,
          setNotSetCategoriesList: setNotSetCategoriesList,
          setPermissionedCategoriesList: setPermissionedCategoriesList,
          setNonPermissionedCategoriesList: setNonPermissionedCategoriesList,
        },
        component: CategoryPermissions,
      },
      {
        name: "Stats",
        Props: {
          Stats: baseProfile?.BaseProfileStats,
          nsStats: baseProfile?.BaseProfileStats,
          filteredStats: filteredStats,
          setFilteredStats: setFilteredStats,
        },

        component: StatPermissions,
      },
    ]);
  }, [
    baseProfile?.BaseProfileCategories,
    baseProfile?.BaseProfileStats,
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

  const submitForm = async (data: IBaseProfile) => {
    data.BaseProfileCategories = [
      ...permissionedCategoriesList,
      ...nonPermissionedCategoriesList,
    ];

    data.BaseProfileStats = [
      ...filteredStats.filter((x) => x.isModified && x.isPermissioned !== null),
    ];

    return isAddMode
      ? createBaseProfileAsync(data)
      : updateBaseProfileAsync(id, data);
  };

  const createBaseProfileAsync = async (data: IBaseProfile) => {
    try {
      const baseProfileData = { ...data };

      baseProfileData.BPCategories = [];
      baseProfileData.BPStats = [];

      data.BaseProfileCategories.forEach((x) =>
        baseProfileData.BPCategories.push({
          id: "",
          categoryId: x.categoryId,
          isPermissioned: x.isPermissioned,
          isActive: true,
          isModified: true,
        })
      );

      data.BaseProfileStats.forEach((x) =>
        baseProfileData.BPStats.push({
          id: "",
          statId: x.statId,
          isPermissioned: x.isPermissioned === 1 ? true : false,

          isActive: true,
          isModified: true,
        })
      );
      delete baseProfileData["BaseProfileStats"];
      delete baseProfileData["BaseProfileCategories"];

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

    data.BaseProfileCategories.forEach((x) => {
      baseProfileData.BPCategories.push({
        // id: x.id,
        id: x.id === "" ? defaultIdValue : x.id,

        categoryId: x.categoryId,
        isPermissioned: x.isPermissioned,

        isActive: true,
      });
    });

    data.BaseProfileStats.forEach((x) => {
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

    try {
      await agent.BaseProfile.modify(id, baseProfileData);
      toast.info("Base Profile Saved");
      navigate("/BaseProfileList");
    } catch (error) {
      toast.error(error?.error?.error);
    }
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
          <Grid xs={12} md={6} item>
            <FormInputText name="name" label="Name" control={control} />
          </Grid>
          <Grid xs={12} md={6} item>
            <FormInputText
              name="description"
              label="Description"
              control={control}
            />
          </Grid>

          <Grid xs={12} item>
            <FormControlSwitch
              name="isActive"
              label="Active"
              control={control}
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
              <FormBackButton
                onClick={(e) => {
                  navigate("/BaseProfileList");
                  e.preventDefault();
                  e.stopPropagation();
                }}
              />
            </Grid>
            <Grid xs={6} item>
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

export default BP;
