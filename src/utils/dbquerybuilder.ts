const comparator = {
	illegal: ['"', "'", "-", "*", "%", ".", ","],
};

const isIllegalChar = (char: string) => {
	if (typeof char !== "string" || char.length > 1)
		throw new Error(`invalid input isIllegalChar(${char})`);
	for (const c in comparator.illegal)
		if (comparator.illegal[c] === char) return c;
	return -1;
};

export const fromDbString = (word: string | number) => {
	if (typeof word !== "string") return word.toString();
	return fromDbString_(word);
};

export const toDbString_ = (word: string, quote = false) => {
	const convertedWord = word
		.split("")
		.map((v, i, arr) => {
			const replace = isIllegalChar(v);
			if (replace !== -1) return `$${replace}`;
			if (i > 0) {
				const prev = arr[i - 1];
				if (prev && isIllegalChar(prev) !== -1) return `_${v}`;
			}
			return v;
		})
		.join("");
	return !quote ? convertedWord : `'${convertedWord}'`;
};

export const fromDbString_ = (word: string) => {
	const step1 = word.split("");
	const _l = step1.length;
	const translated: Array<string> = [];
	let index = 0;
	let char: string | undefined;
	// biome-ignore lint/correctness/noConstantCondition: infinite loop, i break out inside
	for (let i = 0; ; i++) {
		const [c1, c2] = step1.slice(i, i + 2);

		if (c1 === undefined || c2 === undefined) {
			if (c1) translated.push(c1);
			break;
		}
		if (c1 === "$") {
			i++;
			index = Number.parseInt(c2);
			// console.log(c1, c2);
			if (index >= comparator.illegal.length) {
				continue;
			}
			char = comparator.illegal[index];
			if (char) {
				translated.push(char);
			}
			continue;
		}
		translated.push(c1);
	}

	return translated.filter((v) => v !== "_").join("");
};
//  const toDbString = (quote: boolean, ...words: Array<string>) => words.map(word => toDbString_(word, quote)).join(", ")

/**
 * Register service.
 * @description Stores instances in `global` to prevent memory leaks in development.
 * @arg {string} name Service name.
 * @arg {function} initFn Function returning the service instance.
 * @return {*} Service instance.
 */
export const registerService = <T = any>(name: string, initFn: () => T): T => {
	if (process.env.NODE_ENV === "development") {
		const g: { [key: string]: T & any } = global;
		if (!(name in g)) {
			g[name] = initFn();
		}
		return g[name];
	}
	return initFn();
};

/**
 * Adds leading 0s to the number/string.
 * @description Function throws in runtime if input is not number|string|bigint.
 */
export function padStart(num: number | string | bigint, padding = 6) {
	switch (typeof num) {
		case "number":
		case "bigint":
			return num.toString().padStart(padding, "0");
		case "string":
			return num.padStart(padding, "0");
		default:
	}
	throw new Error("invalid argument type");
}
