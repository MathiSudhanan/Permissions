import { Card, CardContent, CardHeader, Grid, TextField } from "@mui/material";

import React, { useEffect, useState } from "react";
import { IFinalPermissionsCategory } from "../../models/FinalPermissionsCategory";
import { colors } from "../../styles/theme/Theme";
import CategoryFP from "./CategoryFP";

interface ICategoryFinalPermissionsProps {
  control: any;

  categoriesList: IFinalPermissionsCategory[];
  filteredCategoriesList: IFinalPermissionsCategory[];
  setFilteredCategoriesList: any;
  setCategoriesList: any;
}

const CategoryFinalPermissions = ({
  Props,
}: {
  Props: ICategoryFinalPermissionsProps;
}) => {
  const {
    categoriesList,
    filteredCategoriesList,
    setFilteredCategoriesList,
    setCategoriesList,
  } = Props;
  // const [filteredList, setFilteredList] = useState<IFinalPermissionsCategory[]>(
  //   []
  // );

  const dataFilterChange = (event, dataArray, setDataArrayValue) => {
    let filtered = dataArray.filter((x) =>
      x.categoryName.toLowerCase().startsWith(event.target.value.toLowerCase())
    );

    setDataArrayValue(filtered);
  };

  useEffect(() => {
    setFilteredCategoriesList(categoriesList);
  }, [categoriesList]);

  return (
    <Grid container component="div" spacing={1}>
      <Grid xs={12} item>
        <Card
          sx={{
            mt: "2%",
            borderRadius: "5px",
          }}
        >
          {/* <CardHeader
            title={title}
            sx={{
              background: `linear-gradient(180deg, ${colors.bluePrimary} 0%, ${colors.white} 35%, ${colors.bluePrimary} 100%)`,
            }}
            titleTypographyProps={{
              color: colors.black,
              textAlign: "center",
              fontWeight: 400,
              fontSize: "1.1em",
            }}
          ></CardHeader> */}
          <CardContent>
            <TextField
              fullWidth
              label="Search"
              variant="outlined"
              onChange={(e) =>
                dataFilterChange(e, categoriesList, setFilteredCategoriesList)
              }
            />
            <div style={{ overflowY: "scroll", maxHeight: "20em" }}>
              {filteredCategoriesList &&
                filteredCategoriesList.map((category) => {
                  return (
                    <CategoryFP key={category.categoryId} data={category} />
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default CategoryFinalPermissions;
