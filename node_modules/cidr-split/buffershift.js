/*@flow*/
'use strict';

/*
Inline copy of https://github.com/cjdelisle/buffershift/blob/ac08e183e81ed6770dceca0a3d653a2944035b10/index.js
in order not to include vulnerable dev dependencies in buffershift@0.0.2 package.
*/

const shl = module.exports.shl = (buf /*:Buffer*/, shiftBits /*:number*/) => {
    if (shiftBits < 0) { return module.exports.shr(buf, -shiftBits); }
    if (shiftBits !== (shiftBits | 0)) { throw new Error("shiftBits must be a 32 bit int"); }
    const bytes = 2 * ((shiftBits >> 4) + ((shiftBits & 15) !== 0));
    const bits = (bytes * 8) - shiftBits;
    for (let reg = 0, i = 0; i - bytes < buf.length; i += 2) {
        reg <<= 16;
        if (i < buf.length - 1) {
            reg |= buf.readUInt16BE(i);
        } else if (i < buf.length) {
            reg |= buf[i] << 8;
        }
        if (i - bytes >= 0) {
            if (i - bytes < buf.length - 1) {
                buf.writeUInt16BE((reg >>> bits) & 0xffff, i - bytes);
            } else {
                if (i - bytes !== buf.length - 1) { throw new Error(); }
                buf[i - bytes] = reg >>> (bits + 8);
            }
        } else if (i - bytes === -1) {
            buf[0] = reg >>> bits;
        }
    }
};

const shr = module.exports.shr = (buf /*:Buffer*/, shiftBits /*:number*/) => {
    if (shiftBits < 0) { return shl(buf, -shiftBits); }
    if (shiftBits !== (shiftBits | 0)) { throw new Error("shiftBits must be a 32 bit int"); }
    const bytes = 2 * ((shiftBits >> 4) + ((shiftBits & 15) !== 0));
    const bits = 16 - ((bytes * 8) - shiftBits);
    for (let reg = 0, i = buf.length - 2; i + bytes >= -1; i -= 2) {
        reg >>>= 16;
        if (i >= 0) {
            reg |= buf.readUInt16BE(i) << 16;
        } else if (i === -1) {
            reg |= buf[0] << 16;
        }
        if (i + bytes + 1 < buf.length) {
            if (i + bytes >= 0) {
                buf.writeUInt16BE((reg >>> bits) & 0xffff, i + bytes);
            } else {
                if (i + bytes + 1) { throw new Error(); }
                buf[0] = reg >>> bits;
            }
        } else if (i + bytes + 1 === buf.length) {
            buf[i + bytes] = reg >>> (bits + 8);
        }
    }
};
