import {test} from "tape";
import {default as datafold} from "../src/datafold.js";

test("datafold", assert => {

  const data = datafold({
    data: [[0, "Dave"], [1, "Alex"]],
    headers: ["id", "name"]
  });

  assert.equal(true, data instanceof Array, "returns Array");
  assert.equal(2, data.length, "correct Array length");
  assert.equal(0, data[0].id, "data 1 - key 1");
  assert.equal("Dave", data[0].name, "data 1 - key 2");
  assert.equal(1, data[1].id, "data 2 - key 1");
  assert.equal("Alex", data[1].name, "data 2 - key 2");
  assert.end();

});
