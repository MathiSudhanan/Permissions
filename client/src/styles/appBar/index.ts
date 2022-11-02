import { Box, List, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import '@fontsource/montez'
import {colors} from '../theme/Theme'



export const AppBarContainer = styled(Box)(()=>({
    display:'flex',
    marginTop:4,
    justifyContent:'center',
    alignItems:'center',
    padding: '2px 8px'
}));

export const AppBarHeader = styled(Typography)(()=>({    
    padding: '4px',
    flexGrow:1,
    fontFamily:'"montez","cursive"',
    // color: colors.white,
    fontSize:"3em",
    color: colors.brown,
}));

export const MenuItems = styled(List)((obj:{type:any})=>({    
    display: obj.type==='row'? 'flex':'block',
    
    flexGrow:3,
    justifyContent:'center',
    alignItems:'center',
    fontFamily:'"montez","cursive"',
    
    

}));