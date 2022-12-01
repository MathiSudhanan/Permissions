import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { IBaseProfileCategory } from "../../models/BaseProfileCategory";
import { sortCategoryArray } from "../../Utils/arrayUtils";
import ListBoxSearch from "../Common/ListBoxSearch";
import CategoryNonPermissioned from "./CategoryNonPermissioned";
import CategoryNotSet from "./CategoryNotSet";
import CategoryPermissioned from "./CategoryPermissioned";

interface ICategoryPermissionsProps {
  control: any;
  Categories: IBaseProfileCategory[];
  notSetCategoriesList: IBaseProfileCategory[];
  permissionedCategoriesList: IBaseProfileCategory[];
  nonPermissionedCategoriesList: IBaseProfileCategory[];
  setNonPermissionedCategoriesList: any;
  setNotSetCategoriesList: any;
  setPermissionedCategoriesList: any;
  moveItem: (from, to, itemId) => void;
}

const CategoryPermissions = ({
  Props,
}: {
  Props: ICategoryPermissionsProps;
}) => {
  const {
    Categories,
    notSetCategoriesList,
    permissionedCategoriesList,
    nonPermissionedCategoriesList,
    moveItem,
    setNotSetCategoriesList,
    setPermissionedCategoriesList,
    setNonPermissionedCategoriesList,
  } = Props;

  return (
    <>
      <Grid container component="div" spacing={1}>
        <Grid md={4} xs={12} item>
          <ListBoxSearch
            title="Non Permissioned"
            nonFilteredList={
              Categories
                ? sortCategoryArray(
                    Categories.filter((x) => x.isPermissioned === false)
                  )
                : []
            }
            filteredList={nonPermissionedCategoriesList}
            setFilteredList={setNonPermissionedCategoriesList}
            ListBoxDataComponent={CategoryNonPermissioned}
            moveItem={moveItem}
          ></ListBoxSearch>
        </Grid>
        <Grid md={4} xs={12} item>
          <ListBoxSearch
            title="Not Assigned"
            nonFilteredList={
              Categories
                ? sortCategoryArray(
                    Categories.filter((x) => x.isPermissioned === null)
                  )
                : []
            }
            filteredList={notSetCategoriesList}
            setFilteredList={setNotSetCategoriesList}
            ListBoxDataComponent={CategoryNotSet}
            moveItem={moveItem}
          ></ListBoxSearch>
        </Grid>
        <Grid md={4} xs={12} item>
          <ListBoxSearch
            title="Permissioned"
            nonFilteredList={
              Categories
                ? sortCategoryArray(
                    Categories.filter((x) => x.isPermissioned === true)
                  )
                : []
            }
            filteredList={permissionedCategoriesList}
            setFilteredList={setPermissionedCategoriesList}
            ListBoxDataComponent={CategoryPermissioned}
            moveItem={moveItem}
          ></ListBoxSearch>
        </Grid>
      </Grid>
    </>
  );
};

export default CategoryPermissions;
