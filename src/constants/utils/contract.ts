import { readFileSync } from 'fs';
const Web3 = require('web3');
const solc = require('solc');
import {
  InputContract,
  ResponseCompile,
} from '@/model/interface/contract.interface';
import { DEFAULT_ACCOUNT, MAX_GAS, LANG_CONTRACT } from '..';

export const createInput = (
  pathFile: string,
  fileName: string,
): InputContract | any => {
  try {
    const file = readFileSync(pathFile).toString();
    const input: InputContract = {
      language: LANG_CONTRACT,
      sources: {
        [fileName]: {
          content: file,
        },
      },

      settings: {
        outputSelection: {
          '*': {
            '*': ['*'],
          },
        },
      },
    };
    return input;
  } catch (error) {
    return error;
  }
};
export const compileContract = (
  inputContract: InputContract,
  fullFileName: string,
  fileName: string,
) => {
  var output = JSON.parse(solc.compile(JSON.stringify(inputContract)));

  const ABI = output.contracts[fullFileName][fileName].abi;
  const bytecode = output.contracts[fullFileName][fileName].evm.bytecode.object;
  return {
    ABI: ABI,
    bytecode: bytecode,
  } as ResponseCompile;
};
export const createContract = async (
  value: ResponseCompile,
  _signedDocument: string,
  _originalDocument: string,
) => {
  let contractAddress: string = '';
  let res: any = null;
  const rpcConectUrl = process.env.RPC_CONNECT_URL;
  const web3 = new Web3(new Web3.providers.HttpProvider(rpcConectUrl));
  const contract = new web3.eth.Contract(value.ABI);
  const accounts = await web3.eth.getAccounts();
  const mainAccount = accounts[DEFAULT_ACCOUNT];
  const initialContract = await contract
    .deploy({ data: value.bytecode })
    .send({ from: mainAccount, gas: MAX_GAS })
    .on('receipt', (receipt) => {
      contractAddress = receipt.contractAddress;
    });
  await initialContract.methods
    .setHash(_signedDocument, _originalDocument)
    .call((err, data) => {});
  return contractAddress;
};

export class SmartContract {
  pathFile: string;
  fullFileName: string;
  fileName: string;
  inputToCompile: InputContract;
  responseCompile: ResponseCompile;
  contractAddress: string;
  contract: any;
  isSetHash: boolean = false;
  constructor(pathFile: string, fullFileName: string, fileName: string) {
    this.pathFile = pathFile;
    this.fullFileName = fullFileName;
    this.fileName = fileName;
  }
  createInput = (
    pathFile: string = this.pathFile,
    fileName: string = this.fullFileName,
  ): InputContract | any => {
    try {
      const file = readFileSync(pathFile).toString();
      const input: InputContract = {
        language: LANG_CONTRACT,
        sources: {
          [fileName]: {
            content: file,
          },
        },

        settings: {
          outputSelection: {
            '*': {
              '*': ['*'],
            },
          },
        },
      };
      this.inputToCompile = input;
    } catch (error) {
      console.log(error);
    }
  };
  compileContract = (
    inputContract: InputContract = this.inputToCompile,
    fullFileName: string = this.fullFileName,
    fileName: string = this.fileName,
  ) => {
    var output = JSON.parse(solc.compile(JSON.stringify(inputContract)));

    const ABI = output.contracts[fullFileName][fileName].abi;
    const bytecode =
      output.contracts[fullFileName][fileName].evm.bytecode.object;
    const res = {
      ABI: ABI,
      bytecode: bytecode,
    } as ResponseCompile;
    this.responseCompile = res;
  };
  createContract = async (value: ResponseCompile = this.responseCompile) => {
    let contractAddress: string = '';
    const rpcConectUrl = process.env.RPC_CONNECT_URL;
    const web3 = new Web3(new Web3.providers.HttpProvider(rpcConectUrl));
    const contract = new web3.eth.Contract(value.ABI);
    const accounts = await web3.eth.getAccounts();
    const mainAccount = accounts[DEFAULT_ACCOUNT];
    const initialContract = await contract
      .deploy({ data: value.bytecode })
      .send({ from: mainAccount, gas: MAX_GAS })
      .on('receipt', (receipt) => {
        contractAddress = receipt.contractAddress;
      });
    this.contractAddress = contractAddress;
    this.contract = initialContract;
  };
  setHash = async (
    _signedDocument: string,
    _originalDocument: string,
    contract: any = this.contract,
  ) => {
    await contract.methods
      .setHash(_signedDocument, _originalDocument)
      .call((err, data) => {});
    this.isSetHash = true;
  };
}
