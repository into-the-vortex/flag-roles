// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract MockAccessControl is AccessControl {
    bytes32 public constant MODERATOR = keccak256("MODERATOR");
    bytes32 public constant MINTER = keccak256("MINTER");

    constructor(address both, address minter, address moderator) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);

        _grantRole(MINTER, both);
        _grantRole(MODERATOR, both);
        _grantRole(MINTER, minter);
        _grantRole(MODERATOR, moderator);
    }

    function EnsureModerator() external onlyRole(MODERATOR) {

    }

    function EnsureMinter() external onlyRole(MINTER) {

    }

    function EnsureBoth() external onlyRole(MINTER) onlyRole(MODERATOR) {

    }
}