import { Button } from "@mui/material";
import React from "react";
import { colors } from "../styles/theme/Theme";
import { useNavigate, useParams } from "react-router";
import { IFormBackButtonProps } from "./FormBackButtonProps";

const FormBackButton = ({ onClick }: IFormBackButtonProps) => {
  const navigate = useNavigate();

  return (
    <Button
      // loading={isSubmitting}
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
      // onClick={(e) => {
      //   navigate("/companyUserGroupList");
      //   e.preventDefault();
      //   e.stopPropagation();
      // }}
      onClick={onClick}
    >
      Back
    </Button>
  );
};

export default FormBackButton;
