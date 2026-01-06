import { applyZ2Rotation } from "../executor";
import { createSolvedState } from "../state";
import { renderCubeNet } from "../renderer";

const solved = createSolvedState();
console.log("=== SOLVED STATE ===");
console.log(renderCubeNet(solved));

const rotated = applyZ2Rotation(solved);
console.log("\n=== AFTER Z2 ROTATION ===");
console.log(renderCubeNet(rotated));
