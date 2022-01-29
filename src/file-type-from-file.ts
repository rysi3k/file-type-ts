import * as strtok3 from "strtok3";
import { fileTypeFromTokenizer } from "./file-type-from-tokenizer";

export async function fileTypeFromFile(path: string) {
	const tokenizer = await strtok3.fromFile(path);
	try {
		return await fileTypeFromTokenizer(tokenizer);
	} finally {
		await tokenizer.close();
	}
}
