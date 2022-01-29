/**
Checks whether the TAR checksum is valid.
@param {Buffer} buffer - The TAR header `[offset ... offset + 512]`.
@param {number} offset - TAR header offset.
@returns {boolean} `true` if the TAR checksum is valid, otherwise `false`.
*/
export function tarHeaderChecksumMatches(buffer: Buffer, offset = 0) {
	const readSum = Number.parseInt(
		buffer.toString("utf8", 148, 154).replace(/\0.*$/, "").trim(),
		8
	); // Read sum in header
	if (Number.isNaN(readSum)) {
		return false;
	}

	let sum = 8 * 0x20; // Initialize signed bit sum

	for (let i = offset; i < offset + 148; i++) {
		sum += buffer[i];
	}

	for (let i = offset + 156; i < offset + 512; i++) {
		sum += buffer[i];
	}

	return readSum === sum;
}
