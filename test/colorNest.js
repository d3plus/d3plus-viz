import {test} from "tape";
import {default as colorNest} from "../src/colorNest.js";

test("colorNest", assert => {

  const data = [
    {group: "A", id: 1},
    {group: "B", id: 2},
    {group: "A", id: 3}
  ];

  const nestedUnique = colorNest(data, d => d.id);
  assert.equals(nestedUnique.data.length, 3, "Unique");

  const nestedMerge = colorNest(data, d => d.group);
  assert.equals(nestedMerge.data.length, 2, "Merge");

  const nestedGroup = colorNest(data, d => d.group === "A" ? "red" : "blue", [d => d.group, d => d.id]);
  assert.equals(nestedGroup.data.length, 2, "Groups");

  const nestedCustom = colorNest(data, d => d.id < 3 ? "red" : "blue", [d => d.group, d => d.id]);
  assert.equals(nestedCustom.data.length, 3, "Custom");

  assert.end();

});
