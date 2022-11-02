import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import * as React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { theme, colors } from "../../styles/theme/Theme";
import { LoadingButton } from "@mui/lab";
import { useNavigate, useParams } from "react-router";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FieldValues, useForm } from "react-hook-form";
import agent from "../../api/agent";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { IStat } from "../../models/Stat";
import FormInputText from "../../form-components/FormInputText";
import FormControlSwitch from "../../form-components/FormControlSwitch";
import FormBackButton from "../../form-components/FormBackButton";
import FormSubmitButton from "../../form-components/FormSubmitButton";

const defaultValues = {
  name: "",
  description: "",
  isActive: true,
  isSecurityLevel: false,
};

const Stat = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isAddMode = !id;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("description is required"),
  });

  const methods = useForm<IStat>({
    defaultValues: defaultValues,
    resolver: yupResolver(validationSchema),
    mode: "all",
  });
  const { handleSubmit, reset, control, setValue, watch, formState } = methods;

  const submitForm = async (data: IStat) => {
    return isAddMode ? createStatAsync(data) : updateStatAsync(id, data);
  };

  const createStatAsync = async (data: IStat) => {
    try {
      await agent.Stat.create(data);
      toast.info("Stat Saved");
      navigate("/statList");
    } catch (error) {
      toast.error(error?.error?.error);
    }
  };

  const updateStatAsync = async (id: string, data: IStat) => {
    try {
      await agent.Stat.modify(id, data);
      toast.info("Stat Saved");
      navigate("/statList");
    } catch (error) {
      toast.error(error?.error?.error);
    }
  };

  useEffect(() => {
    if (!isAddMode) {
      agent.Stat.getById(id).then((stat) => {
        const fields = ["name", "description", "isActive", "isSecurityLevel"];
        fields.forEach((field) => setValue(field, stat[field]));
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
        title="Stat"
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
                  navigate("/statlist");
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

export default Stat;
