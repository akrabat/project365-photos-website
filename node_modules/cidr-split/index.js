"use strict";

const BigNumber = require("bignumber.js");
BigNumber.config(
    {
        DECIMAL_PLACES: 0
    }
);
const shift = require("./buffershift.js");
const net = require("net");

const CIDR = module.exports = function(ip, mask)
{
    if (!(ip instanceof IP))
    {
        throw new Error("Invalid CIDR IP.");
    }
    if (isNaN(parseInt(mask)))
    {
        throw new Error("Invalid CIDR mask.");
    }
    if (mask < 0)
    {
        throw new Error(`Invalid CIDR IPv${ip.version} mask.`);
    }
    if (ip.version == 4 && mask > 32)
    {
        throw new Error("Invalid CIDR IPv4 mask.");
    }
    if (ip.version == 6 && mask > 128)
    {
        throw new Error("Invalid CIDR IPv6 mask.");
    }
    this.ip = ip;
    this.mask = mask;
};

CIDR.prototype.split = function()
{
    const diff = (this.ip.version == 4 ? 32 : 128) - this.mask;
    if (diff <= 1)
    {
        throw new Error("Not enough address space to split.");
    }

    const cidr1 = new CIDR(
        new IP(Buffer.from(this.ip.buffer), this.ip.version),
        this.mask + 1
    );

    const diffBuffer = this.ip.version == 4 ? Buffer.alloc(4) : Buffer.alloc(16);
    diffBuffer[diffBuffer.length - 1] = 0x01;
    shift.shl(diffBuffer, diff - 1);
    const half = new BigNumber(`0x${diffBuffer.toString("hex")}`);
    const ip1 = new BigNumber(`0x${this.ip.buffer.toString("hex")}`);
    const ip2 = ip1.plus(half);
    let ip2Hex = ip2.toString(16);
    if (ip2Hex.length % 2 != 0)
    {
        ip2Hex = `0${ip2Hex}`;
    }
    const cidr2 = new CIDR(
        new IP(
            Buffer.from(ip2Hex, "hex"),
            this.ip.version
        ),
        this.mask + 1
    );

    return (
        [
            cidr1,
            cidr2
        ]
    );
};

CIDR.prototype.toString = function()
{
    if (this.ip.version == 6)
    {
        throw new Error("IPv6 not implemented.");
    }
    return `${this.ip.buffer.map(byte => parseInt(byte)).join(".")}/${this.mask}`;
};

CIDR.fromString = string =>
{
    let mask = /^.+\/(\d?\d?\d)$/.exec(string);
    if (!mask)
    {
        throw new Error("Invalid CIDR.");
    }
    mask = parseInt(mask[1]);
    let ip = /^(.+)\/\d?\d?\d$/.exec(string);
    if (!ip)
    {
        throw new Error("Invalid CIDR.");
    }
    ip = IP.fromString(ip[1]);
    switch (ip.version)
    {
        case 4:
            if (mask < 0 || mask > 32)
            {
                throw new Error("Invalid CIDR IPv4 mask.");
            }
            break;
        case 6:
            if (mask < 0 || mask > 128)
            {
                throw new Error("Invalid CIDR IPv6 mask.");
            }
    }
    return new CIDR(ip, mask);
};

const IP = function(buffer, version)
{
    if (version != 4 && version != 6)
    {
        throw new Error("Invalid IP version.");
    }
    if (version == 4 && buffer.length != 4)
    {
        throw new Error("Invalid IPv4 address length.");
    }
    if (version == 6 && buffer.length != 16)
    {
        throw new Error("Invalid IPv6 address length.");
    }
    this.buffer = buffer;
    this.version = version;
};

IP.fromString = s =>
{
    let buffer;
    switch (net.isIP(s))
    {
        case 0:
            throw new Error("Invalid IP address.");
        case 4:
            buffer = Buffer.alloc(4);
            s.split(/\./g).map((byte, i) =>
                {
                    buffer[i] = parseInt(byte, 10) & 0xff;
                }
            );
            return new IP(buffer, 4);
        case 6:
            // Pull request welcome :^)
            throw new Error("IPv6 not implemented.");
    }
};
