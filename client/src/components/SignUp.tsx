import {
  Container,
  Card,
  CardHeader,
  CardContent,
  TextField,
  CardActions,
  Box,
  Typography,
  Link,
  FormControlLabel,
  Switch,
} from "@mui/material";
import React from "react";
import "@fontsource/montez";

import { theme, colors } from "../styles/theme/Theme";
import { useNavigate } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import agent from "../api/agent";

const SignUp = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
    watch,
  } = useForm({ mode: "all" });

  const submitForm = async (data: FieldValues) => {
    try {
      const user = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        isActive: data.isActive,
      };
      await agent.Account.register(user);
      navigate("/login");
    } catch (error) {
      toast.error(error?.error?.error);
    }
  };
  return (
    <Container sx={{ border: "2px", borderBlockColor: "#000" }}>
      <Card
        sx={{
          [theme.breakpoints.up("md")]: { mt: "5%", ml: "25%", mr: "25%" },
          [theme.breakpoints.down("md")]: { m: "5%" },
          borderRadius: "20px",
          // boxshadow: "2px 2px 2px 1px rgba(0, 0, 0, 0.2)",
          backgroundColor: colors.white,
          boxShadow:
            "inset 0 -3em 3em rgba(0,0,0,0.1), 0 0  0 2px rgb(255,255,255), 0.3em 0.3em 1em rgba(0,0,0,0.3);",
        }}
      >
        <CardHeader
          sx={{
            backgroundColor: colors.blue,
            color: colors.white,
            textAlign: "center",
          }}
          title="Sign Up"
          titleTypographyProps={{
            fontFamily: '"montez","cursive"',
            fontSize: "2em",
          }}
          // avatar={<LockOpenIcon />}
        ></CardHeader>

        <CardContent
          component="form"
          onSubmit={handleSubmit(submitForm)}
          noValidate
        >
          <TextField
            margin="normal"
            required
            fullWidth
            label="Firstname"
            variant="standard"
            autoFocus
            {...register("firstName", { required: "Firstname is required" })}
            error={!!errors.firstName}
            helperText={errors?.firstName?.message.toString()}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Lastname"
            variant="standard"
            {...register("lastName", { required: "Lastname is required" })}
            error={!!errors.lastName}
            helperText={errors?.lastName?.message.toString()}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            variant="standard"
            {...register("email", { required: "Email is required" })}
            error={!!errors.email}
            helperText={errors?.email?.message.toString()}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            variant="standard"
            type="password"
            {...register("password", { required: "Password is required" })}
            error={!!errors.password}
            helperText={errors?.password?.message.toString()}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Confirm Password"
            variant="standard"
            type="password"
            {...register("confirmPassword", {
              required: "Confirm Password is required",
              validate: (val: string) => {
                if (watch("password") !== val) {
                  return "Your passwords do not match";
                }
              },
            })}
            error={!!errors.confirmPassword}
            helperText={errors?.confirmPassword?.message?.toString()}
          />

          <FormControlLabel
            // value="isActive"
            control={
              <Switch
                color="primary"
                {...register("isActive")}
                defaultChecked={true}
              />
            }
            label="Active"
            labelPlacement="start"
            sx={{
              mt: "1.5em",
              ml: "1%",
              color: colors.brown,
            }}
          />

          <CardActions
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
              mt: "2em",
            }}
          >
            <Box sx={{ width: "100%" }}>
              {/* <Button
                variant="contained"
                sx={{ width: "100%", borderRadius: "20px", fontSize: "1em" }}
                onClick={handleOnClick}
              >
                Sign in
              </Button> */}
              <LoadingButton
                loading={isSubmitting}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, borderRadius: "20px", fontSize: "1em" }}
                disabled={!isValid}
              >
                Register
              </LoadingButton>
              {/* <Box
                sx={{
                  width: "100%",
                  justifyContent: "right",
                  alignItems: "right",
                  display: "flex",
                }}
              >
                <Typography sx={{ mt: "1em", color: colors.brown }}>
                  Not a member?
                  <Link href="/signup" sx={{ paddingLeft: "1em" }}>
                    Sign Up
                  </Link>
                </Typography>
              </Box> */}
              <Box
                sx={{
                  width: "100%",
                  justifyContent: "right",
                  alignItems: "right",
                  display: "flex",
                }}
              >
                <Typography sx={{ mt: "1em", color: colors.brown }}>
                  User already exists?
                  <Link href="/login" sx={{ paddingLeft: "1em" }}>
                    click here
                  </Link>
                </Typography>
              </Box>
            </Box>
          </CardActions>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SignUp;
