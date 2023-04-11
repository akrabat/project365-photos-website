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
