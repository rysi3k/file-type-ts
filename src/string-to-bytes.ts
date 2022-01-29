export function stringToBytes(string: string) {
	return [...string].map((character) => character.charCodeAt(0));
}
