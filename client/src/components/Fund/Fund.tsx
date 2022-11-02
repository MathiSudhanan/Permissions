import { Box, Card, CardActions, CardContent, CardHeader } from "@mui/material";
import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import Grid from "@mui/material/Unstable_Grid2";
import { theme, colors } from "../../styles/theme/Theme";
import { useNavigate, useParams } from "react-router";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import agent from "../../api/agent";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { IFund } from "../../models/Fund";
import FormInputText from "../../form-components/FormInputText";
import FormDatePicker from "../../form-components/FormDatePicker";
import FormControlSwitch from "../../form-components/FormControlSwitch";
import FormBackButton from "../../form-components/FormBackButton";
import FormSubmitButton from "../../form-components/FormSubmitButton";

const defaultValues = {
  name: "",
  description: "",
  isActive: true,
  isSecurityLevel: false,
  startDate: dayjs(),
  endDate: null,
  isFOF: false,
};

const Fund = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = React.useState<Dayjs | null>(null);

  const { id } = useParams();
  const isAddMode = !id;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("description is required"),
    startDate: Yup.date()
      .required("Start date is required.")
      .when("endDate", (endDate) => {
        if (endDate) {
          return Yup.date()
            .min(startDate, "End Date must be after Start Date")
            .typeError("End Date is required");
        }
      }),

    endDate: Yup.date().optional().nullable(),
  });

  const methods = useForm<IFund>({
    defaultValues: defaultValues,
    resolver: yupResolver(validationSchema),
    mode: "all",
  });
  const { handleSubmit, reset, control, setValue, watch, formState } = methods;

  const submitForm = async (data: IFund) => {
    return isAddMode ? createFundAsync(data) : updateFundAsync(id, data);
  };

  const createFundAsync = async (data: IFund) => {
    try {
      await agent.Fund.create(data);
      toast.info("Fund Saved");
      navigate("/FundList");
    } catch (error) {
      toast.error(error?.error?.error);
    }
  };
  const updateFundAsync = async (id: string, data: IFund) => {
    try {
      await agent.Fund.modify(id, data);
      toast.info("Fund Modified");
      navigate("/FundList");
    } catch (error) {
      toast.error(error?.error?.error);
    }
  };

  useEffect(() => {
    if (!isAddMode) {
      agent.Fund.getById(id).then((fund) => {
        const fields = [
          "name",
          "description",
          "startDate",
          "endDate",
          "isActive",
          "isSecurityLevel",
          "isFOF",
        ];
        fields.forEach((field) => setValue(field, fund[field]));
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
        title="Fund"
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
            <FormDatePicker
              name="startDate"
              label="Start Date"
              control={control}
              defaultValue={startDate}
            />
          </Grid>
          <Grid xs={12}>
            <FormDatePicker name="endDate" label="End Date" control={control} />
          </Grid>
          <Grid xs={12}>
            <FormControlSwitch
              name="isFOF"
              label="Fund of Fund"
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
                  navigate("/FundList");
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

export default Fund;
