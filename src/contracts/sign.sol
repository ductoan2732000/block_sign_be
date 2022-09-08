// Solidity program to implement
// the above approach
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
  
contract sign 
{
    string public message = "Sodility ~ new smart contract";
  
    function setMessage(string memory _newMessage) public 
    {
        message = _newMessage;
    }
}