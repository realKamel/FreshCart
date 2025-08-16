import { IAddress } from './iaddress';

export interface IAddressResponse {
  status: string;
  message: string;
  data: IAddress[] | IAddress;
}
