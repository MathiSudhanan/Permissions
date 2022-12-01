import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { accountSlice } from "../features/Account/accountSlice";
import { categorySlice } from "../features/Category/categorySlice";
import { clientFundSlice } from "../features/ClientFund/clientFundSlice";
import { companySlice } from "../features/Company/companySlice";
import { fundSlice } from "../features/Fund/fundSlice";
import { statSlice } from "../features/Stat/statSlice";
import { userGroupSlice } from "../features/UserGroup/userGroupSlice";
import { userGroupMappingSlice } from "../features/UserGroupMapping/userGroupMappingSlice";
import { userSlice } from "../features/User/userSlice";

import { companyUserGroupSlice } from "../features/CompanyUserGroup/companyUserGroupSlice";

import { baseProfileSlice } from "../features/BaseProfile/baseProfileSlice";
import { CUGProfileSlice } from "../features/CUGProfile/CUGProfileSlice";
import { hedgeFundProfileSlice } from "../features/HFProfile/hedgeFundProfileSlice";
import { cfugProfileSlice } from "../features/CFUGProfile/CFUGProfileSlice";
import { cfuProfileSlice } from "../features/CFUProfile/CFUProfileSlice";
import { finalPermissionsSlice } from "../features/FinalPermissions/finalPermissionsSlice";

export const store = configureStore({
  reducer: {
    account: accountSlice.reducer,
    category: categorySlice.reducer,
    company: companySlice.reducer,
    clientFund: clientFundSlice.reducer,
    fund: fundSlice.reducer,
    stat: statSlice.reducer,
    userGroup: userGroupSlice.reducer,
    userGroupMapping: userGroupMappingSlice.reducer,
    user: userSlice.reducer,

    companyUserGroup: companyUserGroupSlice.reducer,
    baseProfile: baseProfileSlice.reducer,
    cugProfile: CUGProfileSlice.reducer,
    hedgeFundProfile: hedgeFundProfileSlice.reducer,
    cfugProfile: cfugProfileSlice.reducer,
    cfuProfile: cfuProfileSlice.reducer,
    finalPermissions: finalPermissionsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
