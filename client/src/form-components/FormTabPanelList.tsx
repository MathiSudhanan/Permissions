import { Tabs, Tab } from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";
import { colors } from "../styles/theme/Theme";
import FormTabPanel from "./FormTabPanel";

const FormTabPanelList = ({ tabData }: { tabData: any }) => {
  const [tabValue, setTabValue] = React.useState(0);
  const a11yProps = (index: number) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  console.log("tab Data", tabData);
  if (tabData.length) {
    return (
      <>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          {tabData.map((x) => {
            return (
              <Tab
                key={x.name}
                label={x.name}
                {...a11yProps(0)}
                sx={{
                  background: `linear-gradient(180deg, ${colors.gray} 0%, ${colors.white} 35%, ${colors.blue} 100%)`,
                  borderTopLeftRadius: "15px",

                  ml: "1px",
                }}
              />
            );
          })}
        </Tabs>
        {tabData.map((x, index) => {
          console.log("Properties", x.Props);
          return (
            <FormTabPanel
              value={tabValue}
              index={index}
              key={x.name}
              data={x.data}
            >
              <x.component key={x.name} Props={x.Props}></x.component>
            </FormTabPanel>
          );
        })}
      </>
    );
  } else {
    return <div></div>;
  }
};

export default FormTabPanelList;
