import zora from "zora";
import {default as Viz} from "../src/Viz.js";

export default zora()
  .test("Viz", function *(assert) {

    yield cb => new Viz().render(cb);
    assert.ok(true, "function success");

  });
