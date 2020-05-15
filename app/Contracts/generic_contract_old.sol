pragma solidity ^0.6.1;


contract Docs {
    struct Doc {
        uint256 id;
        bytes32 signature;
        bytes32 identity;
    }

    string private razao_social;
    string private cnpj;

    Doc[] private DocsList;

    constructor(string memory input_cnpj, string memory input_razao_social)
        public
    {
        cnpj = input_cnpj;
        razao_social = input_razao_social;
    }

    function getEnterpriseInfo()
        public
        view
        returns (string memory, string memory)
    {
        return (razao_social, cnpj);
    }

    function getDocsCount() public view returns (uint256) {
        return DocsList.length;
    }

    function getDoc(bytes32 _signature) public view returns (bytes32) {
        bytes32 res;
        for (uint256 i = 0; i < DocsList.length; i++) {
            if (DocsList[i].signature == _signature) {
                res = DocsList[i].identity;
            }
        }
        return res;
    }

    function addDocument(bytes32 _signature, bytes32 _identity) public {
        Doc memory newDoc = Doc(DocsList.length, _signature, _identity);
        DocsList.push(newDoc);
    }

    function listDocuments()
        public
        view
        returns (bytes32[] memory, bytes32[] memory)
    {
        bytes32[] memory sigArr = new bytes32[](DocsList.length);
        bytes32[] memory ideArr = new bytes32[](DocsList.length);

        uint256 arrayLength = DocsList.length;
        for (uint256 i = 0; i < arrayLength; i++) {
            sigArr[i] = DocsList[i].signature;
            ideArr[i] = DocsList[i].identity;
        }
        return (sigArr, ideArr);
    }

    function findDocument(bytes32 _signature)
        public
        view
        returns (uint256 id, bytes32 signature)
    {
        uint256 resId = 0;
        bytes32 resSignature = "";

        uint256 arrayLength = DocsList.length;
        for (uint256 i = 0; i < arrayLength; i++) {
            if (_signature == DocsList[i].signature) {
                resId = DocsList[i].id;
                resSignature = DocsList[i].signature;
            }
        }
        return (resId, resSignature);
    }
}
