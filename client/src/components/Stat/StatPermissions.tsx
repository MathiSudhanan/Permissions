import {
  Card,
  CardHeader,
  Grid,
  CardContent,
  TextField,
  List,
  ListItem,
} from "@mui/material";
import React from "react";
// import TriStateSwitchSpan from "../Common/TriStateSwitcSpan";
import TriStateSwitch from "../Common/TriStateSwitch";

import { colors } from "../../styles/theme/Theme";
import { IBaseProfileStat } from "../../models/BaseProfileStat";

interface IStatProps {
  control: any;
  nsStats: IBaseProfileStat[];
  filteredStats: IBaseProfileStat[];
  setFilteredStats: any;
}

const StatPermissions = ({ Props }: { Props: IStatProps }) => {
  if (Props) {
    const { nsStats, filteredStats, setFilteredStats } = Props;
    const dataFilterChange = (event, dataArray, setDataArrayValue) => {
      let filtered = dataArray.filter((x) =>
        x.statName.toLowerCase().startsWith(event.target.value.toLowerCase())
      );
      setDataArrayValue([...filtered]);
    };

    const updateStat = (item, value) => {
      const modifiedStats = filteredStats.map((x) => {
        if (x.statId === item.statId) {
          return { ...x, isPermissioned: value, isModified: true };
        }
        return x;
      });
      setFilteredStats(modifiedStats);
    };

    return (
      <Card sx={{ width: "100%" }}>
        <CardHeader
          title={
            <Grid container>
              <Grid xs={10} item>
                Name
              </Grid>
              <Grid xs={2} item>
                Permissions
              </Grid>
            </Grid>
          }
          sx={{ backgroundColor: colors.gray }}
          titleTypographyProps={{ height: "1em", fontSize: "1.2em" }}
        ></CardHeader>
        <CardContent>
          <Grid container>
            <Grid xs={10} item>
              <TextField
                variant="outlined"
                label="search"
                fullWidth
                onChange={(e) => {
                  dataFilterChange(e, nsStats, setFilteredStats);
                }}
              />
            </Grid>
            <Grid xs={2} item>
              <TriStateSwitch defaultValue={{}} item={null} updateStat={null} />
            </Grid>
          </Grid>
          <Grid
            sx={{ width: "100%", height: "25em", overflowY: "scroll" }}
            container
          >
            <List sx={{ width: "100%" }}>
              {filteredStats &&
                filteredStats.map((x) => {
                  return (
                    <ListItem
                      key={x.statId}
                      sx={{
                        height: "3em",
                        backgroundColor: colors.whitePrimary,
                        mt: ".5em",
                      }}
                    >
                      <Grid xs={10} item>
                        {x.statName}
                      </Grid>
                      <Grid xs={2} sx={{ mt: "1em", ml: "2.5em" }} item>
                        <TriStateSwitch
                          defaultValue={x.isPermissioned ?? ""}
                          item={x}
                          updateStat={updateStat}
                        />
                      </Grid>
                    </ListItem>
                  );
                })}
            </List>
          </Grid>
        </CardContent>
      </Card>
    );
  } else {
    return <></>;
  }
};

export default StatPermissions;
