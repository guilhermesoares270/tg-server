pragma solidity ^0.5.10;

contract Docs {

    struct Doc {
        uint id;
        bytes32 signature;
        bytes32 identity;
    }
    
    Doc[] private DocsList;

    constructor () public {
        addDocument("123", "321");
        addDocument("456", "654");
    }

    function addToList() public {
        addDocument('aaa', 'bbb');
    }
    
    function getDocsCount () public view returns (uint) {
        return DocsList.length;
    }
    
    function getDoc(bytes32 _signature) public view returns (bytes32) {
        bytes32 res;
        for (uint i = 0; i < DocsList.length; i++) {
            if (DocsList[i].signature == _signature) {
                res = DocsList[i].identity;
            }
        }
        return res;
    }
    
    function addDocument(bytes32  _signature, bytes32  _identity) public {
        Doc memory newDoc = Doc(DocsList.length, _signature, _identity);
        DocsList.push(newDoc);
    }
    
    function listDocuments () public view returns (bytes32[] memory, bytes32[] memory) {
        bytes32[] memory sigArr = new bytes32[](DocsList.length);
        bytes32[] memory ideArr = new bytes32[](DocsList.length);
        
        uint arrayLength = DocsList.length;
        for (uint i = 0; i < arrayLength; i++) {
            sigArr[i] = DocsList[i].signature;
            ideArr[i] = DocsList[i].identity;
        }
        return (sigArr, ideArr);
    }
}