import { Box, Card, CardActions, CardContent, CardHeader } from "@mui/material";
import * as React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { theme, colors } from "../../styles/theme/Theme";
import { useNavigate, useParams } from "react-router";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import agent from "../../api/agent";
import { toast } from "react-toastify";
import dayjs, { Dayjs } from "dayjs";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { getCompanyAsync } from "../../features/Company/companySlice";
import { getFundsAsync } from "../../features/Fund/fundSlice";
import { IClientFund } from "../../models/ClientFund";
import FormControlSwitch from "../../form-components/FormControlSwitch";
import { FormInputDropdown } from "../../form-components/FormInputDropdown";
import FormBackButton from "../../form-components/FormBackButton";
import FormSubmitButton from "../../form-components/FormSubmitButton";
import FormInputText from "../../form-components/FormInputText";
import FormDatePicker from "../../form-components/FormDatePicker";

const defaultValues = {
  name: "",
  description: "",
  isActive: true,
  isSecurityLevel: false,
  startDate: dayjs(),
  endDate: null,
  fundId: "",
  companyId: "",
};

const ClientFund = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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

  const methods = useForm<IClientFund>({
    defaultValues: defaultValues,
    resolver: yupResolver(validationSchema),
    mode: "all",
  });
  const { handleSubmit, reset, control, setValue, watch, formState } = methods;

  const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = React.useState<Dayjs | null>(null);
  const { companyNamesList } = useAppSelector((state) => state.company);
  const { fundNamesList } = useAppSelector((state) => state.fund);

  useEffect(() => {
    dispatch(getCompanyAsync());
    dispatch(getFundsAsync());
  }, [dispatch]);

  useEffect(() => {
    if (!isAddMode) {
      agent.ClientFund.getById(id).then((cf) => {
        const fields = [
          "name",
          "description",
          "startDate",
          "endDate",
          "fundId",
          "companyId",

          "isActive",
          "isSecurityLevel",
        ];
        fields.forEach((field) => setValue(field, cf[field]));
      });
    }
  }, []);

  const submitForm = async (data: IClientFund) => {
    return isAddMode
      ? createClientFundAsync(data)
      : updateClientFundAsync(id, data);
  };

  const createClientFundAsync = async (data: IClientFund) => {
    try {
      console.log(data);
      await agent.ClientFund.create(data);
      toast.info("Client Fund Saved");
      navigate("/clientfundList");
    } catch (error) {
      toast.error(error?.error?.error);
    }
  };
  const updateClientFundAsync = async (id: string, data: IClientFund) => {
    try {
      await agent.ClientFund.modify(id, data);
      toast.info("Client Fund Saved");
      navigate("/clientfundList");
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
        [theme.breakpoints.up("md")]: { mt: "5%", ml: "25%", mr: "25%" },
        [theme.breakpoints.down("md")]: { m: "5%" },
      }}
    >
      <CardHeader
        title="Client Fund"
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
              name="fundId"
              label="Fund"
              control={control}
              options={fundNamesList}
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
          <Grid xs={12} md={6}>
            <FormDatePicker
              name="startDate"
              label="Start Date"
              control={control}
              defaultValue={startDate}
            />
          </Grid>
          <Grid
            xs={12}
            md={6}
            // sx={{ display: "flex", justifyContent: "right" }}
          >
            <FormDatePicker name="endDate" label="End Date" control={control} />
          </Grid>
          <Grid xs={12} md={6}>
            <FormControlSwitch
              name="isSecurityLevel"
              label="Security Level"
              control={control}
            />
          </Grid>
          <Grid xs={12} md={6}>
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
                  navigate("/ClientFundList");
                  e.preventDefault();
                  e.stopPropagation();
                }}
              ></FormBackButton>
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

export default ClientFund;
