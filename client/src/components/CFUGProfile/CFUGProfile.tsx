import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import FormSubmitButton from "../../form-components/FormSubmitButton";
import FormBackButton from "../../form-components/FormBackButton";
import FormInputText from "../../form-components/FormInputText";
import FormControlSwitch from "../../form-components/FormControlSwitch";
import FormTabPanelList from "../../form-components/FormTabPanelList";
import { FormInputDropdown } from "../../form-components/FormInputDropdown";

import { sortCategoryArray, sortStatArray } from "../../Utils/arrayUtils";

import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  CardActions,
  Box,
} from "@mui/material";
import { colors, theme } from "../../styles/theme/Theme";
import agent from "../../api/agent";
import { toast } from "react-toastify";
import { ICFUGProfileStat } from "../../models/CFUGProfileStat";
import { ICFUGProfileCategory } from "../../models/CFUGProfileCategory";
import { ICFUGProfile } from "../../models/CFUGProfile";
import { getClientFundsAsync } from "../../features/ClientFund/clientFundSlice";
import {
  getCFUGProfileByIdAsync,
  getNewCFUGAndOtherProfilesAsync,
} from "../../features/CFUGProfile/CFUGProfileSlice";
import CategoryPermissions from "../Category/CategoryPermissions";
import StatPermissions from "../Stat/StatPermissions";
import {
  getCompanyUserGroupAsync,
  getUserGroupsByCompanyIdAsync,
} from "../../features/CompanyUserGroup/companyUserGroupSlice";
import { getCompanyAsync } from "../../features/Company/companySlice";
import { getClientFundsByCompanyIdAsync } from "../../features/ClientFund/clientFundSlice";

const defaultValues = {
  name: "",
  description: "",
  isActive: true,
  companyId: "",
  clientFundId: "",
  userGroupId: "",
  CFUGProfileCategories: [],
  CFUGProfileStats: [],
};

