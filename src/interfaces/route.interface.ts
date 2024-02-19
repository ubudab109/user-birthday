import { ValidationChain } from "express-validator";

export interface RoutesI {
  method: string;
  route: string;
  controller: any;
  action: string;
  validation: Array<ValidationChain>;
}