/**
 * Test if R and F commute properly
 */

import { describe, test, expect } from "vitest";
import { createSolvedState, isStateSolved, statesEqual } from "../state";
import { renderCubeNet } from "../renderer";
import { applyMove, applyAlgorithm } from "../executor";
import { parseMove, parseAlgorithm} from "../parser";


describe("verify algorithms", () => {
  test("sledge", () => {
    let state = createSolvedState();
    state = applyAlgorithm(state, parseAlgorithm("R' F R F'"));
    const expected = `    WWG
    WWG
    BRR
OOW RGG YWW OBB
OOO GGW RRR BBB
OOO GGW RRR BBB
    YYG
    YYY
    YYY`

    expect(renderCubeNet(state)).toBe(expected);
  });

  test("3-sexy", () => {
    let state = createSolvedState();

    state = applyAlgorithm(state, parseAlgorithm("R U R' U' R U R' U' R U R' U'"));

    const expected = `    BWB
    WWW
    WWY
ROO GGR GRO WBW
OOO GGG RRR BBB
OOO GGR GRR BBB
    YYW
    YYY
    YYY`

    expect(renderCubeNet(state)).toBe(expected);
  });

  test("t-perm", () => {
    let state = createSolvedState();

    state = applyAlgorithm(state, parseAlgorithm("R U R' U' R' F R2 U' R' U' R U R' F'"));
    const expected = `    WWW
    WWW
    WWW
ORO GGR BOG RBB
OOO GGG RRR BBB
OOO GGG RRR BBB
    YYY
    YYY
    YYY`

    expect(renderCubeNet(state)).toBe(expected);
  });

});
