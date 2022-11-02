import { ICUGProfileCategory } from "./CUGProfileCategory";
import { ICUGProfileStat } from "./CUGProfileStat";

export interface ICUGProfile extends IBaseModel {
  baseProfileId: string;
  description: string;
  companyUserGroupId: "";
  companyId: "";
  CUGProfileCategories: ICUGProfileCategory[];
  CUGProfileStats: ICUGProfileStat[];
}
