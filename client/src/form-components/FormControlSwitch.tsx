import { FormControlLabel, Switch } from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";
import FormInputProps from "./FormInputProps";
import { colors } from "../styles/theme/Theme";

const FormControlSwitch = ({ name, control, label }: FormInputProps) => {
  return (
    <FormControlLabel
      control={
        <Controller
          name={name}
          render={({
            field: { onChange, value },
            fieldState: { error },
            formState,
          }) => {
            return (
              <Switch color="primary" checked={value} onChange={onChange} />
            );
          }}
          control={control}
        />
      }
      label={label}
      labelPlacement="start"
      sx={{
        mt: "1.5em",
        ml: "1%",
        color: colors.brown,
      }}
    />
  );
};

export default FormControlSwitch;
