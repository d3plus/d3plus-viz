# Hiding the Tooltip On Click

The following example demonstrates using the [on](https://d3plus.org/docs/#BaseClass.on) method to attach a custom event listener to the [Viz](https://d3plus.org/docs/#Viz) that will hide the [Tooltip](https://d3plus.org/docs/#Tooltip) on click events.

```js
var data = [
  {id: "alpha", x: 4, y:  7},
  {id: "beta",  x: 5, y:  2}
];

new d3plus.Viz()
  .data(data)
  .on({
    "click": function() {
      if (this._tooltip) {
        this._tooltipClass.data([]).render();
      }
    }
  })
  .render();
```
