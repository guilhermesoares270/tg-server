pragma solidity ^0.6.1;


contract Docs {
    struct Doc {
        uint256 id;
        bytes32 signature;
        bytes32 cpf;
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

    function addDocument(bytes32 _signature, bytes32 _cpf) public {
        Doc memory newDoc = Doc(DocsList.length, _signature, _cpf);
        DocsList.push(newDoc);
    }

    function listDocuments()
        public
        view
        returns (bytes32[] memory, bytes32[] memory)
    {
        bytes32[] memory sigArr = new bytes32[](DocsList.length);
        bytes32[] memory cpfArr = new bytes32[](DocsList.length);

        uint256 arrayLength = DocsList.length;
        for (uint256 i = 0; i < arrayLength; i++) {
            sigArr[i] = DocsList[i].signature;
            cpfArr[i] = DocsList[i].cpf;
        }
        return (sigArr, cpfArr);
    }

    function validateDocument(bytes32 _signature) public view returns (bool) {
        uint256 arrayLength = DocsList.length;
        for (uint256 i = 0; i < arrayLength; i++) {
            if (_signature == DocsList[i].signature) {
                return true;
            }
        }
        return false;
    }

    function getDocument(bytes32 _signature) public view returns (bytes32) {
        uint256 arrayLength = DocsList.length;
        for (uint256 i = 0; i < arrayLength; i++) {
            if (_signature == DocsList[i].signature) {
                return DocsList[i].cpf;
            }
        }
        return "";
    }
}
