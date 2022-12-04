import {
  Card,
  CardHeader,
  Grid,
  CardContent,
  TextField,
  List,
  ListItem,
  Chip,
  Fab,
  Stack,
} from "@mui/material";
import React from "react";
// import TriStateSwitchSpan from "../Common/TriStateSwitcSpan";
import TriStateSwitch from "../Common/TriStateSwitch";

import { colors } from "../../styles/theme/Theme";
import { IFinalPermissionsStat } from "../../models/FinalPermissionsStat";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

interface IStatProps {
  control: any;
  nsStats: IFinalPermissionsStat[];
  filteredStats: IFinalPermissionsStat[];
  setFilteredStats: any;
}

const StatFP = ({ Props }: { Props: IStatProps }) => {
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

    const chipOrder = ["bp", "cugp", "hfp", "cfugp", "cfup"];

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
                      <Grid
                        xs={5}
                        item
                        sx={{
                          mt: ".9em",
                          fontSize: "1em",
                        }}
                      >
                        <Stack spacing={1} alignItems="center">
                          <Stack direction="row" spacing={1}>
                            {x.chipData &&
                              chipOrder.map((co, i) => {
                                let cd = x.chipData.find((d) => co === d.name);
                                if (cd) {
                                  return (
                                    <Chip
                                      key={i}
                                      label={cd.name}
                                      color={
                                        cd.value === true ? "success" : "error"
                                      }
                                      sx={{ width: "52px" }}
                                    />
                                  );
                                } else {
                                  return (
                                    <Chip
                                      key={i}
                                      // label={cd.name}
                                      // color={cd.value === true ? "success" : "error"}
                                      sx={{ width: "52px" }}
                                    />
                                  );
                                }
                              })}
                          </Stack>
                        </Stack>
                      </Grid>
                      <Grid xs={1} item>
                        {/* <Button
          variant="contained"
          endIcon={cat.isPermissioned ? <CheckIcon /> : <ClearIcon />}
          sx={{
            backgroundColor: cat.isPermissioned ? "#80cbc4" : "#ef9a9a",
          }}
        ></Button> */}

                        <Fab
                          color={x.isPermissioned ? "success" : "error"}
                          // disabled
                          aria-label="like"
                          size="small"
                        >
                          {x.isPermissioned ? <CheckIcon /> : <ClearIcon />}
                        </Fab>
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

export default StatFP;
