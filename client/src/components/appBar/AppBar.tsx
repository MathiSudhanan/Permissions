import { Typography } from "@mui/material";
import { ListItemText } from "@mui/material";
import React from "react";

import {AppBarContainer, AppBarHeader, MenuItems} from '../../styles/appBar';
const AppBar = () =>{

    const pages = [
        "Base Profile",
        "CUG Profile",
        "HF Profile",
        "UG Profile",
        "User Profile",
      ];

    return (
        <AppBarContainer>
            <AppBarHeader>
                Permissions
            </AppBarHeader>
            <MenuItems type='row'>
            {pages.map((page) => (
                <ListItemText primary={page} sx={{fontFamily:'inherit'}}>
                  
                </ListItemText>
            ))}
            </MenuItems>
        </AppBarContainer>
    )
}

export default AppBar;
