# d3plus-viz

[![NPM Release](http://img.shields.io/npm/v/d3plus-viz.svg?style=flat)](https://www.npmjs.org/package/d3plus-viz) [![Build Status](https://travis-ci.org/d3plus/d3plus-viz.svg?branch=master)](https://travis-ci.org/d3plus/d3plus-viz) [![Dependency Status](http://img.shields.io/david/d3plus/d3plus-viz.svg?style=flat)](https://david-dm.org/d3plus/d3plus-viz) [![Gitter](https://img.shields.io/badge/-chat_on_gitter-brightgreen.svg?style=flat&logo=gitter-white)](https://gitter.im/d3plus/) [![1.0 progress](https://img.shields.io/badge/1.0_progress-71%25-yellow.svg?style=flat)](https://github.com/d3plus/d3plus-viz/projects/1)

Abstract ES6 class that drives d3plus visualizations.

## Installing

If you use NPM, run `npm install d3plus-viz --save`. Otherwise, download the [latest release](https://github.com/d3plus/d3plus-viz/releases/latest). The released bundle supports AMD, CommonJS, and vanilla environments. You can also load directly from [d3plus.org](https://d3plus.org):

```html
<script src="https://d3plus.org/js/d3plus-viz.v0.11.full.min.js"></script>
```


## API Reference

##### 
* [Viz](#Viz)

##### 
* [dataFold](#dataFold) - Given a JSON object where the data values and headers have been split into separate key lookups, this function will combine the data values with the headers and returns one large array of objects.
* [dataLoad](#dataLoad) - Loads data from a filepath or URL, converts it to a valid JSON object, and returns it to a callback function.

---

<a name="Viz"></a>
#### **Viz** [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L50)


This is a global class, and extends all of the methods and functionality of [<code>BaseClass</code>](https://github.com/d3plus/d3plus-common#BaseClass).


* [Viz](#Viz) ⇐ [<code>BaseClass</code>](https://github.com/d3plus/d3plus-common#BaseClass)
    * [new Viz()](#new_Viz_new)
    * [.render([*callback*])](#Viz.render) ↩︎
    * [.active([*value*])](#Viz.active) ↩︎
    * [.aggs([*value*])](#Viz.aggs) ↩︎
    * [.backConfig([*value*])](#Viz.backConfig) ↩︎
    * [.cache([*value*])](#Viz.cache) ↩︎
    * [.color([*value*])](#Viz.color) ↩︎
    * [.colorScale([*value*])](#Viz.colorScale) ↩︎
    * [.colorScaleConfig([*value*])](#Viz.colorScaleConfig) ↩︎
    * [.colorScalePosition([*value*])](#Viz.colorScalePosition) ↩︎
    * [.controls([*value*])](#Viz.controls) ↩︎
    * [.controlConfig([*value*])](#Viz.controlConfig) ↩︎
    * [.data(*data*, [*formatter*])](#Viz.data) ↩︎
    * [.depth([*value*])](#Viz.depth) ↩︎
    * [.desc([*value*])](#Viz.desc) ↩︎
    * [.detectResize(*value*)](#Viz.detectResize) ↩︎
    * [.detectResizeDelay(*value*)](#Viz.detectResizeDelay) ↩︎
    * [.detectVisible(*value*)](#Viz.detectVisible) ↩︎
    * [.detectVisibleInterval(*value*)](#Viz.detectVisibleInterval) ↩︎
    * [.discrete([*value*])](#Viz.discrete) ↩︎
    * [.downloadButton([*value*])](#Viz.downloadButton) ↩︎
    * [.downloadConfig([*value*])](#Viz.downloadConfig) ↩︎
    * [.downloadPosition([*value*])](#Viz.downloadPosition) ↩︎
    * [.duration([*ms*])](#Viz.duration) ↩︎
    * [.filter([*value*])](#Viz.filter) ↩︎
    * [.groupBy([*value*])](#Viz.groupBy) ↩︎
    * [.height([*value*])](#Viz.height) ↩︎
    * [.hover([*value*])](#Viz.hover) ↩︎
    * [.label([*value*])](#Viz.label) ↩︎
    * [.legend([*value*])](#Viz.legend) ↩︎
    * [.legendConfig([*value*])](#Viz.legendConfig) ↩︎
    * [.legendTooltip([*value*])](#Viz.legendTooltip) ↩︎
    * [.legendPosition([*value*])](#Viz.legendPosition) ↩︎
    * [.loadingHTML([*value*])](#Viz.loadingHTML) ↩︎
    * [.loadingMessage([*value*])](#Viz.loadingMessage) ↩︎
    * [.locale([*value*])](#Viz.locale) ↩︎
    * [.messageMask([*value*])](#Viz.messageMask) ↩︎
    * [.messageStyle([*value*])](#Viz.messageStyle) ↩︎
    * [.noDataHTML([*value*])](#Viz.noDataHTML) ↩︎
    * [.noDataMessage([*value*])](#Viz.noDataMessage) ↩︎
    * [.scrollContainer(*selector*)](#Viz.scrollContainer) ↩︎
    * [.select([*selector*])](#Viz.select) ↩︎
    * [.shape([*value*])](#Viz.shape) ↩︎
    * [.shapeConfig([*value*])](#Viz.shapeConfig) ↩︎
    * [.time([*value*])](#Viz.time) ↩︎
    * [.timeFilter([*value*])](#Viz.timeFilter) ↩︎
    * [.timeline([*value*])](#Viz.timeline) ↩︎
    * [.timelineConfig([*value*])](#Viz.timelineConfig) ↩︎
    * [.title([*value*])](#Viz.title) ↩︎
    * [.titleConfig([*value*])](#Viz.titleConfig) ↩︎
    * [.tooltip([*value*])](#Viz.tooltip) ↩︎
    * [.tooltipConfig([*value*])](#Viz.tooltipConfig) ↩︎
    * [.total([*value*])](#Viz.total) ↩︎
    * [.totalConfig([*value*])](#Viz.totalConfig) ↩︎
    * [.totalFormat(*value*)](#Viz.totalFormat) ↩︎
    * [.width([*value*])](#Viz.width) ↩︎
    * [.zoom(*value*)](#Viz.zoom) ↩︎
    * [.zoomBrushHandleSize(*value*)](#Viz.zoomBrushHandleSize) ↩︎
    * [.zoomBrushHandleStyle(*value*)](#Viz.zoomBrushHandleStyle) ↩︎
    * [.zoomBrushSelectionStyle(*value*)](#Viz.zoomBrushSelectionStyle) ↩︎
    * [.zoomControlStyle(*value*)](#Viz.zoomControlStyle) ↩︎
    * [.zoomControlStyleActive(*value*)](#Viz.zoomControlStyleActive) ↩︎
    * [.zoomControlStyleHover(*value*)](#Viz.zoomControlStyleHover) ↩︎
    * [.zoomFactor(*value*)](#Viz.zoomFactor) ↩︎
    * [.zoomMax(*value*)](#Viz.zoomMax) ↩︎
    * [.zoomPan(*value*)](#Viz.zoomPan) ↩︎
    * [.zoomPadding(*value*)](#Viz.zoomPadding) ↩︎
    * [.zoomScroll([*value*])](#Viz.zoomScroll) ↩︎


<a name="new_Viz_new" href="#new_Viz_new">#</a> new **Viz**()

Creates an x/y plot based on an array of data. If *data* is specified, immediately draws the tree map based on the specified array and returns the current class instance. If *data* is not specified on instantiation, it can be passed/updated after instantiation using the [data](#treemap.data) method. See [this example](https://d3plus.org/examples/d3plus-treemap/getting-started/) for help getting started using the treemap generator.





<a name="Viz.render" href="#Viz.render">#</a> Viz.**render**([*callback*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L390)

Draws the visualization given the specified configuration.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.active" href="#Viz.active">#</a> Viz.**active**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L552)

If *value* is specified, sets the active method to the specified function and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.aggs" href="#Viz.aggs">#</a> Viz.**aggs**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L570)

If *value* is specified, sets the aggregation method for each key in the object and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.backConfig" href="#Viz.backConfig">#</a> Viz.**backConfig**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L580)

If *value* is specified, sets the config method for the back button and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.cache" href="#Viz.cache">#</a> Viz.**cache**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L590)

Enables a lru cache that stores up to 5 previously loaded files/URLs. Helpful when constantly writing over the data array with a URL in the render function of a react component.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.color" href="#Viz.color">#</a> Viz.**color**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L600)

Defines the main color to be used for each data point in a visualization. Can be either an accessor function or a string key to reference in each data point. If a color value is returned, it will be used as is. If a string is returned, a unique color will be assigned based on the string.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.colorScale" href="#Viz.colorScale">#</a> Viz.**colorScale**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L610)

Defines the value to be used for a color scale. Can be either an accessor function or a string key to reference in each data point.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.colorScaleConfig" href="#Viz.colorScaleConfig">#</a> Viz.**colorScaleConfig**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L620)

A pass-through to the config method of ColorScale.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.colorScalePosition" href="#Viz.colorScalePosition">#</a> Viz.**colorScalePosition**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L630)

Defines which side of the visualization to anchor the color scale. Acceptable values are `"top"`, `"bottom"`, `"left"`, `"right"`, and `false`. A `false` value will cause the color scale to not be displayed, but will still color shapes based on the scale.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.controls" href="#Viz.controls">#</a> Viz.**controls**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L640)

Defines a list of controls to be rendered at the bottom of the visualization.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.controlConfig" href="#Viz.controlConfig">#</a> Viz.**controlConfig**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L650)

If *value* is specified, sets the config method for the controls and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.data" href="#Viz.data">#</a> Viz.**data**(*data*, [*formatter*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L665)

Sets the primary data array to be used when drawing the visualization. The value passed should be an *Array* of objects or a *String* representing a filepath or URL to be loaded. The following filetypes are supported: `csv`, `tsv`, `txt`, and `json`.

Additionally, a custom formatting function can be passed as a second argument to this method. This custom function will be passed the data that has been loaded, as long as there are no errors. This function should return the final array of obejcts to be used as the primary data array. For example, some JSON APIs return the headers split from the data values to save bandwidth. These would need be joined using a custom formatter.

If *data* is not specified, this method returns the current primary data array, which defaults to an empty array (`[]`);


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.

| Param | Type | Description |
| --- | --- | --- |
| *data* | <code>Array</code> \| <code>String</code> | = [] |
| [*formatter*] | <code>function</code> |  |



<a name="Viz.depth" href="#Viz.depth">#</a> Viz.**depth**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L682)

If *value* is specified, sets the depth to the specified number and returns the current class instance. The *value* should correspond with an index in the [groupBy](#groupBy) array.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.desc" href="#Viz.desc">#</a> Viz.**desc**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L692)

If *value* is specified, sets the description accessor to the specified string and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.detectResize" href="#Viz.detectResize">#</a> Viz.**detectResize**(*value*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L702)

If the width and/or height of a Viz is not user-defined, it is determined by the size of it's parent element. When this method is set to `true`, the Viz will listen for the `window.onresize` event and adjust it's dimensions accordingly.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.detectResizeDelay" href="#Viz.detectResizeDelay">#</a> Viz.**detectResizeDelay**(*value*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L712)

When resizing the browser window, this is the millisecond delay to trigger the resize event.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.detectVisible" href="#Viz.detectVisible">#</a> Viz.**detectVisible**(*value*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L722)

Toggles whether or not the Viz should try to detect if it visible in the current viewport. When this method is set to `true`, the Viz will only be rendered when it has entered the viewport either through scrolling or if it's display or visibility is changed.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.detectVisibleInterval" href="#Viz.detectVisibleInterval">#</a> Viz.**detectVisibleInterval**(*value*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L732)

The interval, in milliseconds, for checking if the visualization is visible on the page.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.discrete" href="#Viz.discrete">#</a> Viz.**discrete**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L742)

If *value* is specified, sets the discrete accessor to the specified method name (usually an axis) and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.downloadButton" href="#Viz.downloadButton">#</a> Viz.**downloadButton**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L752)

Shows a button that allows for downloading the current visualization.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.downloadConfig" href="#Viz.downloadConfig">#</a> Viz.**downloadConfig**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L762)

Sets specific options of the saveElement function used when downloading the visualization.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.downloadPosition" href="#Viz.downloadPosition">#</a> Viz.**downloadPosition**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L772)

Defines which control group to add the download button into.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.duration" href="#Viz.duration">#</a> Viz.**duration**([*ms*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L782)

If *ms* is specified, sets the animation duration to the specified number and returns the current class instance. If *ms* is not specified, returns the current animation duration.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.filter" href="#Viz.filter">#</a> Viz.**filter**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L792)

If *value* is specified, sets the filter to the specified function and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.groupBy" href="#Viz.groupBy">#</a> Viz.**groupBy**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L806)

If *value* is specified, sets the group accessor(s) to the specified string, function, or array of values and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


```js
function value(d) {
  return d.id;
}
```


<a name="Viz.height" href="#Viz.height">#</a> Viz.**height**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L829)

If *value* is specified, sets the overall height to the specified number and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.hover" href="#Viz.hover">#</a> Viz.**hover**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L839)

If *value* is specified, sets the hover method to the specified function and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.label" href="#Viz.label">#</a> Viz.**label**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L877)

If *value* is specified, sets the label accessor to the specified function or string and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.legend" href="#Viz.legend">#</a> Viz.**legend**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L887)

If *value* is specified, toggles the legend based on the specified boolean and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.legendConfig" href="#Viz.legendConfig">#</a> Viz.**legendConfig**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L897)

If *value* is specified, the object is passed to the legend's config method.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.legendTooltip" href="#Viz.legendTooltip">#</a> Viz.**legendTooltip**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L907)

If *value* is specified, sets the config method for the legend tooltip and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.legendPosition" href="#Viz.legendPosition">#</a> Viz.**legendPosition**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L917)

Defines which side of the visualization to anchor the legend. Expected values are `"top"`, `"bottom"`, `"left"`, and `"right"`.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.loadingHTML" href="#Viz.loadingHTML">#</a> Viz.**loadingHTML**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L927)

Sets the inner HTML of the status message that is displayed when loading AJAX requests and displaying errors. Must be a valid HTML string or a function that, when passed this Viz instance, returns a valid HTML string.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.loadingMessage" href="#Viz.loadingMessage">#</a> Viz.**loadingMessage**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L937)

Toggles the visibility of the status message that is displayed when loading AJAX requests and displaying errors.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.locale" href="#Viz.locale">#</a> Viz.**locale**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L947)

If *value* is specified, sets the locale to the specified string and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.messageMask" href="#Viz.messageMask">#</a> Viz.**messageMask**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L957)

Sets the color of the mask used underneath the status message that is displayed when loading AJAX requests and displaying errors. Additionally, `false` will turn off the mask completely.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.messageStyle" href="#Viz.messageStyle">#</a> Viz.**messageStyle**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L967)

Defines the CSS style properties for the status message that is displayed when loading AJAX requests and displaying errors.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.noDataHTML" href="#Viz.noDataHTML">#</a> Viz.**noDataHTML**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L977)

Sets the inner HTML of the status message that is displayed when no data is supplied to the visualization. Must be a valid HTML string or a function that, when passed this Viz instance, returns a valid HTML string.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.noDataMessage" href="#Viz.noDataMessage">#</a> Viz.**noDataMessage**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L987)

Toggles the visibility of the status message that is displayed when no data is supplied to the visualization.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.scrollContainer" href="#Viz.scrollContainer">#</a> Viz.**scrollContainer**(*selector*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L997)

If using scroll or visibility detection, this method allow a custom override of the element to which the scroll detection function gets attached.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.select" href="#Viz.select">#</a> Viz.**select**([*selector*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1007)

If *selector* is specified, sets the SVG container element to the specified d3 selector or DOM element and returns the current class instance. If *selector* is not specified, returns the current SVG container element, which is `undefined` by default.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.shape" href="#Viz.shape">#</a> Viz.**shape**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1017)

If *value* is specified, sets the shape accessor to the specified function or number and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.shapeConfig" href="#Viz.shapeConfig">#</a> Viz.**shapeConfig**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1027)

If *value* is specified, sets the config method for each shape and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.time" href="#Viz.time">#</a> Viz.**time**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1037)

If *value* is specified, sets the time accessor to the specified function or string and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.timeFilter" href="#Viz.timeFilter">#</a> Viz.**timeFilter**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1062)

If *value* is specified, sets the time filter to the specified function and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.timeline" href="#Viz.timeline">#</a> Viz.**timeline**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1072)

If *value* is specified, toggles the timeline based on the specified boolean and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.timelineConfig" href="#Viz.timelineConfig">#</a> Viz.**timelineConfig**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1082)

If *value* is specified, sets the config method for the timeline and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.title" href="#Viz.title">#</a> Viz.**title**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1092)

If *value* is specified, sets the title accessor to the specified function or string and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.titleConfig" href="#Viz.titleConfig">#</a> Viz.**titleConfig**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1102)

If *value* is specified, sets the config method for the title and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.tooltip" href="#Viz.tooltip">#</a> Viz.**tooltip**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1112)

If *value* is specified, toggles the tooltip based on the specified boolean and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.tooltipConfig" href="#Viz.tooltipConfig">#</a> Viz.**tooltipConfig**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1122)

If *value* is specified, sets the config method for the tooltip and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.total" href="#Viz.total">#</a> Viz.**total**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1132)

If *value* is specified, sets the total accessor to the specified function or string and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.totalConfig" href="#Viz.totalConfig">#</a> Viz.**totalConfig**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1142)

If *value* is specified, sets the config method for the total and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.totalFormat" href="#Viz.totalFormat">#</a> Viz.**totalFormat**(*value*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1152)

Formatter function for the value in the total bar.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.width" href="#Viz.width">#</a> Viz.**width**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1162)

If *value* is specified, sets the overallwidth to the specified number and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.zoom" href="#Viz.zoom">#</a> Viz.**zoom**(*value*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1172)

Toggles the ability to zoom/pan the visualization. Certain parameters for zooming are required to be hooked up on a visualization by visualization basis.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.zoomBrushHandleSize" href="#Viz.zoomBrushHandleSize">#</a> Viz.**zoomBrushHandleSize**(*value*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1182)

The pixel stroke-width of the zoom brush area.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.zoomBrushHandleStyle" href="#Viz.zoomBrushHandleStyle">#</a> Viz.**zoomBrushHandleStyle**(*value*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1192)

An object containing CSS key/value pairs that is used to style the outer handle area of the zoom brush. Passing `false` will remove all default styling.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.zoomBrushSelectionStyle" href="#Viz.zoomBrushSelectionStyle">#</a> Viz.**zoomBrushSelectionStyle**(*value*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1202)

An object containing CSS key/value pairs that is used to style the inner selection area of the zoom brush. Passing `false` will remove all default styling.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.zoomControlStyle" href="#Viz.zoomControlStyle">#</a> Viz.**zoomControlStyle**(*value*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1212)

An object containing CSS key/value pairs that is used to style each zoom control button (`.zoom-in`, `.zoom-out`, `.zoom-reset`, and `.zoom-brush`). Passing `false` will remove all default styling.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.zoomControlStyleActive" href="#Viz.zoomControlStyleActive">#</a> Viz.**zoomControlStyleActive**(*value*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1222)

An object containing CSS key/value pairs that is used to style each zoom control button when active (`.zoom-in`, `.zoom-out`, `.zoom-reset`, and `.zoom-brush`). Passing `false` will remove all default styling.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.zoomControlStyleHover" href="#Viz.zoomControlStyleHover">#</a> Viz.**zoomControlStyleHover**(*value*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1232)

An object containing CSS key/value pairs that is used to style each zoom control button on hover (`.zoom-in`, `.zoom-out`, `.zoom-reset`, and `.zoom-brush`). Passing `false` will remove all default styling.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.zoomFactor" href="#Viz.zoomFactor">#</a> Viz.**zoomFactor**(*value*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1242)

The multiplier that is used in with the control buttons when zooming in and out.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.zoomMax" href="#Viz.zoomMax">#</a> Viz.**zoomMax**(*value*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1252)

If *value* is specified, sets the max zoom scale to the specified number and returns the current class instance. If *value* is not specified, returns the current max zoom scale.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.zoomPan" href="#Viz.zoomPan">#</a> Viz.**zoomPan**(*value*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1262)

If *value* is specified, toggles panning to the specified boolean and returns the current class instance. If *value* is not specified, returns the current panning value.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.zoomPadding" href="#Viz.zoomPadding">#</a> Viz.**zoomPadding**(*value*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1272)

A pixel value to be used to pad all sides of a zoomed area.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.zoomScroll" href="#Viz.zoomScroll">#</a> Viz.**zoomScroll**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1282)

If *value* is specified, toggles scroll zooming to the specified boolean and returns the current class instance. If *value* is not specified, returns the current scroll zooming value.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.

---

<a name="dataFold"></a>
#### d3plus.**dataFold**(json, [data], [headers]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/data/fold.js#L1)

Given a JSON object where the data values and headers have been split into separate key lookups, this function will combine the data values with the headers and returns one large array of objects.


This is a global function.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| json | <code>Object</code> |  | A JSON data Object with `data` and `headers` keys. |
| [data] | <code>String</code> | <code>&quot;data&quot;</code> | The key used for the flat data array inside of the JSON object. |
| [headers] | <code>String</code> | <code>&quot;headers&quot;</code> | The key used for the flat headers array inside of the JSON object. |


---

<a name="dataLoad"></a>
#### d3plus.**dataLoad**(path, [formatter], [key], [callback]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/data/load.js#L4)

Loads data from a filepath or URL, converts it to a valid JSON object, and returns it to a callback function.


This is a global function.

| Param | Type | Description |
| --- | --- | --- |
| path | <code>Array</code> \| <code>String</code> | The path to the file or url to be loaded. If an Array is passed, the xhr request logic is skipped. |
| [formatter] | <code>function</code> | An optional formatter function that is run on the loaded data. |
| [key] | <code>String</code> | The key in the `this` context to save the resulting data to. |
| [callback] | <code>function</code> | A function that is called when the final data is loaded. It is passed 2 variables, any error present and the data loaded. |


---



###### <sub>Documentation generated on Fri, 03 Aug 2018 14:54:10 GMT</sub>
