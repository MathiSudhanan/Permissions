import React from "react";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { IFormDatePickerProps } from "./FormDatePickerProps";

const FormDatePicker = ({
  name,
  label,
  control,
  defaultValue,
}: IFormDatePickerProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, value },
        fieldState: { error },
        formState,
      }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            disableFuture
            label={label}
            openTo="year"
            views={[/*"year", "month",*/ "day"]}
            value={value}
            onChange={onChange}
            renderInput={(params) => (
              <TextField {...params} fullWidth name={name} />
            )}
          />
        </LocalizationProvider>
      )}
    />
  );
};

export default FormDatePicker;
