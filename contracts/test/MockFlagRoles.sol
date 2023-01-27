// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../FlagRoles.sol";

contract MockFlagRoles is FlagRoles {

    uint256 public constant MODERATOR = 1; // ...0001
    uint256 public constant MINTER = 2;    // ...0010
    uint256 public constant BOTH = 3;      // ...0011

    constructor(address both, address minter, address moderator) {
        grantRole(BOTH, both);
        grantRole(MINTER, minter);
        grantRole(MODERATOR, moderator);
    }

    function EnsureModerator() external onlyRole(MODERATOR) {

    }

    function EnsureMinter() external onlyRole(MINTER) {

    }

    function EnsureBoth() external onlyRole(BOTH) {

    }
}