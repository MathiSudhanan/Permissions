import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
} from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import React from "react";
import { theme, colors } from "../../styles/theme/Theme";

const ListBoxSearch = ({
  title,
  nonFilteredList,
  filteredList,
  setFilteredList,
  ListBoxDataComponent,
  moveItem,
}) => {
  const dataFilterChange = (event, dataArray, setDataArrayValue) => {
    let filtered = dataArray.filter((x) =>
      x.categoryName.toLowerCase().startsWith(event.target.value.toLowerCase())
    );
    console.log("Filtered", filtered);
    setDataArrayValue(filtered);
  };

  return (
    <Card
      sx={{
        mt: "2%",
        borderRadius: "5px",
      }}
    >
      <CardHeader
        title={title}
        sx={{
          background: `linear-gradient(180deg, ${colors.bluePrimary} 0%, ${colors.white} 35%, ${colors.bluePrimary} 100%)`,

          //   background: `linear-gradient(180deg, ${colors.gray} 0%, ${colors.white} 35%, ${colors.blue} 100%)`,
        }}
        titleTypographyProps={{
          color: colors.black,
          textAlign: "center",
          fontWeight: 400,
          fontSize: "1.1em",
          //   fontFamily: '"montez","cursive"',
        }}
      ></CardHeader>
      <CardContent>
        <TextField
          fullWidth
          label="Search"
          variant="outlined"
          onChange={(e) =>
            dataFilterChange(e, nonFilteredList, setFilteredList)
          }
        />
        <div style={{ overflowY: "scroll", maxHeight: "20em" }}>
          {filteredList.map((category) => {
            return (
              <ListBoxDataComponent
                key={category.categoryId}
                data={category}
                moveItem={moveItem}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ListBoxSearch;
