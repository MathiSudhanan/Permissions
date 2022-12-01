import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { PaginatedResponse } from "../models/pagination";
import { store } from "../store/configureStore";
// import { useNavigate } from "react-router";

import { myHistory } from "./history";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;

const responseBody = (response: AxiosResponse) => {
  return response.data;
};

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

axios.interceptors.request.use((config: any) => {
  const token = store.getState().account.user?.token;
  // const navigate = useNavigate();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // navigate("/");
    // myHistory.replace("/");
  }
  // console.log("request: ", config);
  return config;
});

axios.interceptors.response.use(
  async (response) => {
    if (process.env.NODE_ENV === "development") {
      await sleep();
    }
    const pagination = response.headers["pagination"];
    if (pagination) {
      response.data = new PaginatedResponse(
        response.data,
        JSON.parse(pagination)
      );
    }
    return response;
  },
  (error: AxiosError<any, any>) => {
    const { data, status } = error.response!;

    switch (status) {
      case 400:
        if (data.errors) {
          const modelStateErrors: string[] = [];
          for (let key in data.errors) {
            const error = data.errors[key];
            if (error) {
              modelStateErrors.push(error);
            }
          }
          throw modelStateErrors.flat();
        }
        toast.error(data.title);
        break;
      case 401:
        toast.error(data.title);
        break;
      case 404:
        toast.error(data.title);
        break;
      case 500:
        // myHistory.replace("/server-error");
        // myHistory.replace("/server-error", { error: data });

        break;

      default:
        break;
    }
    return Promise.reject(error.response);
  }
);

