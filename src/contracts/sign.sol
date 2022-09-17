// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
  
contract sign 
{
    // unit private countVisitor = 0;
    string private sha256SignedDocument = "";
    string private sha256OriginalDocument = "";
    address private creatorAddress;

    
  
    function setHash(string memory _signedDocument, string memory _originalDocument) public 
    {
        if(keccak256(abi.encodePacked((sha256SignedDocument))) == keccak256(abi.encodePacked("")) && keccak256(abi.encodePacked((sha256OriginalDocument))) == keccak256(abi.encodePacked(""))) {
            creatorAddress = msg.sender;
        }
        if (keccak256(abi.encodePacked((sha256SignedDocument))) == keccak256(abi.encodePacked(""))) {
            sha256SignedDocument = _signedDocument;
        }
        if (keccak256(abi.encodePacked((sha256OriginalDocument))) == keccak256(abi.encodePacked(""))) {
            sha256OriginalDocument = _originalDocument;
        }
    }
    function getOriginalDocument() public view returns (string memory){
        return sha256OriginalDocument;
        
    }
    function getSignedDocument() public view returns (string memory){
        return sha256SignedDocument;
        
    }
    function getCreatorAddress() public view returns (address){
        return creatorAddress;
    }
    function checkDocument(string memory _signedDocument, string memory _originalDocument) public view returns (bool){
        if(keccak256(abi.encodePacked((sha256SignedDocument))) == keccak256(abi.encodePacked(_signedDocument)) && keccak256(abi.encodePacked((sha256OriginalDocument))) == keccak256(abi.encodePacked(_originalDocument))) {
            return true;
        }
        else {
            return false;
        }
    }

}