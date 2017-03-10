# d3plus-viz

[![NPM Release](http://img.shields.io/npm/v/d3plus-viz.svg?style=flat)](https://www.npmjs.org/package/d3plus-viz)
[![Build Status](https://travis-ci.org/d3plus/d3plus-viz.svg?branch=master)](https://travis-ci.org/d3plus/d3plus-viz)
[![Dependency Status](http://img.shields.io/david/d3plus/d3plus-viz.svg?style=flat)](https://david-dm.org/d3plus/d3plus-viz)
[![Slack](https://img.shields.io/badge/Slack-Click%20to%20Join!-green.svg?style=social)](https://goo.gl/forms/ynrKdvusekAwRMPf2)

Abstract ES6 class that drives d3plus visualizations.

## Installing

If you use NPM, `npm install d3plus-viz`. Otherwise, download the [latest release](https://github.com/d3plus/d3plus-viz/releases/latest). The released bundle supports AMD, CommonJS, and vanilla environments. Create a [custom bundle using Rollup](https://github.com/rollup/rollup) or your preferred bundler. You can also load directly from [d3plus.org](https://d3plus.org):

```html
<script src="https://d3plus.org/js/d3plus-viz.v0.7.full.min.js"></script>
```


## API Reference
### Classes

<dl>
<dt><a href="#Viz">Viz</a> ⇐ <code><a href="https://github.com/d3plus/d3plus-common#BaseClass">BaseClass</a></code></dt>
<dd></dd>
</dl>

### Functions

<dl>
<dt><a href="#dataFold">dataFold(json, [data], [headers])</a></dt>
<dd><p>Given a JSON object where the data values and headers have been split into separate key lookups, this function will combine the data values with the headers and returns one large array of objects.</p>
</dd>
<dt><a href="#dataLoad">dataLoad(path, [formatter], [key], [callback])</a></dt>
<dd><p>Loads data from a filepath or URL, converts it to a valid JSON object, and returns it to a callback function.</p>
</dd>
</dl>

<a name="Viz"></a>

### Viz ⇐ <code>[BaseClass](https://github.com/d3plus/d3plus-common#BaseClass)</code>
**Kind**: global class  
**Extends**: <code>[BaseClass](https://github.com/d3plus/d3plus-common#BaseClass)</code>  

* [Viz](#Viz) ⇐ <code>[BaseClass](https://github.com/d3plus/d3plus-common#BaseClass)</code>
    * [new Viz()](#new_Viz_new)
    * [.render([*callback*])](#Viz.render) ↩︎
    * [.active([*value*])](#Viz.active) ↩︎
    * [.aggs([*value*])](#Viz.aggs) ↩︎
    * [.backConfig([*value*])](#Viz.backConfig) ↩︎
    * [.color([*value*])](#Viz.color) ↩︎
    * [.colorScale([*value*])](#Viz.colorScale) ↩︎
    * [.colorScaleConfig([*value*])](#Viz.colorScaleConfig) ↩︎
    * [.colorScalePosition([*value*])](#Viz.colorScalePosition) ↩︎
    * [.controls([*value*])](#Viz.controls) ↩︎
    * [.controlConfig([*value*])](#Viz.controlConfig) ↩︎
    * [.data(*data*, [*formatter*])](#Viz.data) ↩︎
    * [.depth([*value*])](#Viz.depth) ↩︎
    * [.detectResize(*value*)](#Viz.detectResize) ↩︎
    * [.detectVisible(*value*)](#Viz.detectVisible) ↩︎
    * [.discrete([*value*])](#Viz.discrete) ↩︎
    * [.duration([*ms*])](#Viz.duration) ↩︎
    * [.filter([*value*])](#Viz.filter) ↩︎
    * [.groupBy([*value*])](#Viz.groupBy) ↩︎
    * [.height([*value*])](#Viz.height) ↩︎
    * [.hover([*value*])](#Viz.hover) ↩︎
    * [.label([*value*])](#Viz.label) ↩︎
    * [.legend([*value*])](#Viz.legend) ↩︎
    * [.legendConfig([*value*])](#Viz.legendConfig) ↩︎
    * [.legendPosition([*value*])](#Viz.legendPosition) ↩︎
    * [.locale([*value*])](#Viz.locale) ↩︎
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
    * [.width([*value*])](#Viz.width) ↩︎

<a name="new_Viz_new"></a>

#### new Viz()
Creates an x/y plot based on an array of data. If *data* is specified, immediately draws the tree map based on the specified array and returns the current class instance. If *data* is not specified on instantiation, it can be passed/updated after instantiation using the [data](#treemap.data) method. See [this example](https://d3plus.org/examples/d3plus-treemap/getting-started/) for help getting started using the treemap generator.

<a name="Viz.render"></a>

#### Viz.render([*callback*]) ↩︎
Draws the visualization given the specified configuration.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| [*callback*] | <code>function</code> | An optional callback function that, if passed, will be called after animation is complete. |

<a name="Viz.active"></a>

#### Viz.active([*value*]) ↩︎
If *value* is specified, sets the active method to the specified function and returns the current class instance. If *value* is not specified, returns the current active method.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type |
| --- | --- |
| [*value*] | <code>function</code> | 

<a name="Viz.aggs"></a>

#### Viz.aggs([*value*]) ↩︎
If *value* is specified, sets the aggregation method for each key in the object and returns the current class instance. If *value* is not specified, returns the current defined aggregation methods.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type |
| --- | --- |
| [*value*] | <code>Object</code> | 

<a name="Viz.backConfig"></a>

#### Viz.backConfig([*value*]) ↩︎
If *value* is specified, sets the config method for the back button and returns the current class instance. If *value* is not specified, returns the current back button configuration.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type |
| --- | --- |
| [*value*] | <code>Object</code> | 

<a name="Viz.color"></a>

#### Viz.color([*value*]) ↩︎
Defines the main color to be used for each data point in a visualization. Can be either an accessor function or a string key to reference in each data point. If a color value is returned, it will be used as is. If a string is returned, a unique color will be assigned based on the string.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type |
| --- | --- |
| [*value*] | <code>function</code> &#124; <code>String</code> | 

<a name="Viz.colorScale"></a>

#### Viz.colorScale([*value*]) ↩︎
Defines the value to be used for a color scale. Can be either an accessor function or a string key to reference in each data point.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type |
| --- | --- |
| [*value*] | <code>function</code> &#124; <code>String</code> | 

<a name="Viz.colorScaleConfig"></a>

#### Viz.colorScaleConfig([*value*]) ↩︎
A pass-through to the config method of ColorScale.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type |
| --- | --- |
| [*value*] | <code>Object</code> | 

<a name="Viz.colorScalePosition"></a>

#### Viz.colorScalePosition([*value*]) ↩︎
Defines which side of the visualization to anchor the color scale. Acceptable values are `"top"`, `"bottom"`, `"left"`, and `"right"`. If no value is passed, the current legend position will be returned.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type | Default |
| --- | --- | --- |
| [*value*] | <code>String</code> | <code>&quot;bottom&quot;</code> | 

<a name="Viz.controls"></a>

#### Viz.controls([*value*]) ↩︎
Defines a list of controls to be rendered at the bottom of the visualization.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type |
| --- | --- |
| [*value*] | <code>Array</code> | 

<a name="Viz.controlConfig"></a>

#### Viz.controlConfig([*value*]) ↩︎
If *value* is specified, sets the config method for the controls and returns the current class instance. If *value* is not specified, returns the current control configuration.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type |
| --- | --- |
| [*value*] | <code>Object</code> | 

<a name="Viz.data"></a>

#### Viz.data(*data*, [*formatter*]) ↩︎
Sets the primary data array to be used when drawing the visualization. The value passed should be an *Array* of objects or a *String* representing a filepath or URL to be loaded. The following filetypes are supported: `csv`, `tsv`, `txt`, and `json`.

Additionally, a custom formatting function can be passed as a second argument to this method. This custom function will be passed the data that has been loaded, as long as there are no errors. This function should return the final array of obejcts to be used as the primary data array. For example, some JSON APIs return the headers split from the data values to save bandwidth. These would need be joined using a custom formatter.

If *data* is not specified, this method returns the current primary data array, which defaults to an empty array (`[]`);

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| *data* | <code>Array</code> &#124; <code>String</code> | = [] |
| [*formatter*] | <code>function</code> |  |

<a name="Viz.depth"></a>

#### Viz.depth([*value*]) ↩︎
If *value* is specified, sets the depth to the specified number and returns the current class instance. The *value* should correspond with an index in the [groupBy](#groupBy) array. If *value* is not specified, returns the current depth.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type |
| --- | --- |
| [*value*] | <code>Number</code> | 

<a name="Viz.detectResize"></a>

#### Viz.detectResize(*value*) ↩︎
If the width and/or height of a Viz is not user-defined, it is determined by the size of it's parent element. When this method is set to `true`, the Viz will listen for the `window.onresize` event and adjust it's dimensions accordingly.

If no value is specified, the method will return the current *Boolean* value.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| *value* | <code>Boolean</code> | = true |

<a name="Viz.detectVisible"></a>

#### Viz.detectVisible(*value*) ↩︎
Toggles whether or not the Viz should try to detect if it visible in the current viewport. When this method is set to `true`, the Viz will only be rendered when it has entered the viewport either through scrolling or if it's display or visibility is changed.

If no value is specified, the method will return the current *Boolean* value.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| *value* | <code>Boolean</code> | = true |

<a name="Viz.discrete"></a>

#### Viz.discrete([*value*]) ↩︎
If *value* is specified, sets the discrete accessor to the specified method name (usually an axis) and returns the current class instance. If *value* is not specified, returns the current discrete method.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type |
| --- | --- |
| [*value*] | <code>String</code> | 

<a name="Viz.duration"></a>

#### Viz.duration([*ms*]) ↩︎
If *ms* is specified, sets the animation duration to the specified number and returns the current class instance. If *ms* is not specified, returns the current animation duration.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type | Default |
| --- | --- | --- |
| [*ms*] | <code>Number</code> | <code>600</code> | 

<a name="Viz.filter"></a>

#### Viz.filter([*value*]) ↩︎
If *value* is specified, sets the filter to the specified function and returns the current class instance. If *value* is not specified, returns the current filter.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type |
| --- | --- |
| [*value*] | <code>function</code> | 

<a name="Viz.groupBy"></a>

#### Viz.groupBy([*value*]) ↩︎
If *value* is specified, sets the group accessor(s) to the specified string, function, or array of values and returns the current class instance. If *value* is not specified, returns the current group accessor.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type |
| --- | --- |
| [*value*] | <code>String</code> &#124; <code>function</code> &#124; <code>Array</code> | 

**Example**  
```js
function value(d) {
  return d.id;
}
```
<a name="Viz.height"></a>

#### Viz.height([*value*]) ↩︎
If *value* is specified, sets the overall height to the specified number and returns the current class instance. If *value* is not specified, returns the current overall height.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type | Default |
| --- | --- | --- |
| [*value*] | <code>Number</code> | <code>window.innerHeight</code> | 

<a name="Viz.hover"></a>

#### Viz.hover([*value*]) ↩︎
If *value* is specified, sets the hover method to the specified function and returns the current class instance. If *value* is not specified, returns the current hover method.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type |
| --- | --- |
| [*value*] | <code>function</code> | 

<a name="Viz.label"></a>

#### Viz.label([*value*]) ↩︎
If *value* is specified, sets the label accessor to the specified function or string and returns the current class instance. If *value* is not specified, returns the current text accessor, which is `undefined` by default.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type |
| --- | --- |
| [*value*] | <code>function</code> &#124; <code>String</code> | 

<a name="Viz.legend"></a>

#### Viz.legend([*value*]) ↩︎
If *value* is specified, toggles the legend based on the specified boolean and returns the current class instance. If *value* is not specified, returns the current value.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type | Default |
| --- | --- | --- |
| [*value*] | <code>Boolean</code> | <code>true</code> | 

<a name="Viz.legendConfig"></a>

#### Viz.legendConfig([*value*]) ↩︎
If *value* is specified, the object is passed to the legend's config method. If *value* is not specified, returns the current legend config.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type |
| --- | --- |
| [*value*] | <code>Object</code> | 

<a name="Viz.legendPosition"></a>

#### Viz.legendPosition([*value*]) ↩︎
Defines which side of the visualization to anchor the legend. Acceptable values are `"top"`, `"bottom"`, `"left"`, and `"right"`. If no value is passed, the current legend position will be returned.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type | Default |
| --- | --- | --- |
| [*value*] | <code>String</code> | <code>&quot;bottom&quot;</code> | 

<a name="Viz.locale"></a>

#### Viz.locale([*value*]) ↩︎
If *value* is specified, sets the locale to the specified string and returns the current class instance. If *value* is not specified, returns the current locale.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type | Default |
| --- | --- | --- |
| [*value*] | <code>String</code> | <code>&quot;en-US&quot;</code> | 

<a name="Viz.select"></a>

#### Viz.select([*selector*]) ↩︎
If *selector* is specified, sets the SVG container element to the specified d3 selector or DOM element and returns the current class instance. If *selector* is not specified, returns the current SVG container element, which is `undefined` by default.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type |
| --- | --- |
| [*selector*] | <code>String</code> &#124; <code>HTMLElement</code> | 

<a name="Viz.shape"></a>

#### Viz.shape([*value*]) ↩︎
If *value* is specified, sets the shape accessor to the specified function or number and returns the current class instance. If *value* is not specified, returns the current shape accessor.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type |
| --- | --- |
| [*value*] | <code>function</code> &#124; <code>String</code> | 

<a name="Viz.shapeConfig"></a>

#### Viz.shapeConfig([*value*]) ↩︎
If *value* is specified, sets the config method for each shape and returns the current class instance. If *value* is not specified, returns the current shape configuration.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type |
| --- | --- |
| [*value*] | <code>Object</code> | 

<a name="Viz.time"></a>

#### Viz.time([*value*]) ↩︎
If *value* is specified, sets the time accessor to the specified function or string and returns the current class instance. If *value* is not specified, returns the current time accessor. The time values that are returned should be valid Date objects, 4-digit year values, or strings that can be parsed into javascript Date objects (click [here](http://dygraphs.com/date-formats.html) for valid string formats).

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type |
| --- | --- |
| [*value*] | <code>function</code> &#124; <code>String</code> | 

<a name="Viz.timeFilter"></a>

#### Viz.timeFilter([*value*]) ↩︎
If *value* is specified, sets the time filter to the specified function and returns the current class instance. If *value* is not specified, returns the current time filter.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type |
| --- | --- |
| [*value*] | <code>function</code> | 

<a name="Viz.timeline"></a>

#### Viz.timeline([*value*]) ↩︎
If *value* is specified, toggles the timeline based on the specified boolean and returns the current class instance. If *value* is not specified, returns the current timeline visibility.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type | Default |
| --- | --- | --- |
| [*value*] | <code>Boolean</code> | <code>true</code> | 

<a name="Viz.timelineConfig"></a>

#### Viz.timelineConfig([*value*]) ↩︎
If *value* is specified, sets the config method for the timeline and returns the current class instance. If *value* is not specified, returns the current timeline configuration.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type |
| --- | --- |
| [*value*] | <code>Object</code> | 

<a name="Viz.title"></a>

#### Viz.title([*value*]) ↩︎
If *value* is specified, sets the title accessor to the specified function or string and returns the current class instance. If *value* is not specified, returns the current title accessor.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type |
| --- | --- |
| [*value*] | <code>function</code> &#124; <code>String</code> | 

<a name="Viz.titleConfig"></a>

#### Viz.titleConfig([*value*]) ↩︎
If *value* is specified, sets the config method for the title and returns the current class instance. If *value* is not specified, returns the current title configuration.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type |
| --- | --- |
| [*value*] | <code>Object</code> | 

<a name="Viz.tooltip"></a>

#### Viz.tooltip([*value*]) ↩︎
If *value* is specified, toggles the tooltip based on the specified boolean and returns the current class instance. If *value* is not specified, returns the current tooltip visibility.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type | Default |
| --- | --- | --- |
| [*value*] | <code>Boolean</code> | <code>true</code> | 

<a name="Viz.tooltipConfig"></a>

#### Viz.tooltipConfig([*value*]) ↩︎
If *value* is specified, sets the config method for the tooltip and returns the current class instance. If *value* is not specified, returns the current tooltip configuration.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type |
| --- | --- |
| [*value*] | <code>Object</code> | 

<a name="Viz.total"></a>

#### Viz.total([*value*]) ↩︎
If *value* is specified, sets the total accessor to the specified function or string and returns the current class instance. If *value* is not specified, returns the current total accessor.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type |
| --- | --- |
| [*value*] | <code>Boolean</code> &#124; <code>function</code> &#124; <code>String</code> | 

<a name="Viz.totalConfig"></a>

#### Viz.totalConfig([*value*]) ↩︎
If *value* is specified, sets the config method for the total and returns the current class instance. If *value* is not specified, returns the current total configuration.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type |
| --- | --- |
| [*value*] | <code>Object</code> | 

<a name="Viz.width"></a>

#### Viz.width([*value*]) ↩︎
If *value* is specified, sets the overallwidth to the specified number and returns the current class instance. If *value* is not specified, returns the current overall width.

**Kind**: static method of <code>[Viz](#Viz)</code>  
**Chainable**  

| Param | Type | Default |
| --- | --- | --- |
| [*value*] | <code>Number</code> | <code>window.innerWidth</code> | 

<a name="dataFold"></a>

### dataFold(json, [data], [headers])
Given a JSON object where the data values and headers have been split into separate key lookups, this function will combine the data values with the headers and returns one large array of objects.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| json | <code>Object</code> |  | A JSON data Object with `data` and `headers` keys. |
| [data] | <code>String</code> | <code>&quot;data&quot;</code> | The key used for the flat data array inside of the JSON object. |
| [headers] | <code>String</code> | <code>&quot;headers&quot;</code> | The key used for the flat headers array inside of the JSON object. |

<a name="dataLoad"></a>

### dataLoad(path, [formatter], [key], [callback])
Loads data from a filepath or URL, converts it to a valid JSON object, and returns it to a callback function.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>Array</code> &#124; <code>String</code> | The path to the file or url to be loaded. If an Array is passed, the xhr request logic is skipped. |
| [formatter] | <code>function</code> | An optional formatter function that is run on the loaded data. |
| [key] | <code>String</code> | The key in the `this` context to save the resulting data to. |
| [callback] | <code>function</code> | A function that is called when the final data is loaded. It is passed 2 variables, any error present and the data loaded. |



###### <sub>Documentation generated on Fri, 10 Mar 2017 23:09:28 GMT</sub>
