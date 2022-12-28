import { checkNumbers } from ".";

describe("helpers", () => {
  test("should return true if it is number", () => {
    expect(checkNumbers("10")).toBe(true);
  });
  test("should return false if it is string", () => {
    expect(checkNumbers("abc")).toBe(false);
  });
});
