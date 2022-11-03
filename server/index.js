"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
// import mongoose from "mongoose";
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./routes/user"));
const signin_1 = __importDefault(require("./routes/signin"));
const baseProfile_1 = __importDefault(require("./routes/baseProfile"));
const CUGProfile_1 = __importDefault(require("./routes/CUGProfile"));
const HFProfile_1 = __importDefault(require("./routes/HFProfile"));
const category_1 = __importDefault(require("./routes/category"));
const stat_1 = __importDefault(require("./routes/stat"));
const company_1 = __importDefault(require("./routes/company"));
const clientFund_1 = __importDefault(require("./routes/clientFund"));
const fund_1 = __importDefault(require("./routes/fund"));
const userGroup_1 = __importDefault(require("./routes/userGroup"));
const companyUserGroup_1 = __importDefault(require("./routes/companyUserGroup"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json({ limit: "30mb" }));
app.use(body_parser_1.default.urlencoded({ limit: "30mb", extended: true }));
const corsConfig = {
    origin: true,
    credentials: true,
};
app.use((0, cors_1.default)(corsConfig));
app.options("*", (0, cors_1.default)(corsConfig));
app.use("/signin", signin_1.default);
app.use("/users", user_1.default);
app.use("/baseprofile", baseProfile_1.default);
app.use("/cugprofile", CUGProfile_1.default);
app.use("/HFprofile", HFProfile_1.default);
app.use("/category", category_1.default);
app.use("/stat", stat_1.default);
app.use("/company", company_1.default);
app.use("/userGroup", userGroup_1.default);
app.use("/companyUserGroup", companyUserGroup_1.default);
app.use("/fund", fund_1.default);
app.use("/clientFund", clientFund_1.default);
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
// mongoose.set("useFindAndModify", false);
exports.default = app;
