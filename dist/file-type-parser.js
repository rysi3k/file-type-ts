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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileTypeParser = void 0;
const node_buffer_1 = require("node:buffer");
const check_1 = require("./check");
const string_to_bytes_1 = require("./string-to-bytes");
const Token = __importStar(require("token-types"));
const strtok3 = __importStar(require("strtok3"));
const uint32_sync_safe_token_1 = require("./uint32-sync-safe-token");
const tar_header_checksum_matches_1 = require("./tar-header-checksum-matches");
const _1 = require(".");
const minimumBytes = 4100;
class FileTypeParser {
    check(header, options) {
        return (0, check_1._check)(this.buffer, header, options);
    }
    checkString(header, options) {
        return this.check((0, string_to_bytes_1.stringToBytes)(header), options);
    }
    async parse(tokenizer) {
        this.buffer = node_buffer_1.Buffer.alloc(minimumBytes);
        if (tokenizer.fileInfo.size === undefined) {
            tokenizer.fileInfo.size = Number.MAX_SAFE_INTEGER;
        }
        if (tokenizer.fileInfo.size === undefined) {
            tokenizer.fileInfo.size = Number.MAX_SAFE_INTEGER;
        }
        this.tokenizer = tokenizer;
        await tokenizer.peekBuffer(this.buffer, { length: 12, mayBeLess: true });
        if (this.check([0x42, 0x4d])) {
            return {
                ext: "bmp",
                mime: "image/bmp",
            };
        }
        if (this.check([0x0b, 0x77])) {
            return {
                ext: "ac3",
                mime: "audio/vnd.dolby.dd-raw",
            };
        }
        if (this.check([0x78, 0x01])) {
            return {
                ext: "dmg",
                mime: "application/x-apple-diskimage",
            };
        }
        if (this.check([0x4d, 0x5a])) {
            return {
                ext: "exe",
                mime: "application/x-msdownload",
            };
        }
        if (this.check([0x25, 0x21])) {
            await tokenizer.peekBuffer(this.buffer, { length: 24, mayBeLess: true });
            if (this.checkString("PS-Adobe-", { offset: 2 }) &&
                this.checkString(" EPSF-", { offset: 14 })) {
                return {
                    ext: "eps",
                    mime: "application/eps",
                };
            }
            return {
                ext: "ps",
                mime: "application/postscript",
            };
        }
        if (this.check([0x1f, 0xa0]) || this.check([0x1f, 0x9d])) {
            return {
                ext: "Z",
                mime: "application/x-compress",
            };
        }
        if (this.check([0x47, 0x49, 0x46])) {
            return {
                ext: "gif",
                mime: "image/gif",
            };
        }
        if (this.check([0xff, 0xd8, 0xff])) {
            return {
                ext: "jpg",
                mime: "image/jpeg",
            };
        }
        if (this.check([0x49, 0x49, 0xbc])) {
            return {
                ext: "jxr",
                mime: "image/vnd.ms-photo",
            };
        }
        if (this.check([0x1f, 0x8b, 0x8])) {
            return {
                ext: "gz",
                mime: "application/gzip",
            };
        }
        if (this.check([0x42, 0x5a, 0x68])) {
            return {
                ext: "bz2",
                mime: "application/x-bzip2",
            };
        }
        if (this.checkString("ID3")) {
            await tokenizer.ignore(6);
            const id3HeaderLength = await tokenizer.readToken(uint32_sync_safe_token_1.uint32SyncSafeToken);
            if (tokenizer.position + id3HeaderLength > tokenizer.fileInfo.size) {
                return {
                    ext: "mp3",
                    mime: "audio/mpeg",
                };
            }
            await tokenizer.ignore(id3HeaderLength);
            return (0, _1.fileTypeFromTokenizer)(tokenizer);
        }
        if (this.checkString("MP+")) {
            return {
                ext: "mpc",
                mime: "audio/x-musepack",
            };
        }
        if ((this.buffer[0] === 0x43 || this.buffer[0] === 0x46) &&
            this.check([0x57, 0x53], { offset: 1 })) {
            return {
                ext: "swf",
                mime: "application/x-shockwave-flash",
            };
        }
        if (this.checkString("FLIF")) {
            return {
                ext: "flif",
                mime: "image/flif",
            };
        }
        if (this.checkString("8BPS")) {
            return {
                ext: "psd",
                mime: "image/vnd.adobe.photoshop",
            };
        }
        if (this.checkString("WEBP", { offset: 8 })) {
            return {
                ext: "webp",
                mime: "image/webp",
            };
        }
        if (this.checkString("MPCK")) {
            return {
                ext: "mpc",
                mime: "audio/x-musepack",
            };
        }
        if (this.checkString("FORM")) {
            return {
                ext: "aif",
                mime: "audio/aiff",
            };
        }
        if (this.checkString("icns", { offset: 0 })) {
            return {
                ext: "icns",
                mime: "image/icns",
            };
        }
        if (this.check([0x50, 0x4b, 0x3, 0x4])) {
            try {
                while (tokenizer.position + 30 < tokenizer.fileInfo.size) {
                    await tokenizer.readBuffer(this.buffer, { length: 30 });
                    const zipHeader = {
                        filename: "",
                        compressedSize: this.buffer.readUInt32LE(18),
                        uncompressedSize: this.buffer.readUInt32LE(22),
                        filenameLength: this.buffer.readUInt16LE(26),
                        extraFieldLength: this.buffer.readUInt16LE(28),
                    };
                    zipHeader.filename = await tokenizer.readToken(new Token.StringType(zipHeader.filenameLength, "utf-8"));
                    await tokenizer.ignore(zipHeader.extraFieldLength);
                    if (zipHeader.filename === "META-INF/mozilla.rsa") {
                        return {
                            ext: "xpi",
                            mime: "application/x-xpinstall",
                        };
                    }
                    if (zipHeader.filename.endsWith(".rels") ||
                        zipHeader.filename.endsWith(".xml")) {
                        const type = zipHeader.filename.split("/")[0];
                        switch (type) {
                            case "_rels":
                                break;
                            case "word":
                                return {
                                    ext: "docx",
                                    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                };
                            case "ppt":
                                return {
                                    ext: "pptx",
                                    mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                                };
                            case "xl":
                                return {
                                    ext: "xlsx",
                                    mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                };
                            default:
                                break;
                        }
                    }
                    if (zipHeader.filename.startsWith("xl/")) {
                        return {
                            ext: "xlsx",
                            mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        };
                    }
                    if (zipHeader.filename.startsWith("3D/") &&
                        zipHeader.filename.endsWith(".model")) {
                        return {
                            ext: "3mf",
                            mime: "model/3mf",
                        };
                    }
                    if (zipHeader.filename === "mimetype" &&
                        zipHeader.compressedSize === zipHeader.uncompressedSize) {
                        const mimeType = await tokenizer.readToken(new Token.StringType(zipHeader.compressedSize, "utf-8"));
                        switch (mimeType) {
                            case "application/epub+zip":
                                return {
                                    ext: "epub",
                                    mime: "application/epub+zip",
                                };
                            case "application/vnd.oasis.opendocument.text":
                                return {
                                    ext: "odt",
                                    mime: "application/vnd.oasis.opendocument.text",
                                };
                            case "application/vnd.oasis.opendocument.spreadsheet":
                                return {
                                    ext: "ods",
                                    mime: "application/vnd.oasis.opendocument.spreadsheet",
                                };
                            case "application/vnd.oasis.opendocument.presentation":
                                return {
                                    ext: "odp",
                                    mime: "application/vnd.oasis.opendocument.presentation",
                                };
                            default:
                        }
                    }
                    if (zipHeader.compressedSize === 0) {
                        let nextHeaderIndex = -1;
                        while (nextHeaderIndex < 0 &&
                            tokenizer.position < tokenizer.fileInfo.size) {
                            await tokenizer.peekBuffer(this.buffer, { mayBeLess: true });
                            nextHeaderIndex = this.buffer.indexOf("504B0304", 0, "hex");
                            await tokenizer.ignore(nextHeaderIndex >= 0 ? nextHeaderIndex : this.buffer.length);
                        }
                    }
                    else {
                        await tokenizer.ignore(zipHeader.compressedSize);
                    }
                }
            }
            catch (error) {
                if (!(error instanceof strtok3.EndOfStreamError)) {
                    throw error;
                }
            }
            return {
                ext: "zip",
                mime: "application/zip",
            };
        }
        if (this.checkString("OggS")) {
            await tokenizer.ignore(28);
            const type = node_buffer_1.Buffer.alloc(8);
            await tokenizer.readBuffer(type);
            if ((0, check_1._check)(type, [0x4f, 0x70, 0x75, 0x73, 0x48, 0x65, 0x61, 0x64])) {
                return {
                    ext: "opus",
                    mime: "audio/opus",
                };
            }
            if ((0, check_1._check)(type, [0x80, 0x74, 0x68, 0x65, 0x6f, 0x72, 0x61])) {
                return {
                    ext: "ogv",
                    mime: "video/ogg",
                };
            }
            if ((0, check_1._check)(type, [0x01, 0x76, 0x69, 0x64, 0x65, 0x6f, 0x00])) {
                return {
                    ext: "ogm",
                    mime: "video/ogg",
                };
            }
            if ((0, check_1._check)(type, [0x7f, 0x46, 0x4c, 0x41, 0x43])) {
                return {
                    ext: "oga",
                    mime: "audio/ogg",
                };
            }
            if ((0, check_1._check)(type, [0x53, 0x70, 0x65, 0x65, 0x78, 0x20, 0x20])) {
                return {
                    ext: "spx",
                    mime: "audio/ogg",
                };
            }
            if ((0, check_1._check)(type, [0x01, 0x76, 0x6f, 0x72, 0x62, 0x69, 0x73])) {
                return {
                    ext: "ogg",
                    mime: "audio/ogg",
                };
            }
            return {
                ext: "ogx",
                mime: "application/ogg",
            };
        }
        if (this.check([0x50, 0x4b]) &&
            (this.buffer[2] === 0x3 ||
                this.buffer[2] === 0x5 ||
                this.buffer[2] === 0x7) &&
            (this.buffer[3] === 0x4 ||
                this.buffer[3] === 0x6 ||
                this.buffer[3] === 0x8)) {
            return {
                ext: "zip",
                mime: "application/zip",
            };
        }
        if (this.checkString("ftyp", { offset: 4 }) &&
            (this.buffer[8] & 0x60) !== 0x00) {
            const brandMajor = this.buffer
                .toString("binary", 8, 12)
                .replace("\0", " ")
                .trim();
            switch (brandMajor) {
                case "avif":
                case "avis":
                    return { ext: "avif", mime: "image/avif" };
                case "mif1":
                    return { ext: "heic", mime: "image/heif" };
                case "msf1":
                    return { ext: "heic", mime: "image/heif-sequence" };
                case "heic":
                case "heix":
                    return { ext: "heic", mime: "image/heic" };
                case "hevc":
                case "hevx":
                    return { ext: "heic", mime: "image/heic-sequence" };
                case "qt":
                    return { ext: "mov", mime: "video/quicktime" };
                case "M4V":
                case "M4VH":
                case "M4VP":
                    return { ext: "m4v", mime: "video/x-m4v" };
                case "M4P":
                    return { ext: "m4p", mime: "video/mp4" };
                case "M4B":
                    return { ext: "m4b", mime: "audio/mp4" };
                case "M4A":
                    return { ext: "m4a", mime: "audio/x-m4a" };
                case "F4V":
                    return { ext: "f4v", mime: "video/mp4" };
                case "F4P":
                    return { ext: "f4p", mime: "video/mp4" };
                case "F4A":
                    return { ext: "f4a", mime: "audio/mp4" };
                case "F4B":
                    return { ext: "f4b", mime: "audio/mp4" };
                case "crx":
                    return { ext: "cr3", mime: "image/x-canon-cr3" };
                default:
                    if (brandMajor.startsWith("3g")) {
                        if (brandMajor.startsWith("3g2")) {
                            return { ext: "3g2", mime: "video/3gpp2" };
                        }
                        return { ext: "3gp", mime: "video/3gpp" };
                    }
                    return { ext: "mp4", mime: "video/mp4" };
            }
        }
        if (this.checkString("MThd")) {
            return {
                ext: "mid",
                mime: "audio/midi",
            };
        }
        if (this.checkString("wOFF") &&
            (this.check([0x00, 0x01, 0x00, 0x00], { offset: 4 }) ||
                this.checkString("OTTO", { offset: 4 }))) {
            return {
                ext: "woff",
                mime: "font/woff",
            };
        }
        if (this.checkString("wOF2") &&
            (this.check([0x00, 0x01, 0x00, 0x00], { offset: 4 }) ||
                this.checkString("OTTO", { offset: 4 }))) {
            return {
                ext: "woff2",
                mime: "font/woff2",
            };
        }
        if (this.check([0xd4, 0xc3, 0xb2, 0xa1]) ||
            this.check([0xa1, 0xb2, 0xc3, 0xd4])) {
            return {
                ext: "pcap",
                mime: "application/vnd.tcpdump.pcap",
            };
        }
        if (this.checkString("DSD ")) {
            return {
                ext: "dsf",
                mime: "audio/x-dsf",
            };
        }
        if (this.checkString("LZIP")) {
            return {
                ext: "lz",
                mime: "application/x-lzip",
            };
        }
        if (this.checkString("fLaC")) {
            return {
                ext: "flac",
                mime: "audio/x-flac",
            };
        }
        if (this.check([0x42, 0x50, 0x47, 0xfb])) {
            return {
                ext: "bpg",
                mime: "image/bpg",
            };
        }
        if (this.checkString("wvpk")) {
            return {
                ext: "wv",
                mime: "audio/wavpack",
            };
        }
        if (this.checkString("%PDF")) {
            await tokenizer.ignore(1350);
            const maxBufferSize = 10 * 1024 * 1024;
            const buffer = node_buffer_1.Buffer.alloc(Math.min(maxBufferSize, tokenizer.fileInfo.size));
            await tokenizer.readBuffer(buffer, { mayBeLess: true });
            if (buffer.includes(node_buffer_1.Buffer.from("AIPrivateData"))) {
                return {
                    ext: "ai",
                    mime: "application/postscript",
                };
            }
            return {
                ext: "pdf",
                mime: "application/pdf",
            };
        }
        if (this.check([0x00, 0x61, 0x73, 0x6d])) {
            return {
                ext: "wasm",
                mime: "application/wasm",
            };
        }
        if (this.check([0x49, 0x49])) {
            const fileType = await this.readTiffHeader(false);
            if (fileType) {
                return fileType;
            }
        }
        if (this.check([0x4d, 0x4d])) {
            const fileType = await this.readTiffHeader(true);
            if (fileType) {
                return fileType;
            }
        }
        if (this.checkString("MAC ")) {
            return {
                ext: "ape",
                mime: "audio/ape",
            };
        }
        if (this.check([0x1a, 0x45, 0xdf, 0xa3])) {
            async function readField() {
                const msb = await tokenizer.peekNumber(Token.UINT8);
                let mask = 0x80;
                let ic = 0;
                while ((msb & mask) === 0) {
                    ++ic;
                    mask >>= 1;
                }
                const id = node_buffer_1.Buffer.alloc(ic + 1);
                await tokenizer.readBuffer(id);
                return id;
            }
            async function readElement() {
                const id = await readField();
                const lengthField = await readField();
                lengthField[0] ^= 0x80 >> (lengthField.length - 1);
                const nrLength = Math.min(6, lengthField.length);
                return {
                    id: id.readUIntBE(0, id.length),
                    len: lengthField.readUIntBE(lengthField.length - nrLength, nrLength),
                };
            }
            async function readChildren(_level, children) {
                while (children > 0) {
                    const element = await readElement();
                    if (element.id === 17026) {
                        const rawValue = await tokenizer.readToken(new Token.StringType(element.len, "utf-8"));
                        return rawValue.replace(/\00.*$/g, "");
                    }
                    await tokenizer.ignore(element.len);
                    --children;
                }
            }
            const re = await readElement();
            const docType = await readChildren(1, re.len);
            switch (docType) {
                case "webm":
                    return {
                        ext: "webm",
                        mime: "video/webm",
                    };
                case "matroska":
                    return {
                        ext: "mkv",
                        mime: "video/x-matroska",
                    };
                default:
                    return;
            }
        }
        if (this.check([0x52, 0x49, 0x46, 0x46])) {
            if (this.check([0x41, 0x56, 0x49], { offset: 8 })) {
                return {
                    ext: "avi",
                    mime: "video/vnd.avi",
                };
            }
            if (this.check([0x57, 0x41, 0x56, 0x45], { offset: 8 })) {
                return {
                    ext: "wav",
                    mime: "audio/vnd.wave",
                };
            }
            if (this.check([0x51, 0x4c, 0x43, 0x4d], { offset: 8 })) {
                return {
                    ext: "qcp",
                    mime: "audio/qcelp",
                };
            }
        }
        if (this.checkString("SQLi")) {
            return {
                ext: "sqlite",
                mime: "application/x-sqlite3",
            };
        }
        if (this.check([0x4e, 0x45, 0x53, 0x1a])) {
            return {
                ext: "nes",
                mime: "application/x-nintendo-nes-rom",
            };
        }
        if (this.checkString("Cr24")) {
            return {
                ext: "crx",
                mime: "application/x-google-chrome-extension",
            };
        }
        if (this.checkString("MSCF") || this.checkString("ISc(")) {
            return {
                ext: "cab",
                mime: "application/vnd.ms-cab-compressed",
            };
        }
        if (this.check([0xed, 0xab, 0xee, 0xdb])) {
            return {
                ext: "rpm",
                mime: "application/x-rpm",
            };
        }
        if (this.check([0xc5, 0xd0, 0xd3, 0xc6])) {
            return {
                ext: "eps",
                mime: "application/eps",
            };
        }
        if (this.check([0x28, 0xb5, 0x2f, 0xfd])) {
            return {
                ext: "zst",
                mime: "application/zstd",
            };
        }
        if (this.check([0x7f, 0x45, 0x4c, 0x46])) {
            return {
                ext: "elf",
                mime: "application/x-elf",
            };
        }
        if (this.check([0x4f, 0x54, 0x54, 0x4f, 0x00])) {
            return {
                ext: "otf",
                mime: "font/otf",
            };
        }
        if (this.checkString("#!AMR")) {
            return {
                ext: "amr",
                mime: "audio/amr",
            };
        }
        if (this.checkString("{\\rtf")) {
            return {
                ext: "rtf",
                mime: "application/rtf",
            };
        }
        if (this.check([0x46, 0x4c, 0x56, 0x01])) {
            return {
                ext: "flv",
                mime: "video/x-flv",
            };
        }
        if (this.checkString("IMPM")) {
            return {
                ext: "it",
                mime: "audio/x-it",
            };
        }
        if (this.checkString("-lh0-", { offset: 2 }) ||
            this.checkString("-lh1-", { offset: 2 }) ||
            this.checkString("-lh2-", { offset: 2 }) ||
            this.checkString("-lh3-", { offset: 2 }) ||
            this.checkString("-lh4-", { offset: 2 }) ||
            this.checkString("-lh5-", { offset: 2 }) ||
            this.checkString("-lh6-", { offset: 2 }) ||
            this.checkString("-lh7-", { offset: 2 }) ||
            this.checkString("-lzs-", { offset: 2 }) ||
            this.checkString("-lz4-", { offset: 2 }) ||
            this.checkString("-lz5-", { offset: 2 }) ||
            this.checkString("-lhd-", { offset: 2 })) {
            return {
                ext: "lzh",
                mime: "application/x-lzh-compressed",
            };
        }
        if (this.check([0x00, 0x00, 0x01, 0xba])) {
            if (this.check([0x21], { offset: 4, mask: [0xf1] })) {
                return {
                    ext: "mpg",
                    mime: "video/MP1S",
                };
            }
            if (this.check([0x44], { offset: 4, mask: [0xc4] })) {
                return {
                    ext: "mpg",
                    mime: "video/MP2P",
                };
            }
        }
        if (this.checkString("ITSF")) {
            return {
                ext: "chm",
                mime: "application/vnd.ms-htmlhelp",
            };
        }
        if (this.check([0xfd, 0x37, 0x7a, 0x58, 0x5a, 0x00])) {
            return {
                ext: "xz",
                mime: "application/x-xz",
            };
        }
        if (this.checkString("<?xml ")) {
            return {
                ext: "xml",
                mime: "application/xml",
            };
        }
        if (this.check([0x37, 0x7a, 0xbc, 0xaf, 0x27, 0x1c])) {
            return {
                ext: "7z",
                mime: "application/x-7z-compressed",
            };
        }
        if (this.check([0x52, 0x61, 0x72, 0x21, 0x1a, 0x7]) &&
            (this.buffer[6] === 0x0 || this.buffer[6] === 0x1)) {
            return {
                ext: "rar",
                mime: "application/x-rar-compressed",
            };
        }
        if (this.checkString("solid ")) {
            return {
                ext: "stl",
                mime: "model/stl",
            };
        }
        if (this.checkString("BLENDER")) {
            return {
                ext: "blend",
                mime: "application/x-blender",
            };
        }
        if (this.checkString("!<arch>")) {
            await tokenizer.ignore(8);
            const string = await tokenizer.readToken(new Token.StringType(13, "ascii"));
            if (string === "debian-binary") {
                return {
                    ext: "deb",
                    mime: "application/x-deb",
                };
            }
            return {
                ext: "ar",
                mime: "application/x-unix-archive",
            };
        }
        if (this.check([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
            await tokenizer.ignore(8);
            async function readChunkHeader() {
                return {
                    length: await tokenizer.readToken(Token.INT32_BE),
                    type: await tokenizer.readToken(new Token.StringType(4, "binary")),
                };
            }
            do {
                const chunk = await readChunkHeader();
                if (chunk.length < 0) {
                    return;
                }
                switch (chunk.type) {
                    case "IDAT":
                        return {
                            ext: "png",
                            mime: "image/png",
                        };
                    case "acTL":
                        return {
                            ext: "apng",
                            mime: "image/apng",
                        };
                    default:
                        await tokenizer.ignore(chunk.length + 4);
                }
            } while (tokenizer.position + 8 < tokenizer.fileInfo.size);
            return {
                ext: "png",
                mime: "image/png",
            };
        }
        if (this.check([0x41, 0x52, 0x52, 0x4f, 0x57, 0x31, 0x00, 0x00])) {
            return {
                ext: "arrow",
                mime: "application/x-apache-arrow",
            };
        }
        if (this.check([0x67, 0x6c, 0x54, 0x46, 0x02, 0x00, 0x00, 0x00])) {
            return {
                ext: "glb",
                mime: "model/gltf-binary",
            };
        }
        if (this.check([0x66, 0x72, 0x65, 0x65], { offset: 4 }) ||
            this.check([0x6d, 0x64, 0x61, 0x74], { offset: 4 }) ||
            this.check([0x6d, 0x6f, 0x6f, 0x76], { offset: 4 }) ||
            this.check([0x77, 0x69, 0x64, 0x65], { offset: 4 })) {
            return {
                ext: "mov",
                mime: "video/quicktime",
            };
        }
        if (this.check([0xef, 0xbb, 0xbf]) &&
            this.checkString("<?xml", { offset: 3 })) {
            return {
                ext: "xml",
                mime: "application/xml",
            };
        }
        if (this.check([0x49, 0x49, 0x52, 0x4f, 0x08, 0x00, 0x00, 0x00, 0x18])) {
            return {
                ext: "orf",
                mime: "image/x-olympus-orf",
            };
        }
        if (this.checkString("gimp xcf ")) {
            return {
                ext: "xcf",
                mime: "image/x-xcf",
            };
        }
        if (this.check([
            0x49, 0x49, 0x55, 0x00, 0x18, 0x00, 0x00, 0x00, 0x88, 0xe7, 0x74, 0xd8,
        ])) {
            return {
                ext: "rw2",
                mime: "image/x-panasonic-rw2",
            };
        }
        if (this.check([0x30, 0x26, 0xb2, 0x75, 0x8e, 0x66, 0xcf, 0x11, 0xa6, 0xd9])) {
            async function readHeader() {
                const guid = node_buffer_1.Buffer.alloc(16);
                await tokenizer.readBuffer(guid);
                return {
                    id: guid,
                    size: Number(await tokenizer.readToken(Token.UINT64_LE)),
                };
            }
            await tokenizer.ignore(30);
            while (tokenizer.position + 24 < tokenizer.fileInfo.size) {
                const header = await readHeader();
                let payload = header.size - 24;
                if ((0, check_1._check)(header.id, [
                    0x91, 0x07, 0xdc, 0xb7, 0xb7, 0xa9, 0xcf, 0x11, 0x8e, 0xe6, 0x00,
                    0xc0, 0x0c, 0x20, 0x53, 0x65,
                ])) {
                    const typeId = node_buffer_1.Buffer.alloc(16);
                    payload -= await tokenizer.readBuffer(typeId);
                    if ((0, check_1._check)(typeId, [
                        0x40, 0x9e, 0x69, 0xf8, 0x4d, 0x5b, 0xcf, 0x11, 0xa8, 0xfd,
                        0x00, 0x80, 0x5f, 0x5c, 0x44, 0x2b,
                    ])) {
                        return {
                            ext: "asf",
                            mime: "audio/x-ms-asf",
                        };
                    }
                    if ((0, check_1._check)(typeId, [
                        0xc0, 0xef, 0x19, 0xbc, 0x4d, 0x5b, 0xcf, 0x11, 0xa8, 0xfd,
                        0x00, 0x80, 0x5f, 0x5c, 0x44, 0x2b,
                    ])) {
                        return {
                            ext: "asf",
                            mime: "video/x-ms-asf",
                        };
                    }
                    break;
                }
                await tokenizer.ignore(payload);
            }
            return {
                ext: "asf",
                mime: "application/vnd.ms-asf",
            };
        }
        if (this.check([
            0xab, 0x4b, 0x54, 0x58, 0x20, 0x31, 0x31, 0xbb, 0x0d, 0x0a, 0x1a, 0x0a,
        ])) {
            return {
                ext: "ktx",
                mime: "image/ktx",
            };
        }
        if ((this.check([0x7e, 0x10, 0x04]) || this.check([0x7e, 0x18, 0x04])) &&
            this.check([0x30, 0x4d, 0x49, 0x45], { offset: 4 })) {
            return {
                ext: "mie",
                mime: "application/x-mie",
            };
        }
        if (this.check([
            0x27, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00,
        ], { offset: 2 })) {
            return {
                ext: "shp",
                mime: "application/x-esri-shape",
            };
        }
        if (this.check([
            0x00, 0x00, 0x00, 0x0c, 0x6a, 0x50, 0x20, 0x20, 0x0d, 0x0a, 0x87, 0x0a,
        ])) {
            await tokenizer.ignore(20);
            const type = await tokenizer.readToken(new Token.StringType(4, "ascii"));
            switch (type) {
                case "jp2 ":
                    return {
                        ext: "jp2",
                        mime: "image/jp2",
                    };
                case "jpx ":
                    return {
                        ext: "jpx",
                        mime: "image/jpx",
                    };
                case "jpm ":
                    return {
                        ext: "jpm",
                        mime: "image/jpm",
                    };
                case "mjp2":
                    return {
                        ext: "mj2",
                        mime: "image/mj2",
                    };
                default:
                    return;
            }
        }
        if (this.check([0xff, 0x0a]) ||
            this.check([
                0x00, 0x00, 0x00, 0x0c, 0x4a, 0x58, 0x4c, 0x20, 0x0d, 0x0a, 0x87, 0x0a,
            ])) {
            return {
                ext: "jxl",
                mime: "image/jxl",
            };
        }
        if (this.check([0xfe, 0xff, 0, 60, 0, 63, 0, 120, 0, 109, 0, 108]) ||
            this.check([0xff, 0xfe, 60, 0, 63, 0, 120, 0, 109, 0, 108, 0])) {
            return {
                ext: "xml",
                mime: "application/xml",
            };
        }
        if (this.check([0x0, 0x0, 0x1, 0xba]) ||
            this.check([0x0, 0x0, 0x1, 0xb3])) {
            return {
                ext: "mpg",
                mime: "video/mpeg",
            };
        }
        if (this.check([0x00, 0x01, 0x00, 0x00, 0x00])) {
            return {
                ext: "ttf",
                mime: "font/ttf",
            };
        }
        if (this.check([0x00, 0x00, 0x01, 0x00])) {
            return {
                ext: "ico",
                mime: "image/x-icon",
            };
        }
        if (this.check([0x00, 0x00, 0x02, 0x00])) {
            return {
                ext: "cur",
                mime: "image/x-icon",
            };
        }
        if (this.check([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])) {
            return {
                ext: "cfb",
                mime: "application/x-cfb",
            };
        }
        await tokenizer.peekBuffer(this.buffer, {
            length: Math.min(256, tokenizer.fileInfo.size),
            mayBeLess: true,
        });
        if (this.checkString("BEGIN:")) {
            if (this.checkString("VCARD", { offset: 6 })) {
                return {
                    ext: "vcf",
                    mime: "text/vcard",
                };
            }
            if (this.checkString("VCALENDAR", { offset: 6 })) {
                return {
                    ext: "ics",
                    mime: "text/calendar",
                };
            }
        }
        if (this.checkString("FUJIFILMCCD-RAW")) {
            return {
                ext: "raf",
                mime: "image/x-fujifilm-raf",
            };
        }
        if (this.checkString("Extended Module:")) {
            return {
                ext: "xm",
                mime: "audio/x-xm",
            };
        }
        if (this.checkString("Creative Voice File")) {
            return {
                ext: "voc",
                mime: "audio/x-voc",
            };
        }
        if (this.check([0x04, 0x00, 0x00, 0x00]) && this.buffer.length >= 16) {
            const jsonSize = this.buffer.readUInt32LE(12);
            if (jsonSize > 12 && this.buffer.length >= jsonSize + 16) {
                try {
                    const header = this.buffer.slice(16, jsonSize + 16).toString();
                    const json = JSON.parse(header);
                    if (json.files) {
                        return {
                            ext: "asar",
                            mime: "application/x-asar",
                        };
                    }
                }
                catch (_a) { }
            }
        }
        if (this.check([
            0x06, 0x0e, 0x2b, 0x34, 0x02, 0x05, 0x01, 0x01, 0x0d, 0x01, 0x02, 0x01,
            0x01, 0x02,
        ])) {
            return {
                ext: "mxf",
                mime: "application/mxf",
            };
        }
        if (this.checkString("SCRM", { offset: 44 })) {
            return {
                ext: "s3m",
                mime: "audio/x-s3m",
            };
        }
        if (this.check([0x47]) && this.check([0x47], { offset: 188 })) {
            return {
                ext: "mts",
                mime: "video/mp2t",
            };
        }
        if (this.check([0x47], { offset: 4 }) &&
            this.check([0x47], { offset: 196 })) {
            return {
                ext: "mts",
                mime: "video/mp2t",
            };
        }
        if (this.check([0x42, 0x4f, 0x4f, 0x4b, 0x4d, 0x4f, 0x42, 0x49], {
            offset: 60,
        })) {
            return {
                ext: "mobi",
                mime: "application/x-mobipocket-ebook",
            };
        }
        if (this.check([0x44, 0x49, 0x43, 0x4d], { offset: 128 })) {
            return {
                ext: "dcm",
                mime: "application/dicom",
            };
        }
        if (this.check([
            0x4c, 0x00, 0x00, 0x00, 0x01, 0x14, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00,
            0xc0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x46,
        ])) {
            return {
                ext: "lnk",
                mime: "application/x.ms.shortcut",
            };
        }
        if (this.check([
            0x62, 0x6f, 0x6f, 0x6b, 0x00, 0x00, 0x00, 0x00, 0x6d, 0x61, 0x72, 0x6b,
            0x00, 0x00, 0x00, 0x00,
        ])) {
            return {
                ext: "alias",
                mime: "application/x.apple.alias",
            };
        }
        if (this.check([0x4c, 0x50], { offset: 34 }) &&
            (this.check([0x00, 0x00, 0x01], { offset: 8 }) ||
                this.check([0x01, 0x00, 0x02], { offset: 8 }) ||
                this.check([0x02, 0x00, 0x02], { offset: 8 }))) {
            return {
                ext: "eot",
                mime: "application/vnd.ms-fontobject",
            };
        }
        if (this.check([
            0x06, 0x06, 0xed, 0xf5, 0xd8, 0x1d, 0x46, 0xe5, 0xbd, 0x31, 0xef, 0xe7,
            0xfe, 0x74, 0xb7, 0x1d,
        ])) {
            return {
                ext: "indd",
                mime: "application/x-indesign",
            };
        }
        await tokenizer.peekBuffer(this.buffer, {
            length: Math.min(512, tokenizer.fileInfo.size),
            mayBeLess: true,
        });
        if ((0, tar_header_checksum_matches_1.tarHeaderChecksumMatches)(this.buffer)) {
            return {
                ext: "tar",
                mime: "application/x-tar",
            };
        }
        if (this.check([
            0xff, 0xfe, 0xff, 0x0e, 0x53, 0x00, 0x6b, 0x00, 0x65, 0x00, 0x74, 0x00,
            0x63, 0x00, 0x68, 0x00, 0x55, 0x00, 0x70, 0x00, 0x20, 0x00, 0x4d, 0x00,
            0x6f, 0x00, 0x64, 0x00, 0x65, 0x00, 0x6c, 0x00,
        ])) {
            return {
                ext: "skp",
                mime: "application/vnd.sketchup.skp",
            };
        }
        if (this.checkString("-----BEGIN PGP MESSAGE-----")) {
            return {
                ext: "pgp",
                mime: "application/pgp-encrypted",
            };
        }
        if (this.buffer.length >= 2 &&
            this.check([0xff, 0xe0], { offset: 0, mask: [0xff, 0xe0] })) {
            if (this.check([0x10], { offset: 1, mask: [0x16] })) {
                if (this.check([0x08], { offset: 1, mask: [0x08] })) {
                    return {
                        ext: "aac",
                        mime: "audio/aac",
                    };
                }
                return {
                    ext: "aac",
                    mime: "audio/aac",
                };
            }
            if (this.check([0x02], { offset: 1, mask: [0x06] })) {
                return {
                    ext: "mp3",
                    mime: "audio/mpeg",
                };
            }
            if (this.check([0x04], { offset: 1, mask: [0x06] })) {
                return {
                    ext: "mp2",
                    mime: "audio/mpeg",
                };
            }
            if (this.check([0x06], { offset: 1, mask: [0x06] })) {
                return {
                    ext: "mp1",
                    mime: "audio/mpeg",
                };
            }
        }
    }
    async readTiffTag(bigEndian) {
        const tagId = await this.tokenizer.readToken(bigEndian ? Token.UINT16_BE : Token.UINT16_LE);
        this.tokenizer.ignore(10);
        switch (tagId) {
            case 50341:
                return {
                    ext: "arw",
                    mime: "image/x-sony-arw",
                };
            case 50706:
                return {
                    ext: "dng",
                    mime: "image/x-adobe-dng",
                };
            default:
        }
    }
    async readTiffIFD(bigEndian) {
        const numberOfTags = await this.tokenizer.readToken(bigEndian ? Token.UINT16_BE : Token.UINT16_LE);
        for (let n = 0; n < numberOfTags; ++n) {
            const fileType = await this.readTiffTag(bigEndian);
            if (fileType) {
                return fileType;
            }
        }
    }
    async readTiffHeader(bigEndian) {
        const version = (bigEndian ? Token.UINT16_BE : Token.UINT16_LE).get(this.buffer, 2);
        const ifdOffset = (bigEndian ? Token.UINT32_BE : Token.UINT32_LE).get(this.buffer, 4);
        if (version === 42) {
            if (ifdOffset >= 6) {
                if (this.checkString("CR", { offset: 8 })) {
                    return {
                        ext: "cr2",
                        mime: "image/x-canon-cr2",
                    };
                }
                if (ifdOffset >= 8 &&
                    (this.check([0x1c, 0x00, 0xfe, 0x00], { offset: 8 }) ||
                        this.check([0x1f, 0x00, 0x0b, 0x00], { offset: 8 }))) {
                    return {
                        ext: "nef",
                        mime: "image/x-nikon-nef",
                    };
                }
            }
            await this.tokenizer.ignore(ifdOffset);
            const fileType = await this.readTiffIFD(false);
            return fileType
                ? fileType
                : {
                    ext: "tif",
                    mime: "image/tiff",
                };
        }
        if (version === 43) {
            return {
                ext: "tif",
                mime: "image/tiff",
            };
        }
    }
}
exports.FileTypeParser = FileTypeParser;
//# sourceMappingURL=file-type-parser.js.map