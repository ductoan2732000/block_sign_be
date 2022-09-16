// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
  
contract sign 
{
    // unit private countVisitor = 0;
    string private sha256SignedDocument = "";
    string private sha256OriginalDocument = "";
    address private creatorAddress;
    Visitor[] private listVisitor;

    struct Visitor {
        address guessAddress;
        string purpose;
    }
  
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
    function getOriginalDocument() public returns (string memory){
        listVisitor.push(Visitor(msg.sender, "getOriginalDocument"));
        return sha256OriginalDocument;
        
    }
    function getSignedDocument() public returns (string memory){
        listVisitor.push(Visitor(msg.sender, "getSignedDocument"));
        return sha256SignedDocument;
        
    }
    function getCreatorAddress() public returns (address){
        listVisitor.push(Visitor(msg.sender, "getCreatorAddress"));
        return creatorAddress;
    }
    function checkDocument(string memory _signedDocument, string memory _originalDocument) public returns (bool){
        listVisitor.push(Visitor(msg.sender, "checkDocument"));
        if(keccak256(abi.encodePacked((sha256SignedDocument))) == keccak256(abi.encodePacked(_signedDocument)) && keccak256(abi.encodePacked((sha256OriginalDocument))) == keccak256(abi.encodePacked(_originalDocument))) {
            return true;
        }
        else {
            return false;
        }
    }
    function getListVisitor() public returns (Visitor[] memory){
        listVisitor.push(Visitor(msg.sender, "getListVisitor"));
        return listVisitor;
    }

}