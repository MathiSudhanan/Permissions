import { ISelectModel } from "../models/Select";
import FormInputProps from "./FormInputProps";

export interface FormInputDropdownProps extends FormInputProps {
  options: ISelectModel[];
  onHandleChange?: (event: any) => void;
}
