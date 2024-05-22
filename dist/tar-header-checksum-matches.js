"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tarHeaderChecksumMatches = void 0;
function tarHeaderChecksumMatches(buffer, offset = 0) {
    const readSum = Number.parseInt(buffer.toString("utf8", 148, 154).replace(/\0.*$/, "").trim(), 8);
    if (Number.isNaN(readSum)) {
        return false;
    }
    let sum = 8 * 0x20;
    for (let i = offset; i < offset + 148; i++) {
        sum += buffer[i];
    }
    for (let i = offset + 156; i < offset + 512; i++) {
        sum += buffer[i];
    }
    return readSum === sum;
}
exports.tarHeaderChecksumMatches = tarHeaderChecksumMatches;
//# sourceMappingURL=tar-header-checksum-matches.js.map