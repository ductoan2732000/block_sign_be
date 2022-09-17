import { readFileSync } from 'fs';
const Web3 = require('web3');
// import Web3 from 'web3';
const solc = require('solc');
import {
  InputContract,
  InteracOption,
  ResponseCompile,
} from '@/model/interface/contract.interface';
import { MAX_GAS, LANG_CONTRACT } from '..';

export class SmartContract {
  pathFile: string;
  fullFileName: string;
  fileName: string;
  inputToCompile: InputContract;
  responseCompile: ResponseCompile;
  contractAddress: string;
  contract: any;
  isSetHash: boolean = false;
  senderAddress: string;
  optionInterac: InteracOption;
  constructor(
    pathFile: string,
    fullFileName: string,
    fileName: string,
    sender: string,
  ) {
    this.pathFile = pathFile;
    this.fullFileName = fullFileName;
    this.fileName = fileName;
    this.senderAddress = sender;
    this.optionInterac = {
      from: sender,
      gas: MAX_GAS,
    };
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
    const initialContract = await contract
      .deploy({ data: value.bytecode })
      .send(this.optionInterac)
      .on('receipt', (receipt) => {
        contractAddress = receipt.contractAddress;
      });
    this.contractAddress = contractAddress;
    this.contract = initialContract;
  };
  getContractFromAddress = async (
    contractAddress: string,
    value: ResponseCompile = this.responseCompile,
  ) => {
    const rpcConectUrl = process.env.RPC_CONNECT_URL;
    const web3 = new Web3(new Web3.providers.HttpProvider(rpcConectUrl));
    const contract = new web3.eth.Contract(value.ABI, contractAddress);
    this.contractAddress = contractAddress;
    this.contract = contract;
  };
  setHash = async (
    _signedDocument: string,
    _originalDocument: string,
    contract: any = this.contract,
  ) => {
    let transactionHash = '';
    await contract.methods
      .setHash(_signedDocument, _originalDocument)
      .send(this.optionInterac)
      .on('transactionHash', function (hash) {
        transactionHash = hash;
      });
    this.isSetHash = true;
    return transactionHash;
  };
  checkDocument = async (
    _signedDocument: string,
    _originalDocument: string,
    contract: any = this.contract,
  ) => {
    let res: boolean = null;
    await contract.methods
      .checkDocument(_signedDocument, _originalDocument)
      .call(this.optionInterac, (err, data) => {
        res = data;
      });
    return res;
  };
  getSignedDocument = async (contract: any = this.contract) => {
    let res: string = '';
    await contract.methods
      .getSignedDocument()
      .call(this.optionInterac, (err, data) => {
        res = data;
      });
    return res;
  };
  getOriginalDocument = async (contract: any = this.contract) => {
    let res: string = '';
    await contract.methods
      .getOriginalDocument()
      .call(this.optionInterac, (err, data) => {
        res = data;
      });
    return res;
  };
  getCreatorAddress = async (contract: any = this.contract) => {
    let res = '';
    await contract.methods
      .getCreatorAddress()
      .call(this.optionInterac, (err, data) => {
        res = data;
      });
    return res;
  };
}
