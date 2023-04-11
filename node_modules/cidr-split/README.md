# cidr-split

_Stability: 1 - [Experimental](https://github.com/tristanls/stability-index#stability-1---experimental)_

[![NPM version](https://badge.fury.io/js/cidr-split.png)](http://npmjs.org/package/cidr-split)

Split facility for CIDRs.

## Contributors

[@tristanls](https://github.com/tristanls)

## Contents

  * [Installation](#installation)
  * [Usage](#usage)
  * [Tests](#tests)
  * [Documentation](#documentation)
    * [CIDR](#cidr)
  * [Releases](#releases)

## Installation

    npm install cidr-split

## Usage

To run the below example, run:

    npm run readme

```javascript
"use strict";

const CIDR = require("../index.js");

console.log("Split 10.0.0.0/16 into two and print out");
CIDR.fromString("10.0.0.0/16").split().map(cidr => console.log(cidr.toString()));

console.log("Split 10.0.0.0/16 into four and print out");
CIDR.fromString("10.0.0.0/16")
    .split()
    .map(cidr => cidr.split())
    .reduce((all, halves) => all.concat(...halves))
    .map(cidr => console.log(cidr.toString()));

```

## Tests

No tests at this time.

## Documentation

  * [CIDR](#cidr)

### CIDR

**Public API**

  * [CIDR.fromString(cidr)](#cidrfromstringcidr)
  * [cidr.split()](#cidrsplit)

### CIDR.fromString(cidr)

  * `cidr`: _String_ String representation of a CIDR, ex: `10.0.0.0/16`
  * Return: _CIDR_ CIDR created from the string.

Parses `cidr` string and creates a `CIDR` object.

### cidr.split()

  * Retrun: _Array_ Array of two CIDRs, each being one half of the `cidr`.

If possible, splits the `cidr` into two CIDRs that are half the size.

## Releases

We follow semantic versioning policy (see: [semver.org](http://semver.org/)):

> Given a version number MAJOR.MINOR.PATCH, increment the:
>
>MAJOR version when you make incompatible API changes,<br/>
>MINOR version when you add functionality in a backwards-compatible manner, and<br/>
>PATCH version when you make backwards-compatible bug fixes.

**caveat**: Major version zero is a special case indicating development version that may make incompatible API changes without incrementing MAJOR version.
