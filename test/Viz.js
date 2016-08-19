import {test} from "tape";
import {default as Viz} from "../src/Viz.js";

test("Viz", assert => {

  new Viz()
    .render(() => {

      assert.true(true, "function success");
      assert.end();

    });

});
