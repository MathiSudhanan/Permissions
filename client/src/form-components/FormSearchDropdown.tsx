import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ISelectModel } from "../models/Select";
import { FormSearchDropdownProps } from "./FormSearchDropdownProps";

export const FormSearchDropdown: React.FC<FormSearchDropdownProps> = ({
  name,
  label,
  value,
  // setValue,
  options,
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
    <FormControl size={"small"} fullWidth>
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        label={label}
        onChange={(e) => {
          if (onHandleChange) {
            onHandleChange(e);
          }
        }}
      >
        {generateSingleOptions()}
      </Select>
    </FormControl>
  );
};
