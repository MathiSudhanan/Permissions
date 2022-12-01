import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  getHedgeFundProfileByIdAsync,
  getHedgeFundProfileNewAsync,
} from "../../features/HFProfile/hedgeFundProfileSlice";
import { IHedgeFundProfileCategory } from "../../models/HFProfileCategory";
import { IHedgeFundProfileStat } from "../../models/HFProfileStat";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { IHedgeFundProfile } from "../../models/HFProfile";
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
import { getFundsAsync } from "../../features/Fund/fundSlice";
import { FormInputDropdown } from "../../form-components/FormInputDropdown";

const defaultValues = {
  name: "",
  description: "",
  isActive: true,
  fundId: "",
  hedgeFundProfileId: "",
  HedgeFundProfileCategories: [],
  HedgeFundProfileStats: [],
};

const HedgeFundProfile = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const defaultIdValue = "111111111111111111111111";

  const { id } = useParams();
  const isAddMode = !id;

  const { hedgeFundProfile } = useAppSelector(
    (state) => state.hedgeFundProfile
  );

  const { fundNamesList } = useAppSelector((state) => state.fund);

  const [filteredStats, setFilteredStats] = useState<IHedgeFundProfileStat[]>(
    []
  );
  const [permissionedStats, setPermissionedStats] = useState<
    IHedgeFundProfileStat[]
  >([]);
  const [notSetCategoriesList, setNotSetCategoriesList] = useState<
    IHedgeFundProfileCategory[]
  >([]);
  const [permissionedCategoriesList, setPermissionedCategoriesList] = useState<
    IHedgeFundProfileCategory[]
  >([]);
  const [nonPermissionedCategoriesList, setNonPermissionedCategoriesList] =
    useState<IHedgeFundProfileCategory[]>([]);

  const [tabData, setTabData] = useState<any>([]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    // description: Yup.string().required("description is required"),
  });

  const methods = useForm<IHedgeFundProfile>({
    defaultValues: defaultValues,
    resolver: yupResolver(validationSchema),
    mode: "all",
  });
  const { handleSubmit, /*reset, watch,*/ control, setValue, formState } =
    methods;

  useEffect(() => {
    dispatch(getFundsAsync());

    if (isAddMode) {
      dispatch(getHedgeFundProfileNewAsync());
    } else {
      dispatch(getHedgeFundProfileByIdAsync({ id }));
    }
  }, [id, isAddMode, dispatch]);

  useEffect(() => {
    if (hedgeFundProfile) {
      if (!isAddMode) {
        const fields = ["name", "description", "isActive", "fundId"];
        fields.forEach((field) => setValue(field, hedgeFundProfile[field]));
      }

      if (hedgeFundProfile.HedgeFundProfileStats.length) {
        let pStatList = sortStatArray([
          ...hedgeFundProfile.HedgeFundProfileStats,
        ]);
        setPermissionedStats(sortStatArray(pStatList));
        setFilteredStats(sortStatArray(pStatList));
      }

      let nsCategoryList = hedgeFundProfile.HedgeFundProfileCategories.filter(
        (x) => {
          return x.isPermissioned === null;
        }
      );
      if (nsCategoryList.length) {
        setNotSetCategoriesList(sortCategoryArray(nsCategoryList));
      }

      let pCategoryList = hedgeFundProfile.HedgeFundProfileCategories.filter(
        (x) => {
          return x.isPermissioned;
        }
      );
      if (pCategoryList.length) {
        setPermissionedCategoriesList(sortCategoryArray(pCategoryList));
      }

      let npCategoryList = hedgeFundProfile.HedgeFundProfileCategories.filter(
        (x) => {
          return x.isPermissioned === false;
        }
      );
      if (npCategoryList) {
        setNonPermissionedCategoriesList(sortCategoryArray(npCategoryList));
      }
    }
  }, [hedgeFundProfile, isAddMode, setValue]);

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
          Categories: hedgeFundProfile?.HedgeFundProfileCategories,
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
          Stats: hedgeFundProfile?.HedgeFundProfileStats,
          nsStats: hedgeFundProfile?.HedgeFundProfileStats,
          filteredStats: filteredStats,
          setFilteredStats: setFilteredStats,
        },

        component: StatPermissions,
      },
    ]);
  }, [
    hedgeFundProfile?.HedgeFundProfileCategories,
    hedgeFundProfile?.HedgeFundProfileStats,
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

  const submitForm = async (data: IHedgeFundProfile) => {
    data.HedgeFundProfileCategories = [
      ...permissionedCategoriesList,
      ...nonPermissionedCategoriesList,
    ];

    data.HedgeFundProfileStats = [
      ...filteredStats.filter((x) => x.isModified && x.isPermissioned !== null),
    ];
    console.log("Submit Data", data);

    return isAddMode
      ? createHedgeFundProfileAsync(data)
      : updateHedgeFundProfileAsync(id, data);
  };

  const createHedgeFundProfileAsync = async (data: IHedgeFundProfile) => {
    try {
      const hedgeFundProfileData = { ...data };
      console.log("Create", data);
      hedgeFundProfileData.HFPCategories = [];
      hedgeFundProfileData.HFPStats = [];

      data.HedgeFundProfileCategories.forEach((x) =>
        hedgeFundProfileData.HFPCategories.push({
          id: "",
          categoryId: x.categoryId,
          isPermissioned: x.isPermissioned,
          isActive: true,
          isModified: true,
        })
      );

      data.HedgeFundProfileStats.forEach((x) =>
        hedgeFundProfileData.HFPStats.push({
          id: "",
          statId: x.statId,
          isPermissioned: x.isPermissioned === 1 ? true : false,

          isActive: true,
          isModified: true,
        })
      );
      delete hedgeFundProfileData["HedgeFundProfileStats"];
      delete hedgeFundProfileData["HedgeFundProfileCategories"];

      console.log("success:", hedgeFundProfileData);
      await agent.HFProfile.create(hedgeFundProfileData);
      toast.info("Hedge Fund Profile Saved");
      navigate("/HFProfileList");
    } catch (error) {
      toast.error(error?.error?.error);
    }
  };

  const updateHedgeFundProfileAsync = async (id: string, data: FieldValues) => {
    const hedgeFundProfileData = { ...data };
    hedgeFundProfileData.HFPCategories = [];
    hedgeFundProfileData.HFPStats = [];

    data.HedgeFundProfileCategories.forEach((x) => {
      if (x.isModified) {
        hedgeFundProfileData.HFPCategories.push({
          // id: x.id,
          id: x.id === "" ? defaultIdValue : x.id,

          categoryId: x.categoryId,
          isPermissioned: x.isPermissioned,

          isActive: true,
        });
      }
    });

    data.HedgeFundProfileStats.forEach((x) => {
      if (x.isModified && x.isPermissioned !== -1) {
        hedgeFundProfileData.HFPStats.push({
          id: x.id === "" ? defaultIdValue : x.id,
          // id: x.id,
          statId: x.statId,
          isPermissioned: x.isPermissioned === 1 ? true : false,

          isActive: true,
        });
      }
    });
    console.log("Hedge Fund Profile Data", hedgeFundProfileData);
    console.log("Hedge Fund Profile", filteredStats);

    try {
      await agent.HFProfile.modify(id, hedgeFundProfileData);
      toast.info("Hedge Fund Profile Saved");
      navigate("/HFProfileList");
    } catch (error) {
      toast.error(error?.error?.error);
    }
  };

  console.log("hedgeFundProfile", hedgeFundProfile);
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
        title="Hedge Fund Profile"
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
          <Grid xs={12} md={6} item>
            <FormInputDropdown
              name="fundId"
              label="Fund"
              control={control}
              options={fundNamesList}
            />
          </Grid>
          <Grid xs={12} md={6} item>
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
                  navigate("/HFProfileList");
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

export default HedgeFundProfile;