const CFUGProfile = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const defaultIdValue = "111111111111111111111111";

  const { id } = useParams();
  const isAddMode = !id;

  const { cfugProfile } = useAppSelector((state) => state.cfugProfile);

  const { clientFundNamesList } = useAppSelector((state) => state.clientFund);
  const { companyNamesList, companyList } = useAppSelector(
    (state) => state.company
  );
  const { companyUserGroupNamesList, companyUserGroupList } = useAppSelector(
    (state) => state.companyUserGroup
  );

  const [companyId, setCompanyId] = useState("");
  const [userGroupId, setUserGroupId] = useState("");
  const [clientFundId, setClientFundId] = useState("");

  const [filteredStats, setFilteredStats] = useState<ICFUGProfileStat[]>([]);
  const [permissionedStats, setPermissionedStats] = useState<
    ICFUGProfileStat[]
  >([]);
  const [notSetCategoriesList, setNotSetCategoriesList] = useState<
    ICFUGProfileCategory[]
  >([]);
  const [permissionedCategoriesList, setPermissionedCategoriesList] = useState<
    ICFUGProfileCategory[]
  >([]);
  const [nonPermissionedCategoriesList, setNonPermissionedCategoriesList] =
    useState<ICFUGProfileCategory[]>([]);

  const [tabData, setTabData] = useState<any>([]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    // description: Yup.string().required("description is required"),
  });

  const methods = useForm<ICFUGProfile>({
    defaultValues: defaultValues,
    resolver: yupResolver(validationSchema),
    mode: "all",
  });
  const { handleSubmit, /*reset, watch,*/ control, setValue, formState } =
    methods;

  useEffect(() => {
    dispatch(getClientFundsAsync());
    dispatch(getCompanyUserGroupAsync());
    dispatch(getCompanyAsync());

    if (!isAddMode) {
      dispatch(getCFUGProfileByIdAsync({ id }));
    }
  }, [id, isAddMode, dispatch]);

  useEffect(() => {
    if (cfugProfile) {
      if (!isAddMode) {
        const fields = [
          "name",
          "description",
          "isActive",
          "companyId",
          "clientFundId",
          "userGroupId",
        ];
        fields.forEach((field) => setValue(field, cfugProfile[field]));
      }

      if (cfugProfile.CFUGProfileStats.length) {
        let pStatList = sortStatArray([...cfugProfile.CFUGProfileStats]);
        setPermissionedStats(sortStatArray(pStatList));
        setFilteredStats(sortStatArray(pStatList));
      }

      let nsCategoryList = cfugProfile.CFUGProfileCategories.filter((x) => {
        return x.isPermissioned === null;
      });
      if (nsCategoryList.length) {
        setNotSetCategoriesList(sortCategoryArray(nsCategoryList));
      }

      let pCategoryList = cfugProfile.CFUGProfileCategories.filter((x) => {
        return x.isPermissioned;
      });
      if (pCategoryList.length) {
        setPermissionedCategoriesList(sortCategoryArray(pCategoryList));
      }

      let npCategoryList = cfugProfile.CFUGProfileCategories.filter((x) => {
        return x.isPermissioned === false;
      });
      if (npCategoryList) {
        setNonPermissionedCategoriesList(sortCategoryArray(npCategoryList));
      }
    }
  }, [cfugProfile, isAddMode, setValue]);

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
          Categories: cfugProfile?.CFUGProfileCategories,
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
          Stats: cfugProfile?.CFUGProfileStats,
          nsStats: cfugProfile?.CFUGProfileStats,
          filteredStats: filteredStats,
          setFilteredStats: setFilteredStats,
        },

        component: StatPermissions,
      },
    ]);
  }, [
    cfugProfile?.CFUGProfileCategories,
    cfugProfile?.CFUGProfileStats,
    filteredStats,
    moveItem,
    nonPermissionedCategoriesList,
    notSetCategoriesList,
    permissionedCategoriesList,
  ]);

  useEffect(() => {
    if (companyId) {
      console.log(companyId);
      dispatch(getUserGroupsByCompanyIdAsync({ companyId }));
      dispatch(getClientFundsByCompanyIdAsync({ companyId }));
    }
  }, [companyId]);

  useEffect(() => {
    if (clientFundId && userGroupId) {
      dispatch(getNewCFUGAndOtherProfilesAsync({ clientFundId, userGroupId }));
    }
  }, [clientFundId, userGroupId]);

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

  const submitForm = async (data: ICFUGProfile) => {
    data.CFUGProfileCategories = [
      ...permissionedCategoriesList,
      ...nonPermissionedCategoriesList,
    ];

    data.CFUGProfileStats = [
      ...filteredStats.filter((x) => x.isModified && x.isPermissioned !== null),
    ];
    console.log("Submit Data", data);

    return isAddMode
      ? createHedgeFundProfileAsync(data)
      : updateHedgeFundProfileAsync(id, data);
  };

  const createHedgeFundProfileAsync = async (data: ICFUGProfile) => {
    try {
      const cfugProfileData = { ...data };
      console.log("Create", data);
      cfugProfileData.CFUGPCategories = [];
      cfugProfileData.CFUGPStats = [];

      data.CFUGProfileCategories.forEach((x) =>
        cfugProfileData.CFUGPCategories.push({
          id: "",
          categoryId: x.categoryId,
          isPermissioned: x.isPermissioned,
          isActive: true,
          isModified: true,
        })
      );

      data.CFUGProfileStats.forEach((x) =>
        cfugProfileData.CFUGPStats.push({
          id: "",
          statId: x.statId,
          isPermissioned: x.isPermissioned === 1 ? true : false,

          isActive: true,
          isModified: true,
        })
      );
      delete cfugProfileData["CFUGProfileStats"];
      delete cfugProfileData["CFUGProfileCategories"];

      console.log("success:", cfugProfileData);
      await agent.CFUGProfile.create(cfugProfileData);
      toast.info("Client Fund User Group Profile Saved");
      navigate("/CFUGProfileList");
    } catch (error) {
      toast.error(error?.error?.error);
    }
  };

  const updateHedgeFundProfileAsync = async (id: string, data: FieldValues) => {
    const cfugProfileData = { ...data };
    cfugProfileData.CFUGPCategories = [];
    cfugProfileData.CFUGPStats = [];

    data.CFUGProfileCategories.forEach((x) => {
      if (x.isModified) {
        cfugProfileData.CFUGPCategories.push({
          // id: x.id,
          id: x.id === "" ? defaultIdValue : x.id,

          categoryId: x.categoryId,
          isPermissioned: x.isPermissioned,

          isActive: true,
        });
      }
    });

    data.CFUGProfileStats.forEach((x) => {
      if (x.isModified && x.isPermissioned !== -1) {
        cfugProfileData.CFUGPStats.push({
          id: x.id === "" ? defaultIdValue : x.id,
          // id: x.id,
          statId: x.statId,
          isPermissioned: x.isPermissioned === 1 ? true : false,

          isActive: true,
        });
      }
    });
    console.log("Client Fund User Group Profile Data", cfugProfileData);
    console.log("Client Fund User Group Profile", filteredStats);

    try {
      await agent.CFUGProfile.modify(id, cfugProfileData);
      toast.info("Client Fund User Group Profile Saved");
      navigate("/CFUGProfileList");
    } catch (error) {
      toast.error(error?.error?.error);
    }
  };

  console.log("cfugProfile", cfugProfile);

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
        title="Client Fund User Group Profile"
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
              name="companyId"
              label="Company"
              control={control}
              options={companyNamesList}
              onHandleChange={(event: any) => {
                if (event) {
                  setCompanyId(event?.target.value);
                }
              }}
            />
          </Grid>{" "}
          <Grid xs={12} md={6} item>
            <FormInputDropdown
              name="userGroupId"
              label="UserGroup"
              control={control}
              options={companyUserGroupNamesList}
              onHandleChange={(event: any) => {
                if (event) {
                  setUserGroupId(event?.target.value);
                }
              }}
            />
          </Grid>
          <Grid xs={12} md={6} item>
            <FormInputDropdown
              name="clientFundId"
              label="Client Fund"
              control={control}
              options={clientFundNamesList}
              onHandleChange={(event: any) => {
                if (event) {
                  setClientFundId(event?.target.value);
                }
              }}
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
                  navigate("/CFUGProfileList");
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

export default CFUGProfile;
