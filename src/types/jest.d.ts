/// <reference path="../../node_modules/@jest/globals/build/index.d.ts" />

// Make Jest globals available globally for TypeScript
import type { Global } from "@jest/types";
import type { JestExpect } from "@jest/expect";

declare global {
  const describe: Global.GlobalAdditions["describe"];
  const it: Global.GlobalAdditions["it"];
  const test: Global.GlobalAdditions["test"];
  const beforeAll: Global.GlobalAdditions["beforeAll"];
  const beforeEach: Global.GlobalAdditions["beforeEach"];
  const afterEach: Global.GlobalAdditions["afterEach"];
  const afterAll: Global.GlobalAdditions["afterAll"];
  const expect: JestExpect;
  const xdescribe: Global.GlobalAdditions["xdescribe"];
  const fdescribe: Global.GlobalAdditions["fdescribe"];
  const xit: Global.GlobalAdditions["xit"];
  const fit: Global.GlobalAdditions["fit"];
}
