"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._check = void 0;
function _check(buffer, headers, options) {
    options = Object.assign({ offset: 0 }, options);
    for (const [index, header] of headers.entries()) {
        if (options.mask) {
            if (header !== (options.mask[index] & buffer[index + options.offset])) {
                return false;
            }
        }
        else if (header !== buffer[index + options.offset]) {
            return false;
        }
    }
    return true;
}
exports._check = _check;
//# sourceMappingURL=check.js.map