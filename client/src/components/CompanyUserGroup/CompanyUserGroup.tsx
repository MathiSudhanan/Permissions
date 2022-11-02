import React from "react";
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
import agent from "../../api/agent";
import { toast } from "react-toastify";
import FormSubmitButton from "../../form-components/FormSubmitButton";
import FormBackButton from "../../form-components/FormBackButton";
import { useForm } from "react-hook-form";
import { ICompanyUserGroup } from "../../models/CompanyUserGroup";
import FormInputText from "../../form-components/FormInputText";

const defaultValues = {
  name: "",
  description: "",
  companyId: "",
  userGroupId: "",
  isActive: true,
};

const CompanyUserGroup = () => {
  const validationSchema = Yup.object().shape({
    companyId: Yup.string().required("Company is required"),
    userGroupId: Yup.string().required("User Group is required"),
  });
  const methods = useForm<ICompanyUserGroup>({
    defaultValues: defaultValues,
    resolver: yupResolver(validationSchema),
    mode: "all",
  });
  const { handleSubmit, /*reset, watch, */ control, setValue, formState } =
    methods;

  const { id } = useParams();
  const isAddMode = !id;

  const onSubmit = (data: ICompanyUserGroup) => {
    return isAddMode
      ? createCompanyUserGroupAsync(data)
      : updateCompanyUserGroupAsync(id, data);
  };

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { companyNamesList } = useAppSelector((state) => state.company);
  const { userGroupNamesList } = useAppSelector((state) => state.userGroup);

  useEffect(() => {
    dispatch(getCompanyAsync());
    dispatch(getUserGroupAsync());
  }, [dispatch]);

  useEffect(() => {
    if (!isAddMode) {
      agent.CompanyUserGroup.getById(id).then((cf) => {
        console.log("CUG", cf);
        const fields = [
          "name",
          "description",
          "userGroupId",
          "companyId",
          "isActive",
        ];
        fields.forEach((field) => setValue(field, cf[field]));
      });
    }
  }, [isAddMode, setValue, id]);

  const createCompanyUserGroupAsync = async (data: ICompanyUserGroup) => {
    try {
      await agent.CompanyUserGroup.create(data);
      toast.info("Company User Group Saved");
      navigate("/companyUserGroupList");
    } catch (error) {
      toast.error(error?.error?.error);
    }
  };
  const updateCompanyUserGroupAsync = async (
    id: string,
    data: ICompanyUserGroup
  ) => {
    try {
      await agent.CompanyUserGroup.modify(id, data);
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
        title="Company User Group"
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
            <FormInputText name="name" label="Name" control={control} />
          </Grid>
          <Grid xs={12}>
            <FormInputText
              name="description"
              label="Description"
              control={control}
            />
          </Grid>
          <Grid xs={12}>
            <FormInputDropdown
              name="companyId"
              label="Company"
              control={control}
              options={companyNamesList}
            />
          </Grid>
          <Grid xs={12}>
            <FormInputDropdown
              name="userGroupId"
              label="User Group"
              control={control}
              options={userGroupNamesList}
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
                  navigate("/companyUserGroupList");
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

export default CompanyUserGroup;
