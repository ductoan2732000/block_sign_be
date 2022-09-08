import { readFileSync } from 'fs';
const Web3 = require('web3');
const solc = require('solc');
import {
  InputContract,
  ResponseCompile,
} from '@/model/interface/contract.interface';
import { DEFAULT_ACCOUNT, GAS, LANG_CONTRACT } from '..';

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
export const createContract = async (value: ResponseCompile) => {
  let res: any = 'err';
  const rpcConectUrl = process.env.RPC_CONNECT_URL;
  const web3 = new Web3(new Web3.providers.HttpProvider(`${rpcConectUrl}`));
  const contract = new web3.eth.Contract(value.ABI);
  const accounts = await web3.eth.getAccounts();
  const mainAccount = accounts[DEFAULT_ACCOUNT];
  console.log(
    '🚀 ~ file: contract.ts ~ line 57 ~ createContract ~ mainAccount',
    mainAccount,
  );
  const initialContract = await contract
    .deploy({ data: value.bytecode })
    .send({ from: mainAccount, gas: GAS })
    .on('receipt', (receipt) => {
      console.log('Contract Address:', receipt.contractAddress);
    });
  await initialContract.methods.message().call((err, data) => {
    console.log(
      '🚀 ~ file: contract.ts ~ line 66 ~ initialContract.methods.message ~ data',
      data,
    );
    res = data.toString();
  });
  return res;
};
