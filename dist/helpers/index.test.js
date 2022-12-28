"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
describe("helpers", () => {
    test("should return true if it is number", () => {
        expect((0, _1.checkNumbers)("10")).toBe(true);
    });
    test("should return false if it is string", () => {
        expect((0, _1.checkNumbers)("abc")).toBe(false);
    });
});
