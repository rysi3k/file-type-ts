import { ITokenizer } from "strtok3";
import { FileType } from "./file-type.interface";
export declare class FileTypeParser {
    private buffer;
    private tokenizer;
    private check;
    private checkString;
    parse(tokenizer: ITokenizer): Promise<FileType | void>;
    readTiffTag(bigEndian: boolean): Promise<FileType | void>;
    readTiffIFD(bigEndian: boolean): Promise<FileType | void>;
    readTiffHeader(bigEndian: boolean): Promise<FileType | void>;
}
