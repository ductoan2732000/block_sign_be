export interface InputContract {
  language: string;
  sources: any;
  settings: {
    outputSelection: any;
  };
}
export interface ResponseCompile {
  ABI: any;
  bytecode: string;
}
