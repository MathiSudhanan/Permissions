import React, { useEffect, useState } from "react";
import { FormControl, MenuItem, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { FormInputDropdownProps } from "./FormInputDropdownProps";
import { ISelectModel } from "../models/Select";

export const FormInputDropdown: React.FC<FormInputDropdownProps> = ({
  name,
  control,
  label,
  options,
  setValue,
  onHandleChange,
}) => {
  const [ddlOptions, setDDLOptions] = useState<ISelectModel[]>([]);

  useEffect(() => {
    setDDLOptions(options);
  }, [options]);

  const generateSingleOptions = () => {
    return ddlOptions.map((option: ISelectModel) => {
      return (
        <MenuItem key={option.id} value={option.id}>
          {option.name}
        </MenuItem>
      );
    });
  };

  return (
    <Controller
      render={({ field: { onChange, value } }) => (
        <FormControl size={"small"} fullWidth>
          <TextField
            select
            fullWidth
            value={value}
            label={label}
            onChange={(e) => {
              onChange(e);
              if (setValue) {
                setValue(e.target.value);
              }
            }}
          >
            {generateSingleOptions()}
          </TextField>
        </FormControl>
      )}
      control={control}
      name={name}
    />
  );
};
