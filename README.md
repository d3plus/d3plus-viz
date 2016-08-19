# d3plus-viz

[![NPM Release](http://img.shields.io/npm/v/d3plus-viz.svg?style=flat)](https://www.npmjs.org/package/d3plus-viz)
[![Build Status](https://travis-ci.org/d3plus/d3plus-viz.svg?branch=master)](https://travis-ci.org/d3plus/d3plus-viz)
[![Dependency Status](http://img.shields.io/david/d3plus/d3plus-viz.svg?style=flat)](https://david-dm.org/d3plus/d3plus-viz)
[![Slack](https://img.shields.io/badge/Slack-Click%20to%20Join!-green.svg?style=social)](https://goo.gl/forms/ynrKdvusekAwRMPf2)

Abstract ES6 class that drives d3plus visualizations.

## Installing

If you use NPM, `npm install d3plus-viz`. Otherwise, download the [latest release](https://github.com/d3plus/d3plus-viz/releases/latest). The released bundle supports AMD, CommonJS, and vanilla environments. Create a [custom bundle using Rollup](https://github.com/rollup/rollup) or your preferred bundler. You can also load directly from [d3plus.org](https://d3plus.org):

```html
<script src="https://d3plus.org/js/d3plus-viz.v0.1.full.min.js"></script>
```


## API Reference
### Classes

<dl>
<dt><a href="#Viz">Viz</a></dt>
<dd></dd>
</dl>

### Functions

<dl>
<dt><a href="#getSize">getSize(elem)</a></dt>
<dd><p>Finds the available width and height for a specified HTMLElement, traversing it&#39;s parents until it finds something with constrained dimensions. Falls back to the inner dimensions of the browser window if none is found.</p>
</dd>
</dl>

<a name="Viz"></a>

### Viz
**Kind**: global class  

* [Viz](#Viz)
    * [new Viz()](#new_Viz_new)
    * [.data([*data*])](#Viz.data)
    * [.depth([*value*])](#Viz.depth)
    * [.duration([*ms*])](#Viz.duration)
    * [.filter([*value*])](#Viz.filter)
    * [.groupBy([*value*])](#Viz.groupBy)
    * [.height([*value*])](#Viz.height)
    * [.highlight([*value*])](#Viz.highlight)
    * [.label([*value*])](#Viz.label)
    * [.legend([*value*])](#Viz.legend)
    * [.on([*typenames*], [*listener*])](#Viz.on)
    * [.select([*selector*])](#Viz.select)
    * [.shape([*value*])](#Viz.shape)
    * [.shapeConfig([*value*])](#Viz.shapeConfig)
    * [.tooltip([*value*])](#Viz.tooltip)
    * [.update([*ms*])](#Viz.update)
    * [.width([*value*])](#Viz.width)

<a name="new_Viz_new"></a>

#### new Viz()
Creates an x/y plot based on an array of data. If *data* is specified, immediately draws the tree map based on the specified array and returns the current class instance. If *data* is not specified on instantiation, it can be passed/updated after instantiation using the [data](#treemap.data) method. See [this example](https://d3plus.org/examples/d3plus-treemap/getting-started/) for help getting started using the treemap generator.

<a name="Viz.data"></a>

#### Viz.data([*data*])
If *data* is specified, sets the data array to the specified array and returns the current class instance. If *data* is not specified, returns the current data array.

**Kind**: static method of <code>[Viz](#Viz)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [*data*] | <code>Array</code> | <code>[]</code> | 

<a name="Viz.depth"></a>

#### Viz.depth([*value*])
If *value* is specified, sets the depth to the specified number and returns the current class instance. The *value* should correspond with an index in the [groupBy](#groupBy) array. If *value* is not specified, returns the current depth.

**Kind**: static method of <code>[Viz](#Viz)</code>  

| Param | Type |
| --- | --- |
| [*value*] | <code>Number</code> | 

<a name="Viz.duration"></a>

#### Viz.duration([*ms*])
If *ms* is specified, sets the animation duration to the specified number and returns the current class instance. If *ms* is not specified, returns the current animation duration.

**Kind**: static method of <code>[Viz](#Viz)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [*ms*] | <code>Number</code> | <code>600</code> | 

<a name="Viz.filter"></a>

#### Viz.filter([*value*])
If *value* is specified, sets the filter to the specified function and returns the current class instance. If *value* is not specified, returns the current filter.

**Kind**: static method of <code>[Viz](#Viz)</code>  

| Param | Type |
| --- | --- |
| [*value*] | <code>function</code> | 

<a name="Viz.groupBy"></a>

#### Viz.groupBy([*value*])
If *value* is specified, sets the group accessor(s) to the specified string, function, or array of values and returns the current class instance. If *value* is not specified, returns the current group accessor.

**Kind**: static method of <code>[Viz](#Viz)</code>  

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

#### Viz.height([*value*])
If *value* is specified, sets the overallheight to the specified number and returns the current class instance. If *value* is not specified, returns the current overall height.

**Kind**: static method of <code>[Viz](#Viz)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [*value*] | <code>Number</code> | <code>window.innerHeight</code> | 

<a name="Viz.highlight"></a>

#### Viz.highlight([*value*])
If *value* is specified, sets the highlight filter to the specified function and returns the current class instance. If *value* is not specified, returns the current highlight filter. When the highlight function returns true given a data point, the highlight styles will be used.

**Kind**: static method of <code>[Viz](#Viz)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [*value*] | <code>function</code> | <code>false</code> | 

<a name="Viz.label"></a>

#### Viz.label([*value*])
If *value* is specified, sets the label accessor to the specified function or string and returns the current class instance. If *value* is not specified, returns the current text accessor, which is `undefined` by default.

**Kind**: static method of <code>[Viz](#Viz)</code>  

| Param | Type |
| --- | --- |
| [*value*] | <code>function</code> &#124; <code>String</code> | 

<a name="Viz.legend"></a>

#### Viz.legend([*value*])
If *value* is specified, toggles the legend based on the specified boolean and returns the current class instance. If *value* is an object, then it is passed to the legend's config method. If *value* is not specified, returns the current value.

**Kind**: static method of <code>[Viz](#Viz)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [*value*] | <code>Boolean</code> &#124; <code>Object</code> | <code>true</code> | 

<a name="Viz.on"></a>

#### Viz.on([*typenames*], [*listener*])
Adds or removes a *listener* to each shape for the specified event *typenames*. If a *listener* is not specified, returns the currently-assigned listener for the specified event *typename*. Mirrors the core [d3-selection](https://github.com/d3/d3-selection#selection_on) behavior.

**Kind**: static method of <code>[Viz](#Viz)</code>  

| Param | Type |
| --- | --- |
| [*typenames*] | <code>String</code> | 
| [*listener*] | <code>function</code> | 

**Example** *(By default, listeners apply to both the shapes and the legend. Passing a namespace with the typename gives control over specific elements:)*  
```js
new Plot
  .on("click.shape", function(d) {
    console.log("data for shape clicked:", d);
  })
  .on("click.legend", function(d) {
    console.log("data for legend clicked:", d);
  })
```
<a name="Viz.select"></a>

#### Viz.select([*selector*])
If *selector* is specified, sets the SVG container element to the specified d3 selector or DOM element and returns the current class instance. If *selector* is not specified, returns the current SVG container element, which is `undefined` by default.

**Kind**: static method of <code>[Viz](#Viz)</code>  

| Param | Type |
| --- | --- |
| [*selector*] | <code>String</code> &#124; <code>HTMLElement</code> | 

<a name="Viz.shape"></a>

#### Viz.shape([*value*])
If *value* is specified, sets the shape accessor to the specified function or number and returns the current class instance. If *value* is not specified, returns the current shape accessor.

**Kind**: static method of <code>[Viz](#Viz)</code>  

| Param | Type |
| --- | --- |
| [*value*] | <code>function</code> &#124; <code>String</code> | 

<a name="Viz.shapeConfig"></a>

#### Viz.shapeConfig([*value*])
If *value* is specified, sets the config method for each shape and returns the current class instance. If *value* is not specified, returns the current shape configuration.

**Kind**: static method of <code>[Viz](#Viz)</code>  

| Param | Type |
| --- | --- |
| [*value*] | <code>Object</code> | 

<a name="Viz.tooltip"></a>

#### Viz.tooltip([*value*])
If *value* is specified, toggles the tooltip based on the specified boolean and returns the current class instance. If *value* is an object, then it is passed to the tooltip's config method. If *value* is not specified, returns the current tooltip visibility.

**Kind**: static method of <code>[Viz](#Viz)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [*value*] | <code>Boolean</code> &#124; <code>Object</code> | <code>true</code> | 

<a name="Viz.update"></a>

#### Viz.update([*ms*])
If *ms* is specified, all shapes will redraw using the specified duration and return this generator. If *ms* is not specified, shapes will redraw instantly. This method is useful when only needing to change visual styles (and not data), like when setting custom [mouse events](#Plot.on).

**Kind**: static method of <code>[Viz](#Viz)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [*ms*] | <code>Number</code> | <code>0</code> | 

<a name="Viz.width"></a>

#### Viz.width([*value*])
If *value* is specified, sets the overallwidth to the specified number and returns the current class instance. If *value* is not specified, returns the current overall width.

**Kind**: static method of <code>[Viz](#Viz)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [*value*] | <code>Number</code> | <code>window.innerWidth</code> | 

<a name="getSize"></a>

### getSize(elem)
Finds the available width and height for a specified HTMLElement, traversing it's parents until it finds something with constrained dimensions. Falls back to the inner dimensions of the browser window if none is found.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| elem | <code>HTMLElement</code> | The HTMLElement to find dimensions for. |



###### <sub>Documentation generated on Fri, 19 Aug 2016 02:02:13 GMT</sub>
