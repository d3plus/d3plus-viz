import {test} from "zora";
import {default as concat} from "../../src/data/concat.js";

test("data/concat", assert => {

  const array1 = ["a", "b", "c"];
  const array2 = ["d", "e", "f"];


  // Concat array of arrays
  const concat1 = concat([
    array1,
    array2
  ]);
  assert.equal(true, concat1 instanceof Array, "Concat returns Array 1");
  assert.equal(6, concat1.length, "Correct Array length 1");

  // Concat array of objects with `data` key
  const concat2 = concat([
    {page: 1, data: array1},
    {page: 1, data: array2}
  ]);
  assert.equal(true, concat2 instanceof Array, "Concat Returns Array 2");
  assert.equal(6, concat2.length, "Correct Array length 2");

  // Concat array of objects with no data key
  const concat3 = concat([
    {page: 1, results: array1},
    {page: 1, results: array2}
  ]);
  assert.equal(true, concat3 instanceof Array, "Concat Returns Array 3");
  assert.equal(0, concat3.length, "Correct Array length 3");

  // Concat array of objects with no data key
  const concat4 = concat([
    {page: 1, results: array1},
    {page: 1, results: array2}
  ], "results");
  assert.equal(true, concat4 instanceof Array, "Concat Returns Array 4");
  assert.equal(6, concat4.length, "Correct Array length 4");

});

export default test;
