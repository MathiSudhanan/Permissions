import express from "express";
import bodyParser from "body-parser";
// import mongoose from "mongoose";

import cors from "cors";
import users from "./routes/user";
import signin from "./routes/signin";
import baseprofile from "./routes/baseProfile";
import cugProfile from "./routes/CUGProfile";
import hfProfile from "./routes/HFProfile";

import category from "./routes/category";
import stat from "./routes/stat";
import company from "./routes/company";
import clientFund from "./routes/clientFund";
import fund from "./routes/fund";
import userGroup from "./routes/userGroup";
import companyUserGroup from "./routes/companyUserGroup";

const app = express();

app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
const corsConfig = {
  origin: true,
  credentials: true,
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

app.use("/signin", signin);

app.use("/users", users);
app.use("/baseprofile", baseprofile);
app.use("/cugprofile", cugProfile);
app.use("/HFprofile", hfProfile);

app.use("/category", category);
app.use("/stat", stat);
app.use("/company", company);
app.use("/userGroup", userGroup);
app.use("/companyUserGroup", companyUserGroup);
app.use("/fund", fund);
app.use("/clientFund", clientFund);

const PORT = process.env.PORT || 3500;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));

// mongoose.set("useFindAndModify", false);
export default app;
