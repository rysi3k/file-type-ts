import * as strtok3 from "strtok3";
import { fileTypeFromTokenizer } from ".";

export async function fileTypeFromBuffer(
	input: Buffer | Uint8Array | ArrayBuffer
) {
	if (!(input instanceof Uint8Array || input instanceof ArrayBuffer)) {
		throw new TypeError(
			`Expected the \`input\` argument to be of type \`Uint8Array\` or \`Buffer\` or \`ArrayBuffer\`, got \`${typeof input}\``
		);
	}

	const buffer = input instanceof Uint8Array ? input : new Uint8Array(input);

	if (!(buffer && buffer.length > 1)) {
		return;
	}

	return fileTypeFromTokenizer(strtok3.fromBuffer(buffer));
}
