export interface InputContract {
  language: string;
  sources: any;
  settings: {
    outputSelection: any;
  };
}
export enum StateTransaction {
  VIEW = 'view',
  NONPAYABLE = 'nonpayable',
}
export enum TypeContract {
  SIGN = 1,
}
export interface ABI {
  inputs: any[];
  name: string;
  outputs: any[];
  stateMutability: StateTransaction;
  type: string;
}
export interface ResponseCompile {
  ABI: any;
  bytecode: string;
}

export interface InteracOption {
  from: string;
  gasPrice?: string;
  gas?: number;
}
