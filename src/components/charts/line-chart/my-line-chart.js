import { LineChart } from './LineChart.js';

if (!customElements.get('my-line-chart')) {
  customElements.define('my-line-chart', LineChart);
}
