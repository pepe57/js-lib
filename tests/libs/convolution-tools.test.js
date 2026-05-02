import { describe, it } from "@std/testing/bdd"
import { expect } from "@std/expect";
import {
    get1DBoxBlurKernelSizes
} from "../../libs/convolution-tools.js"

describe("arrayFindIndicies", () => {
    it("gets a series of box blurs (example 1)", () => {
        const kernelSizes = get1DBoxBlurKernelSizes(5, 3);
        expect(kernelSizes).toEqual([10, 10, 10]);
    });
    it("gets a series of box blurs (example 2)", () => {
        const kernelSizes = get1DBoxBlurKernelSizes(3.2, 4);
        expect(kernelSizes).toEqual([5, 6, 6, 6]);
    });
});