/**
ID3 UINT32 sync-safe tokenizer token.
28 bits (representing up to 256MB) integer, the msb is 0 to avoid "false syncsignals".
*/
export const uint32SyncSafeToken = {
	get: (buffer: Buffer, offset: number) =>
		(buffer[offset + 3] & 0x7f) |
		(buffer[offset + 2] << 7) |
		(buffer[offset + 1] << 14) |
		(buffer[offset] << 21),
	len: 4,
};
