import { IHedgeFundProfileCategory } from "./HFProfileCategory";
import { IHedgeFundProfileStat } from "./HFProfileStat";

export interface IHedgeFundProfile extends IBaseModel {
  description: string;
  HedgeFundProfileCategories: IHedgeFundProfileCategory[];
  HedgeFundProfileStats: IHedgeFundProfileStat[];
}
