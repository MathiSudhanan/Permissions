import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { colors, theme } from "../../styles/theme/Theme";
import "@fontsource/montez";
import { useNavigate } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch } from "../../store/configureStore";
import { signInUser } from "../../features/Account/accountSlice";
import { toast } from "react-toastify";
import LockOpenIcon from "@mui/icons-material/LockOpen";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
  } = useForm({ mode: "all" });

  const submitForm = async (data: FieldValues) => {
    try {
      await dispatch(signInUser(data));
      navigate("/");
    } catch (error) {
      toast.error(error?.error?.error);
    }
  };

  return (
    <Container sx={{ border: "2px", borderBlockColor: "#000" }}>
      <Card
        sx={{
          [theme.breakpoints.up("md")]: { m: "25%" },
          [theme.breakpoints.down("md")]: { mt: "35%" },
          borderRadius: "20px",
          // boxshadow: "2px 2px 2px 1px rgba(0, 0, 0, 0.2)",
          // backgroundColor: colors.white,
          //   boxShadow:
          //     "inset 0 -3em 3em rgba(0,0,0,0.1), 0 0  0 2px rgb(255,255,255), 0.3em 0.3em 1em rgba(0,0,0,0.3);",
        }}
      >
        <CardHeader
          sx={{
            backgroundColor: colors.blue,
            color: colors.white,
            textAlign: "center",
          }}
          title="Sign in"
          titleTypographyProps={{
            fontFamily: '"montez","cursive"',
            fontSize: "2em",
          }}
          avatar={<LockOpenIcon />}
        >
          <LockOpenIcon />
        </CardHeader>

        <CardContent
          component="form"
          onSubmit={handleSubmit(submitForm)}
          noValidate
        >
          {/* <TextField
            id="email"
            label="Email"
            variant="standard"
            sx={{ width: "100%" }}
            onChange={(e) => setEmail(e.target.value)}
          /> */}

          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            variant="standard"
            autoFocus
            {...register("email")}
            // error={!!errors.email}
            // helperText={errors?.email?.message.toString()}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            variant="standard"
            type="password"
            {...register("password")}
            // error={!!errors.password}
            // helperText={errors?.password?.message.toString()}
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
                Sign In
              </LoadingButton>
              <Box
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
              </Box>
              <Box
                sx={{
                  width: "100%",
                  justifyContent: "right",
                  alignItems: "right",
                  display: "flex",
                }}
              >
                <Typography sx={{ mt: "1em", color: colors.brown }}>
                  Forgot UserName or Password?
                  <Link href="/forgotPassword" sx={{ paddingLeft: "1em" }}>
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

export default Login;
