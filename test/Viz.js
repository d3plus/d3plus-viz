import test from "zora";
import {default as Viz} from "../src/Viz.js";

test("Viz", function *(assert) {

  yield cb => new Viz().render(cb);
  assert.ok(true, "function success");

});

export default test;
