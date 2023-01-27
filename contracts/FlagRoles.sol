// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract FlagRoles is Ownable {
    error IncorrectRoleError();

    mapping(address => uint256) private _roles;

    modifier onlyRole(uint256 role) {
        if (!hasRole(role, _msgSender())) revert IncorrectRoleError();
        _;
    }

    function grantRole(uint256 role, address account) public onlyOwner {
        _roles[account] |= role;
    }

    function revokeRole(uint256 role, address account) public onlyOwner {
        _roles[account] &= ~role;
    }

    function hasRole(uint256 role, address account) public view returns (bool) {
        return _roles[account] & role == role;
    }
}
