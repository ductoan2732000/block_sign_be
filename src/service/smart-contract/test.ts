// solc compiler
const solc = require('solc');

// file reader
import { readFileSync } from 'fs';

// Creation of Web3 class
const Web3 = require('web3');

export const testSmartContract = (): any => {
  const web3 = new Web3(
    new Web3.providers.HttpProvider('http://127.0.0.1:7545'),
  );
  // Reading the file
  const file = readFileSync(
    `D:\\graduation\\nestjs\\block_sign_be\\src\\smart-contract\\initial.sol`,
  ).toString();
  // console.log(file);

  // Input structure for solidity compiler
  var input = {
    language: 'Solidity',
    sources: {
      'initial.sol': {
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

  var output = JSON.parse(solc.compile(JSON.stringify(input)));
  // console.log("Result : ", output);

  const ABI = output.contracts['initial.sol']['initial'].abi;
  const bytecode =
    output.contracts['initial.sol']['initial'].evm.bytecode.object;
  // console.log("Bytecode: ", bytecode);
  // console.log("ABI: ", ABI);

  const contract = new web3.eth.Contract(ABI);
  web3.eth.getAccounts().then((accounts) => {
    // Display all Ganache Accounts
    // console.log('Accounts:', accounts);

    const mainAccount = accounts[1];

    // address that will deploy smart contract
    // console.log('Default Account:', mainAccount);
    contract
      .deploy({ data: bytecode })
      .send({ from: mainAccount, gas: 470000 })
      .on('receipt', (receipt) => {
        // Contract Address will be returned here
        // console.log('Contract Address:', receipt.contractAddress);
      })
      .then((initialContract) => {
        initialContract.methods.message().call((err, data) => {
          // console.log('Initial Data:', data);
        });
      });
  });
  return {
    bytecode: bytecode,
    contract: contract,
  };
};
