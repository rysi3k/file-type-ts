import { ITokenizer } from "strtok3";
import { FileTypeParser } from "./file-type-parser";
import * as strtok3 from "strtok3";

export async function fileTypeFromTokenizer(tokenizer: ITokenizer) {
	try {
		return new FileTypeParser().parse(tokenizer);
	} catch (error) {
		if (!(error instanceof strtok3.EndOfStreamError)) {
			throw error;
		}
	}
}
