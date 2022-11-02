import React from "react";

import { colors } from "../../styles/theme/Theme";
import { Grid, Button } from "@mui/material";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

const CategoryNonPermissioned = ({ moveItem, ...data }) => {
  let cat = data.data;
  return (
    <Grid
      key={cat.categoryId}
      container
      sx={{
        backgroundColor: colors.whitePrimary,
        mt: ".5em",
      }}
    >
      <Grid xs={2} item>
        {/* <Button
          variant="contained"
          endIcon={<FirstPageIcon />}
          sx={{ backgroundColor: "#ef9a9a" }}
        ></Button> */}
      </Grid>
      <Grid
        xs={8}
        item
        sx={{
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          mt: ".2em",
          fontSize: "1em",
          color: colors.black,
        }}
      >
        {cat.categoryName}
      </Grid>
      <Grid xs={2} item>
        <Button
          variant="contained"
          endIcon={<KeyboardDoubleArrowRightIcon />}
          sx={{ backgroundColor: "#80cbc4" }}
          onClick={(e) =>
            moveItem("nonpermissioned", "permissioned", cat.categoryId)
          }
        ></Button>
      </Grid>
    </Grid>
  );
};

export default CategoryNonPermissioned;
