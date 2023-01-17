import { convertCmToInches, convertKgToLbs } from "./utils";

describe("convertCmToInches", () => {
  it("should convert cm to inches", () => {
    expect(convertCmToInches(172)).toEqual(67.72);
    expect(convertCmToInches(180)).toEqual(70.87);
  });
});

describe("covertKgToLbs", () => {
  it("should convert kg to lbs", () => {
    expect(convertKgToLbs(80)).toEqual(176);
    expect(convertKgToLbs(90)).toEqual(198);
  });
});
