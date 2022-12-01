import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FieldValues, useForm } from "react-hook-form";
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
import { ICFUProfileStat } from "../../models/CFUProfileStat";
import { ICFUProfileCategory } from "../../models/CFUProfileCategory";
import { ICFUProfile } from "../../models/CFUProfile";
import {
  getCFUProfileByIdAsync,
  getNewCFUAndOtherProfilesAsync,
} from "../../features/CFUProfile/CFUProfileSlice";
import CategoryPermissions from "../Category/CategoryPermissions";
import StatPermissions from "../Stat/StatPermissions";
import { getUserGroupsByCompanyIdAsync } from "../../features/CompanyUserGroup/companyUserGroupSlice";
import { getUsersByUserGroupIdAsync } from "../../features/User/userSlice";
import { getCompanyAsync } from "../../features/Company/companySlice";
import { getClientFundsByCompanyIdAsync } from "../../features/ClientFund/clientFundSlice";

const defaultValues = {
  name: "",
  description: "",
  isActive: true,
  companyId: "",
  clientFundId: "",
  userGroupId: "",
  userId: "",
  CFUProfileCategories: [],
  CFUProfileStats: [],
  userNamesList: [],
  companyNamesList: [],
  companyUserGroupNamesList: [],
};

const CFUProfile = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const defaultIdValue = "111111111111111111111111";

  const { id } = useParams();
  const isAddMode = !id;

  const { cfuProfile } = useAppSelector((state) => state.cfuProfile);

  const { clientFundNamesList } = useAppSelector((state) => state.clientFund);
  const { companyNamesList, companyList } = useAppSelector(
    (state) => state.company
  );
  const { companyUserGroupNamesList, companyUserGroupList } = useAppSelector(
    (state) => state.companyUserGroup
  );
  const { userNameList } = useAppSelector((state) => state.user);

  //   const [userList, setUserList] = useState<ISelectModel[]>([]);

  const [companyId, setCompanyId] = useState("");
  const [userGroupId, setUserGroupId] = useState("");
  const [clientFundId, setClientFundId] = useState("");
  const [userId, setUserId] = useState("");

  const [filteredStats, setFilteredStats] = useState<ICFUProfileStat[]>([]);
  const [permissionedStats, setPermissionedStats] = useState<ICFUProfileStat[]>(
    []
  );
  const [notSetCategoriesList, setNotSetCategoriesList] = useState<
    ICFUProfileCategory[]
  >([]);
  const [permissionedCategoriesList, setPermissionedCategoriesList] = useState<
    ICFUProfileCategory[]
  >([]);
  const [nonPermissionedCategoriesList, setNonPermissionedCategoriesList] =
    useState<ICFUProfileCategory[]>([]);

  const [tabData, setTabData] = useState<any>([]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    // description: Yup.string().required("description is required"),
  });

  const methods = useForm<ICFUProfile>({
    defaultValues: defaultValues,
    resolver: yupResolver(validationSchema),
    mode: "all",
  });
  const { handleSubmit, /*reset, watch,*/ control, setValue, formState } =
    methods;

  useEffect(() => {
    dispatch(getCompanyAsync());

    if (!isAddMode) {
      dispatch(getCFUProfileByIdAsync({ id }));
    }
  }, [id, isAddMode, dispatch]);

  useEffect(() => {
    if (companyId && isAddMode) {
      dispatch(getClientFundsByCompanyIdAsync({ companyId }));
      dispatch(getUserGroupsByCompanyIdAsync({ companyId }));
    }
  }, [isAddMode, companyId, dispatch]);

  useEffect(() => {
    if (userGroupId && isAddMode) {
      dispatch(getUsersByUserGroupIdAsync({ userGroupId }));
    }
  }, [isAddMode, userGroupId, dispatch]);

  useEffect(() => {
    if (cfuProfile) {
      // console.log("Hi", cfuProfile);
      if (!isAddMode) {
        if (cfuProfile?.companyId) {
          dispatch(
            getUserGroupsByCompanyIdAsync({ companyId: cfuProfile?.companyId })
          );
          dispatch(
            getClientFundsByCompanyIdAsync({ companyId: cfuProfile?.companyId })
          );
        }
        if (cfuProfile?.userGroupId) {
          dispatch(
            getUsersByUserGroupIdAsync({ userGroupId: cfuProfile?.userGroupId })
          );
        }
      }
      if (cfuProfile.CFUProfileStats.length) {
        let pStatList = sortStatArray([...cfuProfile.CFUProfileStats]);
        setPermissionedStats(sortStatArray(pStatList));
        setFilteredStats(sortStatArray(pStatList));
      }

      let nsCategoryList = cfuProfile.CFUProfileCategories.filter((x) => {
        return x.isPermissioned === null;
      });
      if (nsCategoryList.length) {
        setNotSetCategoriesList(sortCategoryArray(nsCategoryList));
      }

      let pCategoryList = cfuProfile.CFUProfileCategories.filter((x) => {
        return x.isPermissioned;
      });
      if (pCategoryList.length) {
        setPermissionedCategoriesList(sortCategoryArray(pCategoryList));
      }

      let npCategoryList = cfuProfile.CFUProfileCategories.filter((x) => {
        return x.isPermissioned === false;
      });
      if (npCategoryList) {
        setNonPermissionedCategoriesList(sortCategoryArray(npCategoryList));
      }
    }
  }, [cfuProfile, dispatch, isAddMode]);

  useEffect(() => {
    console.log("Get CFUG Details ");
    if (clientFundId && userGroupId) {
      console.log("Get CFUG Details Hit");

      dispatch(getNewCFUAndOtherProfilesAsync({ clientFundId, userGroupId }));
    }
  }, [clientFundId, dispatch, userGroupId]);

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
          Categories: cfuProfile?.CFUProfileCategories,
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
          Stats: cfuProfile?.CFUProfileStats,
          nsStats: cfuProfile?.CFUProfileStats,
          filteredStats: filteredStats,
          setFilteredStats: setFilteredStats,
        },

        component: StatPermissions,
      },
    ]);
  }, [
    cfuProfile?.CFUProfileCategories,
    cfuProfile?.CFUProfileStats,
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

  const submitForm = async (data: ICFUProfile) => {
    data.CFUProfileCategories = [
      ...permissionedCategoriesList,
      ...nonPermissionedCategoriesList,
    ];

    data.CFUProfileStats = [
      ...filteredStats.filter((x) => x.isModified && x.isPermissioned !== null),
    ];
    console.log("Submit Data", data);

    return isAddMode
      ? createHedgeFundProfileAsync(data)
      : updateHedgeFundProfileAsync(id, data);
  };

  const createHedgeFundProfileAsync = async (data: ICFUProfile) => {
    try {
      const cfuProfileData = { ...data };

      cfuProfileData.CFUPCategories = [];
      cfuProfileData.CFUPStats = [];

      data.CFUProfileCategories.forEach((x) =>
        cfuProfileData.CFUPCategories.push({
          id: "",
          categoryId: x.categoryId,
          isPermissioned: x.isPermissioned,
          isActive: true,
          isModified: true,
        })
      );

      data.CFUProfileStats.forEach((x) =>
        cfuProfileData.CFUPStats.push({
          id: "",
          statId: x.statId,
          isPermissioned: x.isPermissioned === 1 ? true : false,

          isActive: true,
          isModified: true,
        })
      );
      delete cfuProfileData["CFUProfileStats"];
      delete cfuProfileData["CFUProfileCategories"];

      console.log("success:", cfuProfileData);
      await agent.CFUProfile.create(cfuProfileData);
      toast.info("Client Fund User Group Profile Saved");
      navigate("/CFUProfileList");
    } catch (error) {
      toast.error(error?.error?.error);
    }
  };

  const updateHedgeFundProfileAsync = async (id: string, data: FieldValues) => {
    const cfuProfileData = { ...data };
    cfuProfileData.CFUPCategories = [];
    cfuProfileData.CFUPStats = [];

    data.CFUProfileCategories.forEach((x) => {
      if (x.isModified) {
        cfuProfileData.CFUPCategories.push({
          // id: x.id,
          id: x.id === "" ? defaultIdValue : x.id,

          categoryId: x.categoryId,
          isPermissioned: x.isPermissioned,

          isActive: true,
        });
      }
    });

    data.CFUProfileStats.forEach((x) => {
      if (x.isModified && x.isPermissioned !== -1) {
        cfuProfileData.CFUPStats.push({
          id: x.id === "" ? defaultIdValue : x.id,
          // id: x.id,
          statId: x.statId,
          isPermissioned: x.isPermissioned === 1 ? true : false,

          isActive: true,
        });
      }
    });

    try {
      await agent.CFUProfile.modify(id, cfuProfileData);
      toast.info("Client Fund User Profile Saved");
      navigate("/CFUProfileList");
    } catch (error) {
      toast.error(error?.error?.error);
    }
  };

  useEffect(() => {
    if (cfuProfile && cfuProfile?.userId) {
      if (!isAddMode) {
        const fields = [
          "name",
          "description",
          "isActive",
          "companyId",
          "clientFundId",
          "userGroupId",
          "userId",
        ];

        fields.forEach((field) => {
          setValue(field, cfuProfile[field]);
        });
      }
    }
  }, [cfuProfile, isAddMode, setValue, userNameList.length]);

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
        title="Client Fund User Profile"
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
              label="Company User Group"
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
              name="userId"
              label="User"
              control={control}
              options={userNameList}
              onHandleChange={(event: any) => {
                if (event) {
                  setUserId(event?.target.value);
                }
              }}
            />
          </Grid>
          {/* <Grid xs={12} md={6} item>
            <FormInputDropdown
              name="userId"
              label="User"
              control={control}
              options={userNameList || []}
              onHandleChange={(event: any) => {
                if (event) {
                  setUserId(event?.target.value);
                }
              }}
            /> 
          </Grid>*/}
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
                  navigate("/CFUProfileList");
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

export default CFUProfile;
