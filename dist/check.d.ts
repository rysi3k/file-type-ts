/// <reference types="node" />
export interface CheckOptions {
    offset: number;
    mask?: number[];
}
export declare function _check(buffer: Buffer, headers: unknown[], options?: CheckOptions): boolean;
