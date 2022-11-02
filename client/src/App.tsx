import React, { useCallback, useEffect, useState } from "react";
import { Container, ThemeProvider } from "@mui/material";
import { theme } from "./styles/theme/Theme";
import ResponsiveAppBar from "./layout/NavBar";
import { Route, Routes, useLocation, useNavigate } from "react-router";

import Login from "./components/Account/Login";
import Home from "./layout/Home";
import SignUp from "./components/SignUp";
import Category from "./components/Category/Category";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Stat from "./components/Stat/Stat";
import CategoryList from "./components/Category/CategoryList";
import { useAppDispatch, useAppSelector } from "./store/configureStore";
import { fetchCurrentUser, setURL } from "./features/Account/accountSlice";
import PrivateRoute from "./layout/PrivateRoute";
import Loading from "./layout/Loading";
import StatList from "./components/Stat/StatList";
import CompanyList from "./components/Company/CompanyList";
import Company from "./components/Company/Company";
import UserGroup from "./components/UserGroup/UserGroup";
import UserGroupList from "./components/UserGroup/UserGroupList";
import ClientFundList from "./components/ClientFund/ClientFundList";
import FundList from "./components/Fund/FundList";
import Fund from "./components/Fund/Fund";
import ClientFund from "./components/ClientFund/ClientFund";
// import BaseProfile from "./components/BaseProfile/BaseProfile-old";
import BP from "./components/BaseProfile/BP";

import BaseProfileList from "./components/BaseProfile/BaseProfileList";
import CUGProfile from "./components/CUGProfile/CUGProfile";
import CUGProfileList from "./components/CUGProfile/CUGProfileList";
import CompanyUserGroup from "./components/CompanyUserGroup/CompanyUserGroup";
import CompanyUserGroupList from "./components/CompanyUserGroup/CompanyUserGroupList";

const App = () => {
  const anonymousAuthPages = ["/login", "/signup", "/forgotPassword"];

  const dispatch = useAppDispatch();
  const { isSessionExpired, redirectUrl } = useAppSelector(
    (state) => state.account
  );
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      isSessionExpired &&
      redirectUrl !== "" &&
      location.pathname !== redirectUrl
    ) {
      let url = redirectUrl;
      dispatch(setURL(""));

      navigate(url);
    }
  }, [dispatch, isSessionExpired, location.pathname, navigate, redirectUrl]);

  const initApp = useCallback(async () => {
    try {
      await dispatch(fetchCurrentUser());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    initApp().then(() => setLoading(false));
  }, [initApp]);

  if (loading) return <Loading message="Intializing app..." />;
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
      />
      {anonymousAuthPages.find((x) => x === location.pathname) ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgotPassword" element={<Login />} />
        </Routes>
      ) : (
        <Container maxWidth="xl" sx={{ height: "100%" }}>
          <ResponsiveAppBar></ResponsiveAppBar>
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/CategoryList"
              element={
                <PrivateRoute>
                  <CategoryList />
                </PrivateRoute>
              }
            />
            <Route
              path="/Category"
              element={
                <PrivateRoute>
                  <Category />
                </PrivateRoute>
              }
            />
            <Route
              path="/Category/:id"
              element={
                <PrivateRoute>
                  <Category />
                </PrivateRoute>
              }
            />
            <Route
              path="/StatList"
              element={
                <PrivateRoute>
                  <StatList />
                </PrivateRoute>
              }
            />
            <Route
              path="/Stat"
              element={
                <PrivateRoute>
                  <Stat />
                </PrivateRoute>
              }
            />
            <Route
              path="/Stat/:id"
              element={
                <PrivateRoute>
                  <Stat />
                </PrivateRoute>
              }
            />
            <Route
              path="/CompanyList"
              element={
                <PrivateRoute>
                  <CompanyList />
                </PrivateRoute>
              }
            />
            <Route
              path="/Company"
              element={
                <PrivateRoute>
                  <Company />
                </PrivateRoute>
              }
            />
            <Route
              path="/Company/:id"
              element={
                <PrivateRoute>
                  <Company />
                </PrivateRoute>
              }
            />
            <Route
              path="/UserGroupList"
              element={
                <PrivateRoute>
                  <UserGroupList />
                </PrivateRoute>
              }
            />
            <Route
              path="/UserGroup"
              element={
                <PrivateRoute>
                  <UserGroup />
                </PrivateRoute>
              }
            />
            <Route
              path="/UserGroup/:id"
              element={
                <PrivateRoute>
                  <UserGroup />
                </PrivateRoute>
              }
            />
            <Route
              path="/CompanyUserGroupList"
              element={
                <PrivateRoute>
                  <CompanyUserGroupList />
                </PrivateRoute>
              }
            />
            <Route
              path="/CompanyUserGroup"
              element={
                <PrivateRoute>
                  <CompanyUserGroup />
                </PrivateRoute>
              }
            />
            <Route
              path="/CompanyUserGroup/:id"
              element={
                <PrivateRoute>
                  <CompanyUserGroup />
                </PrivateRoute>
              }
            />
            <Route
              path="/ClientFundList"
              element={
                <PrivateRoute>
                  <ClientFundList />
                </PrivateRoute>
              }
            />
            <Route
              path="/ClientFund"
              element={
                <PrivateRoute>
                  <ClientFund />
                </PrivateRoute>
              }
            />
            <Route
              path="/ClientFund/:id"
              element={
                <PrivateRoute>
                  <ClientFund />
                </PrivateRoute>
              }
            />
            <Route
              path="/FundList"
              element={
                <PrivateRoute>
                  <FundList />
                </PrivateRoute>
              }
            />
            <Route
              path="/Fund"
              element={
                <PrivateRoute>
                  <Fund />
                </PrivateRoute>
              }
            />
            <Route
              path="/Fund/:id"
              element={
                <PrivateRoute>
                  <Fund />
                </PrivateRoute>
              }
            />
            <Route
              path="/BaseProfileList"
              element={
                <PrivateRoute>
                  <BaseProfileList />
                </PrivateRoute>
              }
            />
            <Route
              path="/BaseProfile"
              element={
                <PrivateRoute>
                  <BP />
                </PrivateRoute>
              }
            />
            <Route
              path="/BaseProfile/:id"
              element={
                <PrivateRoute>
                  <BP />
                </PrivateRoute>
              }
            />

            <Route
              path="/CUGProfileList"
              element={
                <PrivateRoute>
                  <CUGProfileList />
                </PrivateRoute>
              }
            />
            <Route
              path="/CUGProfile"
              element={
                <PrivateRoute>
                  <CUGProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/CUGProfile/:id"
              element={
                <PrivateRoute>
                  <CUGProfile />
                </PrivateRoute>
              }
            />
          </Routes>
        </Container>
      )}
    </ThemeProvider>
  );
};
/*colors:
{
 white: #fbfdff;
 blue: #82bfd4;
 black: #2c3237;
 brown: #72797f;
 gray:#bdd1d9;
}*/
export default App;
