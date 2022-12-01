import { ICFUGProfileCategory } from "./CFUGProfileCategory";
import { ICFUGProfileStat } from "./CFUGProfileStat";

export interface ICFUGProfile extends IBaseModel {
  // baseProfileId: string;
  description: string;
  UserGroupId: string;
  companyId: string;
  clientFundId: string;
  CFUGProfileCategories: ICFUGProfileCategory[];
  CFUGProfileStats: ICFUGProfileStat[];
}
