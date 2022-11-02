import { Box, Card, CardActions, CardContent, CardHeader } from "@mui/material";
import * as React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { theme, colors } from "../../styles/theme/Theme";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import agent from "../../api/agent";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useEffect } from "react";
import { ICompany } from "../../models/Company";
import FormInputText from "../../form-components/FormInputText";
import FormControlSwitch from "../../form-components/FormControlSwitch";
import FormBackButton from "../../form-components/FormBackButton";
import FormSubmitButton from "../../form-components/FormSubmitButton";

const defaultValues = {
  name: "",
  description: "",
  isActive: true,
};

const Company = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isAddMode = !id;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("description is required"),
  });

  const methods = useForm<ICompany>({
    defaultValues: defaultValues,
    resolver: yupResolver(validationSchema),
    mode: "all",
  });
  const { handleSubmit, reset, control, setValue, watch, formState } = methods;

  const submitForm = async (data: ICompany) => {
    return isAddMode ? createCompany(data) : updateCompany(id, data);
  };

  const createCompany = async (data: ICompany) => {
    try {
      await agent.Company.create(data);
      toast.info("Company Saved");
      navigate("/companyList");
    } catch (error) {
      toast.error(error?.error?.error);
    }
  };

  const updateCompany = async (id: string, data: ICompany) => {
    try {
      await agent.Company.modify(id, data);
      toast.info("Company Modified");
      navigate("/companyList");
    } catch (error) {
      toast.error(error?.error?.error);
    }
  };

  useEffect(() => {
    if (!isAddMode) {
      agent.Company.getById(id).then((comp) => {
        const fields = ["name", "description", "isActive"];

        fields.forEach((field) => {
          setValue(field, comp[field]);
        });
      });
    }
  }, []);

  return (
    <Card
      component="form"
      onSubmit={handleSubmit(submitForm)}
      noValidate
      sx={{
        mt: "2%",
        borderRadius: "20px",
        [theme.breakpoints.up("md")]: { mt: "5%", ml: "25%", mr: "25%" },
        [theme.breakpoints.down("md")]: { m: "5%" },
      }}
    >
      <CardHeader
        title="Company"
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
                  navigate("/companyList");
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

export default Company;
