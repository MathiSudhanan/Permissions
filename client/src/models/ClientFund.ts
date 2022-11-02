export interface IClientFund extends IBaseModel {
  description: string;
  companyId: string;
  fundId: string;
  startDate: any;
  endDate: any | null;
  isSecurityLevel: boolean;
}
