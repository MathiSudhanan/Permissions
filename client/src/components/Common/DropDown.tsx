import React, { useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { TextField } from "@mui/material";

const DropDown = ({
  labelText,
  data,
  registerObj,
  getValues,
  onChange = null,
}: {
  labelText: string;
  data: any;
  registerObj: any;
  getValues: any;
  onChange: ((event: any) => void) | null;
}) => {
  const [value, setValue] = React.useState({
    selectedID: "",
    visibleValue: "",
  });

  const handleChange = (event: SelectChangeEvent) => {
    if (onChange) {
      onChange(event);
    }

    // setValue({ selectedID: event.target.value, visibleValue: "Test" });
    // console.log(event.target.value);
  };

  useEffect(() => {
    if (getValues(registerObj.reg.name) !== "[object Object]") {
      setValue(getValues(registerObj.reg.name));
    }
  }, [getValues(registerObj.reg.name)]);

  console.log("drop down Name: ", getValues());

  console.log("drop down Name: ", registerObj);
  console.log("drop down Value: ", getValues(registerObj.reg.name));

  return (
    <FormControl fullWidth>
      <TextField
        select
        fullWidth
        value={value}
        // inputProps={value}
        label={labelText}
        {...registerObj.reg}
        error={registerObj.error}
        helperText={registerObj.helperText}
        onChange={handleChange}
      >
        <MenuItem value={0}></MenuItem>
        {data.map((x) => {
          return (
            <MenuItem key={x.id} value={x.id}>
              {x.name}
            </MenuItem>
          );
        })}
      </TextField>
    </FormControl>
  );
};

export default DropDown;
