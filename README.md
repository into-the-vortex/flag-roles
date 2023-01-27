# FlagRoles

[![NPM Package](https://img.shields.io/npm/v/@builtbyfrancis/flagroles.svg)](https://www.npmjs.org/package/@builtbyfrancis/flagroles)
[![CI](https://img.shields.io/github/actions/workflow/status/into-the-vortex/flag-roles/ci.yml?label=build&=main)](https://github.com/into-the-vortex/flag-roles/actions/workflows/ci.yml)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/into-the-vortex/flag-roles/blob/main/LICENSE)

## About the Project

Gas optimized and simplified version of OpenZeppelin's AccessControl for roles.

## Features

- Gas Optimised and Simplified

- Grant and Revoke roles as the contract Owner

- Allow a single address to simultaneously hold up to 256 roles

## Installation

To install with [**Hardhat**](https://github.com/nomiclabs/hardhat) or [**Truffle**](https://github.com/trufflesuite/truffle):

```sh
npm install @builtbyfrancis/flagroles
```

## API

### `onlyRole`

```solidity
modifier onlyRole(uint256 role)
```

Modifier to guard a function and revert if `msg.sender` does not have the role.

### `grantRole`

```solidity
function grantRole(uint256 role, address account) public onlyOwner
```

At the end of this function `account` will have the role(s) within `role` regardless of the current state.

### `revokeRole`

```solidity
function revokeRole(uint256 role, address account) public onlyOwner
```

At the end of this function `account` will NOT have the role(s) within `role` regardless of the current state.

### `hasRole`

```solidity
function hasRole(uint256 role, address account) public view returns (bool)
```

Returns `true` if account has the role(s) within `role` otherwise `false`

## Safety

This codebase has undergone rigorous testing and includes a full suite of unit tests.

Nevertheless, this codebase is provided on an "as is" and "as available" basis.

We **do not give any warranties** and **will not be liable for any loss** incurred through any use of this codebase.

## Acknowledgements

This repository is inspired by and depends on:

- [openzeppelin-contracts](https://github.com/OpenZeppelin/openzeppelin-contracts)
