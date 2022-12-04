import { Box, Card, CardActions, CardContent, CardHeader } from "@mui/material";
import * as React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { theme, colors } from "../../styles/theme/Theme";
import { FieldValues, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import agent from "../../api/agent";
import { toast } from "react-toastify";
import FormInputText from "../../form-components/FormInputText";
import { ICategory } from "../../models/Category";
import FormControlSwitch from "../../form-components/FormControlSwitch";
import FormBackButton from "../../form-components/FormBackButton";
import FormSubmitButton from "../../form-components/FormSubmitButton";

const defaultValues = {
  name: "",
  description: "",
  isActive: true,
  isSecurityLevel: false,
};

const Category = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { id } = useParams();
  const isAddMode = !id;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("description is required"),
  });

  const methods = useForm<ICategory>({
    defaultValues: defaultValues,
    resolver: yupResolver(validationSchema),
    mode: "all",
  });
  const { handleSubmit, reset, control, setValue, watch, formState } = methods;

  const submitForm = async (data: ICategory) => {
    return isAddMode ? createCategory(data) : updateCategory(id, data);
  };

  const createCategory = async (data: ICategory) => {
    try {
      await agent.Category.create(data);
      toast.info("Category Saved");
      navigate("/categorylist");
    } catch (error) {
      toast.error(error?.error?.error);
    }
  };

  const updateCategory = async (id: string, data: ICategory) => {
    try {
      await agent.Category.modify(id, data);
      toast.info("Category Saved");
      navigate("/categorylist");
    } catch (error) {
      toast.error(error?.error?.error);
    }
  };

  useEffect(() => {
    if (!isAddMode) {
      agent.Category.getById(id).then((cat) => {
        const fields = ["name", "description", "isActive", "isSecurityLevel"];
        fields.forEach((field) => setValue(field, cat[field]));
      });
    }
  }, [id, isAddMode, setValue]);

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
        title="Category"
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
              name="isSecurityLevel"
              label="Security Level"
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
                  navigate("/categorylist");
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

export default Category;
