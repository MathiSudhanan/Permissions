import { Button, Fab, Grid, Typography } from "@mui/material";
import React from "react";
import { colors } from "../../styles/theme/Theme";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

const CategoryFP = ({ ...data }) => {
  let cat = data.data;
  console.log("FP Cat", cat);

  const chipOrder = ["bp", "cugp", "hfp", "cfugp", "cfup"];
  return (
    <Grid
      key={cat.categoryId}
      container
      sx={{
        backgroundColor: colors.whitePrimary,
        mt: ".5em",
      }}
    >
      <Grid
        xs={6}
        item
        sx={{
          justifyContent: "center",
          alignItems: "center",
          textAlign: "left",
          mt: "1.2em",
          fontSize: "1em",
          color: colors.black,
        }}
      >
        {cat.categoryName}
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
            {cat.chipData &&
              chipOrder.map((x, i) => {
                let cd = cat.chipData.find((d) => x === d.name);
                if (cd) {
                  return (
                    <Chip
                      key={i}
                      label={cd.name}
                      color={cd.value === true ? "success" : "error"}
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
          color={cat.isPermissioned ? "success" : "error"}
          // disabled
          aria-label="like"
        >
          {cat.isPermissioned ? <CheckIcon /> : <ClearIcon />}
        </Fab>
      </Grid>
    </Grid>
  );
};

export default CategoryFP;
