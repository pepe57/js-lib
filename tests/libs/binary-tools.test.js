import { describe, it } from "@std/testing/bdd"
import { expect } from "@std/expect";
import { concatUint8Arrays, byteToDec } from "../../libs/binary-tools.js";

describe("concatUint8Arrays", () => {
	it("concats 2 arrays", () => {
		const a = new Uint8Array(2);
		a.set([13, 99]);
		const b = new Uint8Array(3);
		b.set([100, 101, 33]);
		const c = concatUint8Arrays(a, b);
		expect(c.length).toBe(5);
		expect(c[0]).toBe(13);
		expect(c[1]).toBe(99);
		expect(c[2]).toBe(100);
		expect(c[3]).toBe(101);
		expect(c[4]).toBe(33);
	});
	it("concats 3 arrays", () => {
		const a = new Uint8Array(2);
		a.set([13, 99]);
		const b = new Uint8Array(3);
		b.set([100, 101, 33]);
		const c = new Uint8Array(2);
		c.set([16, 17]);

		const result = concatUint8Arrays(a, b, c);
		expect(result.length).toBe(7);
		expect(result[0]).toBe(13);
		expect(result[1]).toBe(99);
		expect(result[2]).toBe(100);
		expect(result[3]).toBe(101);
		expect(result[4]).toBe(33);
		expect(result[5]).toBe(16);
		expect(result[6]).toBe(17);
	});
});

describe("byteToDec", () => {
	[
		[[0, 0, 0, 0, 0, 0, 0, 0], 0],
		[[0, 0, 0, 0, 0, 0, 0, 1], 1],
		[[0, 0, 0, 0, 0, 0, 1, 0], 2],
		[[0, 0, 0, 0, 0, 1, 0, 0], 4],
		[[0, 0, 0, 0, 1, 0, 0, 0], 8],
		[[0, 0, 0, 1, 0, 0, 0, 0], 16],
		[[0, 0, 1, 0, 0, 0, 0, 0], 32],
		[[0, 1, 0, 1, 1, 0, 1, 1], 91]
	].forEach(test => 
		it(`Converts ${test[0]} array to ${test[1]}`, () =>{
			expect(byteToDec(test[0])).toBe(test[1]);
		}));
});