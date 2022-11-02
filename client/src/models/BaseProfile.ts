import { IBaseProfileCategory } from "./BaseProfileCategory";
import { IBaseProfileStat } from "./BaseProfileStat";

export interface IBaseProfile extends IBaseModel {
  description: string;
  BaseProfileCategories: IBaseProfileCategory[];
  BaseProfileStats: IBaseProfileStat[];
}