const requests = {
  get: (url: string, params?: URLSearchParams) =>
    axios.get(url, { params }).then(responseBody),
  post: async (url: string, body: {}) =>
    axios.post(url, body).then(responseBody),
  patch: (url: string, body: {}) => axios.patch(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
};

const Account = {
  login: (values: any) => requests.post("/signin", values),
  register: (values: any) => requests.post("/users", values),
  currentUser: () => requests.get("/users/currentuser"),
  // fetchAddress: () => requests.get("account/savedAddress"),
};

const BaseProfile = {
  create: (values: any) => requests.post("/baseProfile", values),
  new: () => requests.get("/baseProfile/new"),
  modify: (id: string, values: any) =>
    requests.patch(`/baseProfile/${id}`, values),
  getAll: () => requests.get("/baseProfile"),
  getById: (id: string) => requests.get(`/baseProfile/${id}`),
  delete: (id: string) => requests.delete(`/baseProfile/${id}`),
};

const CUGProfile = {
  create: (values: any) => requests.post("/cugProfile", values),
  new: () => requests.get("/cugProfile/new"),
  getByBPID: (baseProfileId: string) =>
    requests.get(`/cugProfile/new/${baseProfileId}`),
  modify: (id: string, values: any) =>
    requests.patch(`/cugProfile/${id}`, values),
  getAll: () => requests.get("/cugProfile"),
  getById: (id: string) => requests.get(`/cugProfile/${id}`),
  delete: (id: string) => requests.delete(`/cugProfile/${id}`),
};

const HFProfile = {
  create: (values: any) => requests.post("/hfProfile", values),
  new: () => requests.get("/hfProfile/new"),
  modify: (id: string, values: any) =>
    requests.patch(`/hfProfile/${id}`, values),
  getAll: () => requests.get("/hfProfile"),
  getById: (id: string) => requests.get(`/hfProfile/${id}`),
  delete: (id: string) => requests.delete(`/hfProfile/${id}`),
};

const CFUGProfile = {
  create: (values: any) => requests.post("/cfugProfile", values),
  new: () => requests.get("/cfugProfile/new"),
  getOtherProfiles: (clientFundId: string, userGroupId: string) =>
    requests.get(`/cfugProfile/new/${clientFundId}/${userGroupId}`),
  modify: (id: string, values: any) =>
    requests.patch(`/cfugProfile/${id}`, values),
  getAll: () => requests.get("/cfugProfile"),
  getById: (id: string) => requests.get(`/cfugProfile/${id}`),
  delete: (id: string) => requests.delete(`/cfugProfile/${id}`),
};

const CFUProfile = {
  create: (values: any) => requests.post("/cfuProfile", values),
  new: () => requests.get("/cfuProfile/new"),
  getOtherProfiles: (clientFundId: string, userGroupId: string) =>
    requests.get(`/cfuProfile/new/${clientFundId}/${userGroupId}`),
  modify: (id: string, values: any) =>
    requests.patch(`/cfuProfile/${id}`, values),
  getAll: () => requests.get("/cfuProfile"),
  getById: (id: string) => requests.get(`/cfuProfile/${id}`),
  delete: (id: string) => requests.delete(`/cfuProfile/${id}`),
};

const Category = {
  create: (values: any) => requests.post("/category", values),
  modify: (id: string, values: any) =>
    requests.patch(`/category/${id}`, values),
  getAll: () => requests.get("/category"),
  getById: (id: string) => requests.get(`/category/${id}`),
  delete: (id: string) => requests.delete(`/category/${id}`),
};

const Company = {
  create: (values: any) => requests.post("/company", values),
  modify: (id: string, values: any) => requests.patch(`/company/${id}`, values),
  getAll: () => requests.get("/company"),
  getById: (id: string) => requests.get(`/company/${id}`),
  delete: (id: string) => requests.delete(`/company/${id}`),
};

const Fund = {
  create: (values: any) => requests.post("/fund", values),
  modify: (id: string, values: any) => requests.patch(`/fund/${id}`, values),
  getAll: () => requests.get("/fund"),
  getById: (id: string) => requests.get(`/fund/${id}`),
  delete: (id: string) => requests.delete(`/fund/${id}`),
};

const ClientFund = {
  create: (values: any) => requests.post("/clientFund", values),
  modify: (id: string, values: any) =>
    requests.patch(`/clientFund/${id}`, values),
  getAll: () => requests.get("/clientFund"),
  getByCompanyId: (companyId: string) =>
    requests.get(`/clientFund/cug/${companyId}`),
  getById: (id: string) => requests.get(`/clientFund/${id}`),
  delete: (id: string) => requests.delete(`/clientFund/${id}`),
};

const Stat = {
  create: (values: any) => requests.post("/stat", values),
  modify: (id: string, values: any) => requests.patch(`/stat/${id}`, values),
  getAll: () => requests.get("/stat"),
  getById: (id: string) => requests.get(`/stat/${id}`),
  delete: (id: string) => requests.delete(`/stat/${id}`),
};

const UserGroup = {
  create: (values: any) => requests.post("/userGroup", values),
  modify: (id: string, values: any) =>
    requests.patch(`/userGroup/${id}`, values),
  getAll: () => requests.get("/userGroup"),
  getById: (id: string) => requests.get(`/userGroup/${id}`),
  delete: (id: string) => requests.delete(`/userGroup/${id}`),
};

const UserGroupMapping = {
  getUsersByUserGroupId: (userGroupId: string) =>
    requests.get(`/userGroupMapping/Users/${userGroupId}`),
  create: (values: any) => requests.post("/userGroupMapping", values),
  modify: (id: string, values: any) =>
    requests.patch(`/userGroupMapping/${id}`, values),
  getAll: () => requests.get("/userGroupMapping"),
  getById: (id: string) => requests.get(`/userGroupMapping/${id}`),
  delete: (id: string) => requests.delete(`/userGroupMapping/${id}`),
};

const User = {
  create: (values: any) => requests.post("/user", values),
  modify: (id: string, values: any) => requests.patch(`/user/${id}`, values),
  getAll: () => requests.get("/user"),
  getById: (id: string) => requests.get(`/user/${id}`),
  getUsersByCompanyId: (companyId: string) =>
    requests.get(`/user/company/${companyId}`),
  delete: (id: string) => requests.delete(`/user/${id}`),
};

const CompanyUserGroup = {
  create: (values: any) => requests.post("/companyUserGroup", values),
  modify: (id: string, values: any) =>
    requests.patch(`/companyUserGroup/${id}`, values),
  getAll: () => requests.get("/companyUserGroup"),
  getById: (id: string) => requests.get(`/companyUserGroup/${id}`),
  getByCompanyId: (companyId: string) =>
    requests.get(`/companyUserGroup/cug/${companyId}`),
  delete: (id: string) => requests.delete(`/companyUserGroup/${id}`),
};

const FinalPermissions = {
  getById: (clientFundId: string, userId: string) =>
    requests.get(`/finalPermissions/${clientFundId}/${userId}`),
};

const agent = {
  Account,
  BaseProfile,
  Category,
  Company,
  CompanyUserGroup,
  ClientFund,
  CUGProfile,
  HFProfile,
  CFUGProfile,
  CFUProfile,
  Fund,
  Stat,
  UserGroup,
  User,
  UserGroupMapping,
  FinalPermissions,
};

export default agent;
