"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uint32SyncSafeToken = void 0;
exports.uint32SyncSafeToken = {
    get: (buffer, offset) => (buffer[offset + 3] & 0x7f) |
        (buffer[offset + 2] << 7) |
        (buffer[offset + 1] << 14) |
        (buffer[offset] << 21),
    len: 4,
};
//# sourceMappingURL=uint32-sync-safe-token.js.map