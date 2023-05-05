>This component is not published anywhere, all this info is just for demo play. BUT!! If It is published readme will definately look like this :)

# my-line-chart

This is a web component called `my-line-chart`. Line && candlestick charts for analyzing currency price.

[See demo!](http://publishcomponentfordemoing.co)

>Please note that this component requires the [Highchart library](https://www.highcharts.com/), [date-fns library](https://date-fns.org/docs/Getting-Started#installation), [lit](https://lit.dev/) to function.

### Installation

To install `my-line-chart`

```
npm install @demo/my-line-chart
```

### Usage
To import component
```js
import {LineChart} from "@demo/my-line-chart/LineChart.js";
```
To use as defined CE:
```js
import "@demo/my-line-chart.js";
```
#### lit-html
```html
<my-line-chart .trendData=${[]} .trendCandleData=${[]}  @graph-click=${(e)=>console.log(e.detail.pointX} @point-click=${(e)=>console.log(e.detail.pointX)}></my-line-chart>
```

#### html
Using attributes
```html
<my-line-chart></my-line-chart>

<script>
const lineChart=document.querySelector('my-line-chart')
lineChart.trendData=[];
lineChart.trendCandleData=[];
lineChart.addEventListener('graph-click', (e)=>console.log(e.detail.pointX))
</script>
```


#### React
```js
import React from "react";
import {createComponent} from "@lit-labs/react";
import {LineChart} from "@demo/my-line-chart/LineChart.js";
export const LChart = createComponent(React, "my-line-chart", LineChart, { 
  onGraphClick: "graph-click",
  onPoinClick: "point-click"
});
// component use:
<LChart trendData={[]} trendCandleData={[]}  onGraphClick={(e)=>console.log(e.detail.pointX)} onPoinClick={(e)=>console.log(e.detail.pointX)}/>
```


### Attributes & Properties

The attribute name is equivalent to the property name, but in lowercase.

| Name       | Description                                                                 | Type    | Default |
|------------|-----------------------------------------------------------------------------|---------|---------|
| selectedArea   | Area colored by selection in the chart                                      | array   | null    |
| trendData | Data for the line chart type in format {x,y}                                | array   | null    |
| trendCandleData | Data for the candlestick chart type in format {x,open,close,high,low,color} | array   | null    |
| darkMode   | Toggling of dark mode of the chart                                          | boolean | false   |
| chartType       | Type of displaying data line/candlestick                                    | string  | "line"  |



### CSS Variables

| Name                        | Description                             | Default                |
|-----------------------------|-----------------------------------------|------------------------|
| --chart-margin              | margins from outer borders of the chart | 0                      |



### Events

| Event       | Description            | Detail                             | 
|-------------|------------------------|------------------------------------|
| graph-click | Emitted on graph click | pointX (:number); pointY (:number) |
| point-click | Emitted on point click | pointX (:number); pointY (:number)                       |

### Colors

| Target                   | Display                                                                                         | Color                | 
|--------------------------|-------------------------------------------------------------------------------------------------|----------------------|
| selectedArea             | <div style="background:rgba(51,92,173,0.25); width: 100px; height: 30px; margin: 0 auto"></div> | rgba(51,92,173,0.25) |
| trendLine                | <div style="background:#6B7280; width: 100px; height: 30px; margin: 0 auto"></div>              | #6B7280              |
| valuePlotLine            | <div style="background: #e51212; width: 100px; height: 30px; margin: 0 auto"></div>             | #e51212              |
| selectedTime             | <div style="background:#e51212; width: 100px; height: 30px; margin: 0 auto"></div>              | #e51212              |
| darkThemeBackgroundColor | <div style="background:#313131; width: 100px; height: 30px; margin: 0 auto"></div>              | #313131              |
| darkModeTrendLine        | <div style="background:#dedcdc; width: 100px; height: 30px; margin: 0 auto"></div>              | #dedcdc              |


