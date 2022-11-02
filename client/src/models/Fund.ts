export interface IFund extends IBaseModel {
  description: string;
  isSecurityLevel: boolean;
  startDate: any;
  endDate: any | null;
  isFOF: boolean;
}
