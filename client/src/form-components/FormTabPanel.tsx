import { Box } from "@mui/material";
import React from "react";
import { colors } from "../styles/theme/Theme";
import ITabPanelProps from "./TabPanelProps";

const FormTabPanel = (props: ITabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{
        border: `1px solid ${colors.gray}`,
        // backgroundColor: `linear-gradient(180deg, ${colors.gray} 0%, ${colors.white} 35%, ${colors.blue} 100%)`,
      }}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export default FormTabPanel;
