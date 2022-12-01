import { ISelectModel } from "../models/Select";

export interface FormSearchDropdownProps {
  name: string;
  label: string;
  value: any;
  // setValue?: any;
  options: ISelectModel[];
  onHandleChange?: (event: any) => void;
}
