import {test} from "zora";
import {select} from "d3-selection";
import {default as getSize} from "../src/_getSize.js";

test("getSize", assert => {

  let div = select("body").append("div"),
      size = getSize(div.node());

  assert.ok(size[0] > 750 && size[1] > 550, "Window Detection");

  div = div.style("width", "300px").style("height", "200px").append("div");
  size = getSize(div.node());
  assert.ok(size[0] === 300 && size[1] === 200, "Parent Styles");

  size = getSize(div.style("width", "200px").style("height", "100px").node());
  assert.ok(size[0] === 200 && size[1] === 100, "Inline Styles");

  div.remove();

});

export default test;
