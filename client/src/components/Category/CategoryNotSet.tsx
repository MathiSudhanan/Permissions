import React from "react";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";

import { theme, colors } from "../../styles/theme/Theme";
import { Grid, Button } from "@mui/material";

const CategoryNotSet = ({ moveItem, ...data }) => {
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
          endIcon={<FirstPageIcon />}
          sx={{ backgroundColor: "#ef9a9a" }}
          onClick={(e) => moveItem("notset", "nonpermissioned", cat.categoryId)}
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
        <Button
          variant="contained"
          endIcon={<LastPageIcon />}
          sx={{ backgroundColor: "#80cbc4" }}
          onClick={(e) => moveItem("notset", "permissioned", cat.categoryId)}
        ></Button>
      </Grid>
    </Grid>
  );
};

export default CategoryNotSet;
