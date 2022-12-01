import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { ISelectModel } from "../models/Select";
import { FormInputDropdownProps } from "./FormInputDropdownProps";

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
    if (options.length) {
      setDDLOptions(options);
    } else {
      setDDLOptions([{ id: "", name: "" }]);
    }
  }, [options]);

  const generateSingleOptions = () => {
    if (ddlOptions.length) {
      return ddlOptions.map((option: ISelectModel) => {
        return (
          <MenuItem key={option.id} value={option.id}>
            {option.name}
          </MenuItem>
        );
      });
    }
  };

  return (
    <Controller
      render={({ field: { onChange, value } }) => (
        <FormControl size={"small"} fullWidth>
          {/* <TextField
              select
              fullWidth
              value={value}
              label={label}
              onChange={(e) => {
                onChange(e);
                if (setValue) {
                  setValue(e.target.value);
                }
                if (onHandleChange) {
                  onHandleChange(e);
                }
              }}
            >
              {generateSingleOptions()}
            </TextField> */}
          <InputLabel id="demo-simple-select-label">{label}</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={value}
            label={label}
            onChange={(e) => {
              onChange(e);
              if (setValue) {
                setValue(e.target.value);
              }
              if (onHandleChange) {
                onHandleChange(e);
              }
            }}
          >
            {generateSingleOptions()}
          </Select>
        </FormControl>
      )}
      control={control}
      name={name}
    />
  );
};
