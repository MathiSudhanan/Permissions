import { IFinalPermissionsCategory } from "./FinalPermissionsCategory";
import { IFinalPermissionsStat } from "./FinalPermissionsStat";

export interface IFinalPermissions extends IBaseModel {
  FinalPermissionsCategories: IFinalPermissionsCategory[];
  FinalPermissionsStats: IFinalPermissionsStat[];
}
