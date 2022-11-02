import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import { colors, theme } from "../styles/theme/Theme";
import "@fontsource/montez";
import { useNavigate } from "react-router-dom";
import BusinessSharpIcon from "@mui/icons-material/BusinessSharp"; //Company
import StackedLineChartIcon from "@mui/icons-material/StackedLineChart"; //stat
import CategoryIcon from "@mui/icons-material/Category"; //category
import GroupAddIcon from "@mui/icons-material/GroupAdd"; //UserGroup
import AccountBalanceIcon from "@mui/icons-material/AccountBalance"; //Fund
import AssignmentIcon from "@mui/icons-material/Assignment"; //ClientFund
import DatasetLinkedIcon from "@mui/icons-material/DatasetLinked"; //BAseProfile
import RecentActorsIcon from "@mui/icons-material/RecentActors"; //Company User Group
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle"; // CUG Profile

const Main = () => {
  const cardData = [
    // { page: "Base Profile", path: "/" },
    // { page: "C U G Profile", path: "/" },
    // { page: "H F Profile", path: "/" },
    // { page: "U G F Profile", path: "/" },
    // { page: "U F Profile", path: "/" },
    {
      page: "Company",
      path: "/companyList",
      iconTyp: (
        <BusinessSharpIcon
          sx={{ fontSize: "5em", color: colors.blackPrimary }}
        />
      ),
    },
    {
      page: "User Group",
      path: "/userGroupList",
      iconTyp: (
        <GroupAddIcon sx={{ fontSize: "5em", color: colors.blackPrimary }} />
      ),
    },
    {
      page: "Company User Group",
      path: "/companyUserGroupList",
      iconTyp: (
        <RecentActorsIcon
          sx={{ fontSize: "5em", color: colors.blackPrimary }}
        />
      ),
    },
    {
      page: "Categories",
      path: "/categoryList",
      iconTyp: (
        <CategoryIcon sx={{ fontSize: "5em", color: colors.blackPrimary }} />
      ),
    },
    {
      page: "Stats",
      path: "/statList",
      iconTyp: (
        <StackedLineChartIcon
          sx={{ fontSize: "5em", color: colors.blackPrimary }}
        />
      ),
    },
    {
      page: "Fund",
      path: "/fundList",
      iconTyp: (
        <AccountBalanceIcon
          sx={{ fontSize: "5em", color: colors.blackPrimary }}
        />
      ),
    },
    {
      page: "Client Fund",
      path: "/clientFundList",
      iconTyp: (
        <AssignmentIcon sx={{ fontSize: "5em", color: colors.blackPrimary }} />
      ),
    },
    {
      page: "Base Profile",
      path: "/BaseProfileList",
      iconTyp: (
        <DatasetLinkedIcon
          sx={{ fontSize: "5em", color: colors.blackPrimary }}
        />
      ),
    },
    {
      page: "CUG Profile",
      path: "/CUGProfileList",
      iconTyp: (
        <SupervisedUserCircleIcon
          sx={{ fontSize: "5em", color: colors.blackPrimary }}
        />
      ),
    },
  ];
  const isSmallOrLess = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const handleGoClick = (e: any, path: string) => {
    navigate(path);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignContent: "flex-start",
        p: 1,
        m: 2,
        // bgcolor: "background.paper",
        // maxWidth: 380,
        height: "100%",
        borderRadius: 20,
      }}
    >
      {cardData.map((x) => {
        let iconTyp = x.iconTyp;
        return (
          <Card
            key={x.page}
            sx={{
              ml: "1em",
              mt: "1em",
              width: isSmallOrLess ? "100%" : "220px",

              borderRadius: "20px",

              borderTop: `5px solid ${colors.blackPrimary}`,
            }}
          >
            <CardContent sx={{ display: "flex", justifyContent: "center" }}>
              {/* <Box sx={{ display: "flex", justifyContent: "center" }}> */}
              <IconButton sx={{ width: "18%" }}>{iconTyp}</IconButton>
              {/* </Box> */}
            </CardContent>
            <CardActions
              sx={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.gray,
              }}
            >
              <Button
                variant="contained"
                sx={{
                  width: "95%",

                  borderRadius: "20px",
                  backgroundColor: colors.blackPrimary,

                  color: colors.white,
                }}
                onClick={(e) => handleGoClick(e, x.path)}
              >
                {x.page}
              </Button>
            </CardActions>
          </Card>
        );
      })}
    </Box>
  );
};

export default Main;
