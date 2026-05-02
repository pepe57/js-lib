export class ColorFormatter {
	#xyza;
	#hasAlpha;

	static parse(text) {
		if (text.startsWith("#")) { //hex
			const hexCodes = text.slice(1);
			const r = parseInt(hexCodes.substring(0, 2), 16);
			const g = parseInt(hexCodes.substring(2, 4), 16);
			const b = parseInt(hexCodes.substring(4, 6), 16);
			return { success: true, value: { r, g, b, a: 1.0 }, format: "rgb", hasAlpha: false };
		}
		if (text.startsWith("rgb(")) {
			const match = text.match(
				/rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/,
			);
			if (match) {
				const r = parseInt(match[1]);
				const g = parseInt(match[2]);
				const b = parseInt(match[3]);
				return { success: true, value: { r, g, b } };
			}
			return {
				success: false,
				reason: `Invalid color format, tried to parse as rgb()`,
			};
		}
		return {
			success: false,
			reason: `Can't parse color ${text}. Not a known format.`,
		};
	}
	static format() {
	}
	static convert() {
	}
}
