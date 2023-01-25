import assert from "assert";
import {default as Viz} from "../src/Viz.js";
import it from "./jsdom.js";

it("Viz", function *() {

  yield cb => new Viz().render(cb);
  assert.ok(true, "function success");

});