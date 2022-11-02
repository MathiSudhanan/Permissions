import React from "react";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";

import { theme, colors } from "../../styles/theme/Theme";
import { Grid, Button } from "@mui/material";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

const CategoryPermissioned = ({ moveItem, ...data }) => {
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
        <Button
          variant="contained"
          endIcon={<KeyboardDoubleArrowLeftIcon />}
          sx={{ backgroundColor: "#ef9a9a" }}
          onClick={(e) =>
            moveItem("permissioned", "nonpermissioned", cat.categoryId)
          }
        ></Button>
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
        {/* <Button
          variant="contained"
          endIcon={<KeyboardDoubleArrowRightIcon />}
          sx={{ backgroundColor: "#80cbc4" }}
        ></Button> */}
      </Grid>
    </Grid>
  );
};

export default CategoryPermissioned;
