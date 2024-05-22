"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
const file_type_from_buffer_1 = require("./file-type-from-buffer");
__exportStar(require("./check"), exports);
__exportStar(require("./file-type-from-buffer"), exports);
__exportStar(require("./file-type-from-tokenizer"), exports);
__exportStar(require("./file-type-parser"), exports);
__exportStar(require("./file-type-from-file"), exports);
__exportStar(require("./file-type.interface"), exports);
__exportStar(require("./string-to-bytes"), exports);
__exportStar(require("./tar-header-checksum-matches"), exports);
__exportStar(require("./uint32-sync-safe-token"), exports);
exports.default = file_type_from_buffer_1.fileTypeFromBuffer;
//# sourceMappingURL=index.js.map