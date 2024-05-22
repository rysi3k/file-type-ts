"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringToBytes = void 0;
function stringToBytes(string) {
    return [...string].map((character) => character.charCodeAt(0));
}
exports.stringToBytes = stringToBytes;
//# sourceMappingURL=string-to-bytes.js.map