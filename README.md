# d3plus-viz

[![NPM Release](http://img.shields.io/npm/v/d3plus-viz.svg?style=flat)](https://www.npmjs.org/package/d3plus-viz) [![Build Status](https://travis-ci.org/d3plus/d3plus-viz.svg?branch=master)](https://travis-ci.org/d3plus/d3plus-viz) [![Dependency Status](http://img.shields.io/david/d3plus/d3plus-viz.svg?style=flat)](https://david-dm.org/d3plus/d3plus-viz) [![Gitter](https://img.shields.io/badge/-chat_on_gitter-brightgreen.svg?style=flat&logo=gitter-white)](https://gitter.im/d3plus/)

Abstract ES6 class that drives d3plus visualizations.

## Installing

If you use NPM, `npm install d3plus-viz`. Otherwise, download the [latest release](https://github.com/d3plus/d3plus-viz/releases/latest). You can also load d3plus-viz as a standalone library or as part of [D3plus](https://github.com/d3plus/d3plus). ES modules, AMD, CommonJS, and vanilla environments are supported. In vanilla, a `d3plus` global is exported:

```html
<script src="https://cdn.jsdelivr.net/npm/d3plus-viz@1"></script>
<script>
  console.log(d3plus);
</script>
```

## API Reference

##### 
* [Viz](#Viz)

##### 
* [isData](#isData) - Adds the provided value to the internal queue to be loaded, if necessary. This is used internally in new d3plus visualizations that fold in additional data sources, like the nodes and links of Network or the topojson of Geomap.
* [dataConcat](#dataConcat) - Reduce and concat all the elements included in arrayOfArrays if they are arrays. If it is a JSON object try to concat the array under given key data. If the key doesn't exists in object item, a warning message is lauched to the console. You need to implement DataFormat callback to concat the arrays manually.
* [dataFold](#dataFold) - Given a JSON object where the data values and headers have been split into separate key lookups, this function will combine the data values with the headers and returns one large array of objects.
* [isData](#isData) - Returns true/false whether the argument provided to the function should be loaded using an internal XHR request. Valid data can either be a string URL or an Object with "url" and "headers" keys.
* [dataLoad](#dataLoad) - Loads data from a filepath or URL, converts it to a valid JSON object, and returns it to a callback function.
* [defaultPadding](#defaultPadding) - Default padding logic that will return false if the screen is less than 600 pixels wide.
* [listify](#listify) - Turns an array of values into a list string.
* [_thresholdFunction](#_thresholdFunction) - Applies the threshold algorithm according to the type of chart used.

---

<a name="Viz"></a>
#### **Viz** [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L70)


This is a global class, and extends all of the methods and functionality of [<code>BaseClass</code>](https://github.com/d3plus/d3plus-common#BaseClass).


* [Viz](#Viz) ⇐ [<code>BaseClass</code>](https://github.com/d3plus/d3plus-common#BaseClass)
    * [new Viz()](#new_Viz_new)
    * [.render([*callback*])](#Viz.render) ↩︎
    * [.active([*value*])](#Viz.active) ↩︎
    * [.aggs([*value*])](#Viz.aggs) ↩︎
    * [.ariaHidden([*value*])](#Viz.ariaHidden) ↩︎
    * [.attribution(*value*)](#Viz.attribution) ↩︎
    * [.attributionStyle([*value*])](#Viz.attributionStyle) ↩︎
    * [.backConfig([*value*])](#Viz.backConfig) ↩︎
    * [.cache([*value*])](#Viz.cache) ↩︎
    * [.color([*value*])](#Viz.color) ↩︎
    * [.colorScale([*value*])](#Viz.colorScale) ↩︎
    * [.colorScaleConfig([*value*])](#Viz.colorScaleConfig) ↩︎
    * [.colorScalePadding([*value*])](#Viz.colorScalePadding) ↩︎
    * [.colorScalePosition([*value*])](#Viz.colorScalePosition) ↩︎
    * [.colorScaleMaxSize([*value*])](#Viz.colorScaleMaxSize) ↩︎
    * [.data(*data*, [*formatter*])](#Viz.data) ↩︎
    * [.dataCutoff([*value*])](#Viz.dataCutoff) ↩︎
    * [.depth([*value*])](#Viz.depth) ↩︎
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
    * [.hiddenColor([*value*])](#Viz.hiddenColor) ↩︎
    * [.hiddenOpacity([*value*])](#Viz.hiddenOpacity) ↩︎
    * [.hover([*value*])](#Viz.hover) ↩︎
    * [.label([*value*])](#Viz.label) ↩︎
    * [.legend([*value*])](#Viz.legend) ↩︎
    * [.legendConfig([*value*])](#Viz.legendConfig) ↩︎
    * [.legendFilterInvert([*value*])](#Viz.legendFilterInvert) ↩︎
    * [.legendPadding([*value*])](#Viz.legendPadding) ↩︎
    * [.legendPosition([*value*])](#Viz.legendPosition) ↩︎
    * [.legendSort(*value*)](#Viz.legendSort) ↩︎
    * [.legendTooltip([*value*])](#Viz.legendTooltip) ↩︎
    * [.loadingHTML([*value*])](#Viz.loadingHTML) ↩︎
    * [.loadingMessage([*value*])](#Viz.loadingMessage) ↩︎
    * [.messageMask([*value*])](#Viz.messageMask) ↩︎
    * [.messageStyle([*value*])](#Viz.messageStyle) ↩︎
    * [.noDataHTML([*value*])](#Viz.noDataHTML) ↩︎
    * [.noDataMessage([*value*])](#Viz.noDataMessage) ↩︎
    * [.scrollContainer(*selector*)](#Viz.scrollContainer) ↩︎
    * [.select([*selector*])](#Viz.select) ↩︎
    * [.shape([*value*])](#Viz.shape) ↩︎
    * [.shapeConfig([*value*])](#Viz.shapeConfig) ↩︎
    * [.svgDesc([*value*])](#Viz.svgDesc) ↩︎
    * [.svgTitle([*value*])](#Viz.svgTitle) ↩︎
    * [.threshold([value])](#Viz.threshold) ↩︎
    * [.thresholdKey([value])](#Viz.thresholdKey) ↩︎
    * [.thresholdName([value])](#Viz.thresholdName) ↩︎
    * [.time([*value*])](#Viz.time) ↩︎
    * [.timeFilter([*value*])](#Viz.timeFilter) ↩︎
    * [.timeline([*value*])](#Viz.timeline) ↩︎
    * [.timelineConfig([*value*])](#Viz.timelineConfig) ↩︎
    * [.timelinePadding([*value*])](#Viz.timelinePadding) ↩︎
    * [.title([*value*])](#Viz.title) ↩︎
    * [.titleConfig([*value*])](#Viz.titleConfig) ↩︎
    * [.titlePadding([*value*])](#Viz.titlePadding) ↩︎
    * [.tooltip([*value*])](#Viz.tooltip) ↩︎
    * [.tooltipConfig([*value*])](#Viz.tooltipConfig) ↩︎
    * [.total([*value*])](#Viz.total) ↩︎
    * [.totalConfig([*value*])](#Viz.totalConfig) ↩︎
    * [.totalFormat(*value*)](#Viz.totalFormat) ↩︎
    * [.totalPadding([*value*])](#Viz.totalPadding) ↩︎
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





<a name="Viz.render" href="#Viz.render">#</a> Viz.**render**([*callback*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L510)

Draws the visualization given the specified configuration.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.active" href="#Viz.active">#</a> Viz.**active**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L710)

If *value* is specified, sets the active method to the specified function and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.aggs" href="#Viz.aggs">#</a> Viz.**aggs**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L728)

If *value* is specified, sets the aggregation method for each key in the object and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.ariaHidden" href="#Viz.ariaHidden">#</a> Viz.**ariaHidden**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L738)

Sets the "aria-hidden" attribute of the containing SVG element. The default value is "false", but it you need to hide the SVG from screen readers set this property to "true".


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.attribution" href="#Viz.attribution">#</a> Viz.**attribution**(*value*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L748)

Sets text to be shown positioned absolute on top of the visualization in the bottom-right corner. This is most often used in Geomaps to display the copyright of map tiles. The text is rendered as HTML, so any valid HTML string will render as expected (eg. anchor links work).


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.attributionStyle" href="#Viz.attributionStyle">#</a> Viz.**attributionStyle**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L758)

If *value* is specified, sets the config method for the back button and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.backConfig" href="#Viz.backConfig">#</a> Viz.**backConfig**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L768)

If *value* is specified, sets the config method for the back button and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.cache" href="#Viz.cache">#</a> Viz.**cache**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L778)

Enables a lru cache that stores up to 5 previously loaded files/URLs. Helpful when constantly writing over the data array with a URL in the render function of a react component.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.color" href="#Viz.color">#</a> Viz.**color**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L788)

Defines the main color to be used for each data point in a visualization. Can be either an accessor function or a string key to reference in each data point. If a color value is returned, it will be used as is. If a string is returned, a unique color will be assigned based on the string.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.colorScale" href="#Viz.colorScale">#</a> Viz.**colorScale**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L798)

Defines the value to be used for a color scale. Can be either an accessor function or a string key to reference in each data point.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.colorScaleConfig" href="#Viz.colorScaleConfig">#</a> Viz.**colorScaleConfig**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L808)

A pass-through to the config method of ColorScale.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.colorScalePadding" href="#Viz.colorScalePadding">#</a> Viz.**colorScalePadding**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L818)

Tells the colorScale whether or not to use the internal padding defined by the visualization in it's positioning. For example, d3plus-plot will add padding on the left so that the colorScale appears centered above the x-axis. By default, this padding is only applied on screens larger than 600 pixels wide.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.colorScalePosition" href="#Viz.colorScalePosition">#</a> Viz.**colorScalePosition**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L828)

Defines which side of the visualization to anchor the color scale. Acceptable values are `"top"`, `"bottom"`, `"left"`, `"right"`, and `false`. A `false` value will cause the color scale to not be displayed, but will still color shapes based on the scale.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.colorScaleMaxSize" href="#Viz.colorScaleMaxSize">#</a> Viz.**colorScaleMaxSize**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L838)

Sets the maximum pixel size for drawing the color scale: width for horizontal scales and height for vertical scales.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.data" href="#Viz.data">#</a> Viz.**data**(*data*, [*formatter*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L857)

Sets the primary data array to be used when drawing the visualization. The value passed should be an *Array* of objects or a *String* representing a filepath or URL to be loaded. The following filetypes are supported: `csv`, `tsv`, `txt`, and `json`.

If your data URL needs specific headers to be set, an Object with "url" and "headers" keys may also be passed.

Additionally, a custom formatting function can be passed as a second argument to this method. This custom function will be passed the data that has been loaded, as long as there are no errors. This function should return the final array of obejcts to be used as the primary data array. For example, some JSON APIs return the headers split from the data values to save bandwidth. These would need be joined using a custom formatter.

If you would like to specify certain configuration options based on the yet-to-be-loaded data, you can also return a full `config` object from the data formatter (including the new `data` array as a key in the object).

If *data* is not specified, this method returns the current primary data array, which defaults to an empty array (`[]`);


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.

| Param | Type | Description |
| --- | --- | --- |
| *data* | <code>Array</code> \| <code>String</code> | = [] |
| [*formatter*] | <code>function</code> |  |



<a name="Viz.dataCutoff" href="#Viz.dataCutoff">#</a> Viz.**dataCutoff**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L873)

If the number of visible data points exceeds this number, the default hover behavior will be disabled (helpful for very large visualizations bogging down the DOM with opacity updates).


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.depth" href="#Viz.depth">#</a> Viz.**depth**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L883)

If *value* is specified, sets the depth to the specified number and returns the current class instance. The *value* should correspond with an index in the [groupBy](#groupBy) array.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.detectResize" href="#Viz.detectResize">#</a> Viz.**detectResize**(*value*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L893)

If the width and/or height of a Viz is not user-defined, it is determined by the size of it's parent element. When this method is set to `true`, the Viz will listen for the `window.onresize` event and adjust it's dimensions accordingly.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.detectResizeDelay" href="#Viz.detectResizeDelay">#</a> Viz.**detectResizeDelay**(*value*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L903)

When resizing the browser window, this is the millisecond delay to trigger the resize event.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.detectVisible" href="#Viz.detectVisible">#</a> Viz.**detectVisible**(*value*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L913)

Toggles whether or not the Viz should try to detect if it visible in the current viewport. When this method is set to `true`, the Viz will only be rendered when it has entered the viewport either through scrolling or if it's display or visibility is changed.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.detectVisibleInterval" href="#Viz.detectVisibleInterval">#</a> Viz.**detectVisibleInterval**(*value*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L923)

The interval, in milliseconds, for checking if the visualization is visible on the page.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.discrete" href="#Viz.discrete">#</a> Viz.**discrete**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L933)

If *value* is specified, sets the discrete accessor to the specified method name (usually an axis) and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.downloadButton" href="#Viz.downloadButton">#</a> Viz.**downloadButton**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L943)

Shows a button that allows for downloading the current visualization.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.downloadConfig" href="#Viz.downloadConfig">#</a> Viz.**downloadConfig**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L953)

Sets specific options of the saveElement function used when downloading the visualization.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.downloadPosition" href="#Viz.downloadPosition">#</a> Viz.**downloadPosition**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L963)

Defines which control group to add the download button into.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.duration" href="#Viz.duration">#</a> Viz.**duration**([*ms*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L973)

If *ms* is specified, sets the animation duration to the specified number and returns the current class instance. If *ms* is not specified, returns the current animation duration.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.filter" href="#Viz.filter">#</a> Viz.**filter**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L983)

If *value* is specified, sets the filter to the specified function and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.groupBy" href="#Viz.groupBy">#</a> Viz.**groupBy**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L997)

If *value* is specified, sets the group accessor(s) to the specified string, function, or array of values and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


```js
function value(d) {
  return d.id;
}
```


<a name="Viz.height" href="#Viz.height">#</a> Viz.**height**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1021)

If *value* is specified, sets the overall height to the specified number and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.hiddenColor" href="#Viz.hiddenColor">#</a> Viz.**hiddenColor**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1031)

Defines the color used for legend shapes when the corresponding grouping is hidden from display (by clicking on the legend).


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.hiddenOpacity" href="#Viz.hiddenOpacity">#</a> Viz.**hiddenOpacity**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1041)

Defines the opacity used for legend labels when the corresponding grouping is hidden from display (by clicking on the legend).


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.hover" href="#Viz.hover">#</a> Viz.**hover**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1051)

If *value* is specified, sets the hover method to the specified function and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.label" href="#Viz.label">#</a> Viz.**label**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1089)

If *value* is specified, sets the label accessor to the specified function or string and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.legend" href="#Viz.legend">#</a> Viz.**legend**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1099)

If *value* is specified, toggles the legend based on the specified boolean and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.legendConfig" href="#Viz.legendConfig">#</a> Viz.**legendConfig**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1109)

If *value* is specified, the object is passed to the legend's config method.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.legendFilterInvert" href="#Viz.legendFilterInvert">#</a> Viz.**legendFilterInvert**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1119)

Defines the click functionality of categorical legend squares. When set to false, clicking will hide that category and shift+clicking will solo that category. When set to true, clicking with solo that category and shift+clicking will hide that category.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.legendPadding" href="#Viz.legendPadding">#</a> Viz.**legendPadding**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1129)

Tells the legend whether or not to use the internal padding defined by the visualization in it's positioning. For example, d3plus-plot will add padding on the left so that the legend appears centered underneath the x-axis. By default, this padding is only applied on screens larger than 600 pixels wide.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.legendPosition" href="#Viz.legendPosition">#</a> Viz.**legendPosition**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1139)

Defines which side of the visualization to anchor the legend. Expected values are `"top"`, `"bottom"`, `"left"`, and `"right"`.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.legendSort" href="#Viz.legendSort">#</a> Viz.**legendSort**(*value*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1149)

A JavaScript [sort comparator function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) used to sort the legend.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.legendTooltip" href="#Viz.legendTooltip">#</a> Viz.**legendTooltip**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1159)

If *value* is specified, sets the config method for the legend tooltip and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.loadingHTML" href="#Viz.loadingHTML">#</a> Viz.**loadingHTML**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1169)

Sets the inner HTML of the status message that is displayed when loading AJAX requests and displaying errors. Must be a valid HTML string or a function that, when passed this Viz instance, returns a valid HTML string.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.loadingMessage" href="#Viz.loadingMessage">#</a> Viz.**loadingMessage**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1179)

Toggles the visibility of the status message that is displayed when loading AJAX requests and displaying errors.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.messageMask" href="#Viz.messageMask">#</a> Viz.**messageMask**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1189)

Sets the color of the mask used underneath the status message that is displayed when loading AJAX requests and displaying errors. Additionally, `false` will turn off the mask completely.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.messageStyle" href="#Viz.messageStyle">#</a> Viz.**messageStyle**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1199)

Defines the CSS style properties for the status message that is displayed when loading AJAX requests and displaying errors.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.noDataHTML" href="#Viz.noDataHTML">#</a> Viz.**noDataHTML**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1209)

Sets the inner HTML of the status message that is displayed when no data is supplied to the visualization. Must be a valid HTML string or a function that, when passed this Viz instance, returns a valid HTML string.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.noDataMessage" href="#Viz.noDataMessage">#</a> Viz.**noDataMessage**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1219)

Toggles the visibility of the status message that is displayed when no data is supplied to the visualization.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.scrollContainer" href="#Viz.scrollContainer">#</a> Viz.**scrollContainer**(*selector*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1229)

If using scroll or visibility detection, this method allow a custom override of the element to which the scroll detection function gets attached.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.select" href="#Viz.select">#</a> Viz.**select**([*selector*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1239)

If *selector* is specified, sets the SVG container element to the specified d3 selector or DOM element and returns the current class instance. If *selector* is not specified, returns the current SVG container element, which is `undefined` by default.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.shape" href="#Viz.shape">#</a> Viz.**shape**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1249)

If *value* is specified, sets the shape accessor to the specified function or number and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.shapeConfig" href="#Viz.shapeConfig">#</a> Viz.**shapeConfig**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1259)

If *value* is specified, sets the config method for each shape and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.svgDesc" href="#Viz.svgDesc">#</a> Viz.**svgDesc**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1269)

If *value* is specified, sets the description accessor to the specified string and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.svgTitle" href="#Viz.svgTitle">#</a> Viz.**svgTitle**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1279)

If *value* is specified, sets the title accessor to the specified string and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.threshold" href="#Viz.threshold">#</a> Viz.**threshold**([value]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1289)

If *value* is specified, sets the threshold for buckets to the specified function or string, and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.thresholdKey" href="#Viz.thresholdKey">#</a> Viz.**thresholdKey**([value]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1308)

If *value* is specified, sets the accesor for the value used in the threshold algorithm, and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.thresholdName" href="#Viz.thresholdName">#</a> Viz.**thresholdName**([value]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1327)

If *value* is specified, sets the label for the bucket item, and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.time" href="#Viz.time">#</a> Viz.**time**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1337)

If *value* is specified, sets the time accessor to the specified function or string and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.timeFilter" href="#Viz.timeFilter">#</a> Viz.**timeFilter**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1366)

If *value* is specified, sets the time filter to the specified function and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.timeline" href="#Viz.timeline">#</a> Viz.**timeline**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1376)

If *value* is specified, toggles the timeline based on the specified boolean and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.timelineConfig" href="#Viz.timelineConfig">#</a> Viz.**timelineConfig**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1386)

If *value* is specified, sets the config method for the timeline and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.timelinePadding" href="#Viz.timelinePadding">#</a> Viz.**timelinePadding**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1396)

Tells the timeline whether or not to use the internal padding defined by the visualization in it's positioning. For example, d3plus-plot will add padding on the left so that the timeline appears centered underneath the x-axis. By default, this padding is only applied on screens larger than 600 pixels wide.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.title" href="#Viz.title">#</a> Viz.**title**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1406)

If *value* is specified, sets the title accessor to the specified function or string and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.titleConfig" href="#Viz.titleConfig">#</a> Viz.**titleConfig**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1416)

If *value* is specified, sets the config method for the title and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.titlePadding" href="#Viz.titlePadding">#</a> Viz.**titlePadding**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1426)

Tells the title whether or not to use the internal padding defined by the visualization in it's positioning. For example, d3plus-plot will add padding on the left so that the title appears centered above the x-axis. By default, this padding is only applied on screens larger than 600 pixels wide.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.tooltip" href="#Viz.tooltip">#</a> Viz.**tooltip**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1436)

If *value* is specified, toggles the tooltip based on the specified boolean and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.tooltipConfig" href="#Viz.tooltipConfig">#</a> Viz.**tooltipConfig**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1446)

If *value* is specified, sets the config method for the tooltip and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.total" href="#Viz.total">#</a> Viz.**total**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1456)

If *value* is specified, sets the total accessor to the specified function or string and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.totalConfig" href="#Viz.totalConfig">#</a> Viz.**totalConfig**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1472)

If *value* is specified, sets the config method for the total and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.totalFormat" href="#Viz.totalFormat">#</a> Viz.**totalFormat**(*value*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1482)

Formatter function for the value in the total bar.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.totalPadding" href="#Viz.totalPadding">#</a> Viz.**totalPadding**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1492)

Tells the total whether or not to use the internal padding defined by the visualization in it's positioning. For example, d3plus-plot will add padding on the left so that the total appears centered above the x-axis. By default, this padding is only applied on screens larger than 600 pixels wide.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.width" href="#Viz.width">#</a> Viz.**width**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1502)

If *value* is specified, sets the overallwidth to the specified number and returns the current class instance.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.zoom" href="#Viz.zoom">#</a> Viz.**zoom**(*value*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1512)

Toggles the ability to zoom/pan the visualization. Certain parameters for zooming are required to be hooked up on a visualization by visualization basis.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.zoomBrushHandleSize" href="#Viz.zoomBrushHandleSize">#</a> Viz.**zoomBrushHandleSize**(*value*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1522)

The pixel stroke-width of the zoom brush area.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.zoomBrushHandleStyle" href="#Viz.zoomBrushHandleStyle">#</a> Viz.**zoomBrushHandleStyle**(*value*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1532)

An object containing CSS key/value pairs that is used to style the outer handle area of the zoom brush. Passing `false` will remove all default styling.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.zoomBrushSelectionStyle" href="#Viz.zoomBrushSelectionStyle">#</a> Viz.**zoomBrushSelectionStyle**(*value*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1542)

An object containing CSS key/value pairs that is used to style the inner selection area of the zoom brush. Passing `false` will remove all default styling.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.zoomControlStyle" href="#Viz.zoomControlStyle">#</a> Viz.**zoomControlStyle**(*value*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1552)

An object containing CSS key/value pairs that is used to style each zoom control button (`.zoom-in`, `.zoom-out`, `.zoom-reset`, and `.zoom-brush`). Passing `false` will remove all default styling.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.zoomControlStyleActive" href="#Viz.zoomControlStyleActive">#</a> Viz.**zoomControlStyleActive**(*value*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1562)

An object containing CSS key/value pairs that is used to style each zoom control button when active (`.zoom-in`, `.zoom-out`, `.zoom-reset`, and `.zoom-brush`). Passing `false` will remove all default styling.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.zoomControlStyleHover" href="#Viz.zoomControlStyleHover">#</a> Viz.**zoomControlStyleHover**(*value*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1572)

An object containing CSS key/value pairs that is used to style each zoom control button on hover (`.zoom-in`, `.zoom-out`, `.zoom-reset`, and `.zoom-brush`). Passing `false` will remove all default styling.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.zoomFactor" href="#Viz.zoomFactor">#</a> Viz.**zoomFactor**(*value*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1582)

The multiplier that is used in with the control buttons when zooming in and out.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.zoomMax" href="#Viz.zoomMax">#</a> Viz.**zoomMax**(*value*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1592)

If *value* is specified, sets the max zoom scale to the specified number and returns the current class instance. If *value* is not specified, returns the current max zoom scale.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.zoomPan" href="#Viz.zoomPan">#</a> Viz.**zoomPan**(*value*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1602)

If *value* is specified, toggles panning to the specified boolean and returns the current class instance. If *value* is not specified, returns the current panning value.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.zoomPadding" href="#Viz.zoomPadding">#</a> Viz.**zoomPadding**(*value*) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1612)

A pixel value to be used to pad all sides of a zoomed area.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.


<a name="Viz.zoomScroll" href="#Viz.zoomScroll">#</a> Viz.**zoomScroll**([*value*]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L1622)

If *value* is specified, toggles scroll zooming to the specified boolean and returns the current class instance. If *value* is not specified, returns the current scroll zooming value.


This is a static method of [<code>Viz</code>](#Viz), and is chainable with other methods of this Class.

---

<a name="isData"></a>
#### d3plus.**isData**(data, [data], data) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/data/addToQueue.js#L4)

Adds the provided value to the internal queue to be loaded, if necessary. This is used internally in new d3plus visualizations that fold in additional data sources, like the nodes and links of Network or the topojson of Geomap.


This is a global function.

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Array</code> \| <code>String</code> \| <code>Object</code> | The data to be loaded |
| [data] | <code>function</code> | An optional data formatter/callback |
| data | <code>String</code> | The internal Viz method to be modified |


---

<a name="dataConcat"></a>
#### d3plus.**dataConcat**(arrayOfArray, [data]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/data/concat.js#L1)

Reduce and concat all the elements included in arrayOfArrays if they are arrays. If it is a JSON object try to concat the array under given key data. If the key doesn't exists in object item, a warning message is lauched to the console. You need to implement DataFormat callback to concat the arrays manually.


This is a global function.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| arrayOfArray | <code>Array</code> |  | Array of elements |
| [data] | <code>String</code> | <code>&quot;data&quot;</code> | The key used for the flat data array if exists inside of the JSON object. |


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

<a name="isData"></a>
#### d3plus.**isData**(dataItem) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/data/isData.js#L1)

Returns true/false whether the argument provided to the function should be loaded using an internal XHR request. Valid data can either be a string URL or an Object with "url" and "headers" keys.


This is a global function.

---

<a name="dataLoad"></a>
#### d3plus.**dataLoad**(path, [formatter], [key], [callback]) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/data/load.js#L7)

Loads data from a filepath or URL, converts it to a valid JSON object, and returns it to a callback function.


This is a global function.

| Param | Type | Description |
| --- | --- | --- |
| path | <code>Array</code> \| <code>String</code> | The path to the file or url to be loaded. Also support array of paths strings. If an Array of objects is passed, the xhr request logic is skipped. |
| [formatter] | <code>function</code> | An optional formatter function that is run on the loaded data. |
| [key] | <code>String</code> | The key in the `this` context to save the resulting data to. |
| [callback] | <code>function</code> | A function that is called when the final data is loaded. It is passed 2 variables, any error present and the data loaded. |


---

<a name="defaultPadding"></a>
#### d3plus.**defaultPadding**() [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L53)

Default padding logic that will return false if the screen is less than 600 pixels wide.


This is a global function.

---

<a name="listify"></a>
#### d3plus.**listify**() [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L60)

Turns an array of values into a list string.


This is a global function.

---

<a name="_thresholdFunction"></a>
#### d3plus.**_thresholdFunction**(data) [<>](https://github.com/d3plus/d3plus-viz/blob/master/src/Viz.js#L500)

Applies the threshold algorithm according to the type of chart used.


This is a global function.

---



###### <sub>Documentation generated on Fri, 15 Apr 2022 18:24:17 GMT</sub>
