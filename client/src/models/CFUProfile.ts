import { ICFUProfileCategory } from "./CFUProfileCategory";
import { ICFUProfileStat } from "./CFUProfileStat";

export interface ICFUProfile extends IBaseModel {
  //   baseProfileId: string;
  description: string;
  userId: string;
  userGroupId: string;
  companyId: string;
  clientFundId: string;
  CFUProfileCategories: ICFUProfileCategory[];
  CFUProfileStats: ICFUProfileStat[];
}
