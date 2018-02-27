import test from "zora";
import {selectAll} from "d3-selection";

import Message from "../src/Message.js";

test("Message", function *(assert) {

  const msg = new Message();

  yield callback => msg.render({callback});
  assert.ok(selectAll(".d3plus-Mask").size() === 1, "adds Mask to DOM");
  assert.ok(selectAll(".d3plus-Message").size() === 1, "adds Message to DOM");

  // TODO
  // yield callback => msg.render({callback, mask: false});
  // assert.ok(selectAll(".d3plus-Mask").empty(), "disables mask");
  // yield callback => msg.hide({callback});
  // assert.ok(selectAll(".d3plus-Message").empty(), "removes from DOM");

});

export default test;
