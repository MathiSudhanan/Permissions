import React, { useState } from "react";
import { Box, Card, CardActions, CardContent, CardHeader } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { theme, colors } from "../../styles/theme/Theme";
import { useNavigate, useParams } from "react-router";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { FormInputDropdown } from "../../form-components/FormInputDropdown";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import FormControlSwitch from "../../form-components/FormControlSwitch";
import { getCompanyAsync } from "../../features/Company/companySlice";
import { getUserGroupAsync } from "../../features/UserGroup/userGroupSlice";
// import { getUsersByUserGroupIdAsync } from "../../features/UserGroupMapping/userGroupMappingSlice";
import { getUsersAsync } from "../../features/User/userSlice";

import agent from "../../api/agent";
import { toast } from "react-toastify";
import FormSubmitButton from "../../form-components/FormSubmitButton";
import FormBackButton from "../../form-components/FormBackButton";
import { useForm } from "react-hook-form";
import { IUserGroupMapping } from "../../models/UserGroupMapping";
import { IUser } from "../../models/User";

import FormInputText from "../../form-components/FormInputText";
import { getUserGroupsByCompanyIdAsync } from "../../features/CompanyUserGroup/companyUserGroupSlice";

const defaultValues = {
  userId: "",
  userGroupId: "",
  isActive: true,
};

const UserGroupMapping = () => {
  const validationSchema = Yup.object().shape({
    userId: Yup.string().required("User is required"),
    userGroupId: Yup.string().required("User Group is required"),
  });
  const methods = useForm<IUserGroupMapping>({
    defaultValues: defaultValues,
    resolver: yupResolver(validationSchema),
    mode: "all",
  });
  const { handleSubmit, /*reset, watch, */ control, setValue, formState } =
    methods;

  const { id, companyId } = useParams();
  const isAddMode = !id;

  const [selCompanyId, setCompanyId] = useState("");
  const [userGroupId, setUserGroupId] = useState("");
  const [userId, setUserId] = useState("");

  const onSubmit = (data: IUserGroupMapping) => {
    return isAddMode
      ? createUserGroupMappingAsync(data)
      : updateUserGroupMappingAsync(id, data);
  };

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { companyNamesList } = useAppSelector((state) => state.company);

  const { userGroupNamesList } = useAppSelector((state) => state.userGroup);
  const { userNameList } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(getCompanyAsync());
    dispatch(getUserGroupAsync());
    dispatch(getUsersAsync());
    if (companyId) {
      // dispatch(getUserGroupsByCompanyIdAsync({ companyId: selCompanyId }));
      setCompanyId(companyId);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!isAddMode) {
      // if (companyId) {
      //   setValue("companyId", companyId);
      // }
      agent.UserGroupMapping.getById(id).then((cf) => {
        cf.companyId = companyId;

        const fields = [
          "name",
          "description",
          "companyId",
          "userGroupId",
          "userId",
          "isActive",
        ];
        fields.forEach((field) => setValue(field, cf[field]));
      });
    }
  }, [isAddMode, setValue, id]);

  useEffect(() => {
    if (selCompanyId) {
      dispatch(getUserGroupsByCompanyIdAsync({ companyId: selCompanyId }));
    }
  }, [selCompanyId]);

  // useEffect(() => {
  //   if (userGroupId) {
  //     dispatch(getUsersByUserGroupIdAsync({ userGroupId }));
  //   }
  // }, [userGroupId]);

  const createUserGroupMappingAsync = async (data: IUserGroupMapping) => {
    try {
      await agent.UserGroupMapping.create(data);
      toast.info("Company User Group Saved");
      navigate("/companyUserGroupList");
    } catch (error) {
      toast.error(error?.error?.error);
    }
  };
  const updateUserGroupMappingAsync = async (
    id: string,
    data: IUserGroupMapping
  ) => {
    try {
      await agent.UserGroupMapping.modify(id, data);
      toast.info("Company User Group Saved");
      navigate("/companyUserGroupList");
    } catch (error) {
      toast.error(error?.error?.error);
    }
  };

  return (
    <Card
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{
        mt: "2%",
        borderRadius: "20px",
        [theme.breakpoints.up("md")]: { mt: "5%", ml: "25%", mr: "25%" },
        [theme.breakpoints.down("md")]: { m: "5%" },
      }}
    >
      <CardHeader
        title="User Group Mapping"
        sx={{
          backgroundColor: colors.gray,
        }}
        titleTypographyProps={{
          color: colors.blackPrimary,
          textAlign: "center",
          fontWeight: 400,
          fontSize: "3em",
          fontFamily: '"montez","cursive"',
        }}
      ></CardHeader>
      <CardContent>
        <Grid container spacing={3}>
          <Grid xs={12}>
            <FormInputDropdown
              name="companyId"
              label="Company"
              control={control}
              options={companyNamesList}
              onHandleChange={(e) => {
                setCompanyId(e.target.value);
              }}
            />
          </Grid>
          <Grid xs={12}>
            <FormInputDropdown
              name="userGroupId"
              label="User Group"
              control={control}
              options={userGroupNamesList}
              onHandleChange={(e) => {
                setUserGroupId(e.target.value);
              }}
            />
          </Grid>
          <Grid xs={12}>
            <FormInputDropdown
              name="userId"
              label="User"
              control={control}
              options={userNameList}
              // onHandleChange={(e)=>{
              //   setCompanyId(e.target.value)
              // }}
            />
          </Grid>
          <Grid xs={12}>
            <FormControlSwitch
              name="isActive"
              label="Active"
              control={control}
            />
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
                  navigate("/UserGroupMappingList");
                  e.preventDefault();
                  e.stopPropagation();
                }}
              />
            </Grid>
            <Grid xs={6}>
              <FormSubmitButton
                isSubmitting={formState.isSubmitting}
                isValid={formState.isValid}
              />
            </Grid>
          </Grid>
        </Box>
      </CardActions>
    </Card>
  );
};

export default UserGroupMapping;
