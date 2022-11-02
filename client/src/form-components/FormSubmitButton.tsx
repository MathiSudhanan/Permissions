import { LoadingButton } from "@mui/lab";
import React from "react";
import { colors } from "../styles/theme/Theme";
import { IFormSubmitButtonProps } from "./FormSubmitButtonProps";

const FormSubmitButton = ({
  isSubmitting,
  isValid,
}: IFormSubmitButtonProps) => {
  return (
    <LoadingButton
      loading={isSubmitting}
      type="submit"
      fullWidth
      variant="contained"
      sx={{
        mt: 3,
        mb: 2,
        borderRadius: "20px",
        fontSize: "1em",
        backgroundColor: colors.blackPrimary,
      }}
      disabled={!isValid}
    >
      Save
    </LoadingButton>
  );
};

export default FormSubmitButton;
