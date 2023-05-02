import { html } from 'lit';
import '../src/components/charts/LineChart.js';

const getStyles = args =>
  html`
    <style>
      #container {
        height: 100vh;
        background-color: ${args.darkMode
          ? 'var(--sl-color-gray-800)'
          : args.backgroundColor};
      }
      .events {
        color: ${args.darkMode ? '#fff' : 'inherit'};
      }
      .default {
        width: 100%;
      }

      li {
        font-size: 1.5rem;
      }
    </style>
  `;

const onPointClick = (pointX, pointY) => {
  const pointClick = document.querySelector('#pointClick');
  if (pointX && pointY) {
    pointClick.innerHTML = `open: ${pointX}, close:${pointY}`;
  } else {
    pointClick.innerHTML = '';
  }
};

const onGraphClick = pointY => {
  const graphClick = document.querySelector('#graphClick');
  if (pointY) {
    graphClick.innerHTML = `y:${pointY}`;
  } else {
    graphClick.innerHTML = '';
  }
};
const getLineChart = args =>
  html` <my-line-chart
    .fetchId=${args.fetchId}
    .darkMode=${args.darkMode}
    .chartType=${args.chartType}
    @graph-click=${e => onGraphClick(e.detail.pointY)}
    @point-click=${e => onPointClick(e.detail.pointX, e.detail.pointY)}
  ></my-line-chart>`;

const disabled = {
  table: {
    disable: true,
  },
};

export default {
  title: 'Charts/Line Chart',
  component: 'my-line-chart',
  argTypes: {
    backgroundColor: { control: 'color' },
    chartType: {
      options: ['line', 'candle'],
      control: { type: 'select' },
    },
    fetchId: { control: 'number', ...disabled },
    darkMode: { control: 'boolean' },
  },
  parameters: {
    backgrounds: {
      values: [{ name: 'dark', value: 'var(--sl-color-gray-800)' }],
    },
  },
};

function Template(args) {
  return html`
    ${getStyles(args)}
    <div id="container">
      <div class="default">${getLineChart(args)}</div>
      <div class="events">
        <h2>Events:</h2>
        <ul>
          <li>graph-click: <span id="graphClick"></span></li>
          <li>point-click: <span id="pointClick"></span></li>
        </ul>
      </div>
    </div>
  `;
}

export const Default = Template.bind({});
Default.args = {
  backgroundColor: '#fff',
  fetchId: 1,
  darkMode: false,
  chartType: 'line',
};

export const DarkMode = Template.bind({});
DarkMode.args = {
  ...Default.args,
  darkMode: true,
};
DarkMode.parameters = {
  backgrounds: {
    default: 'dark',
  },
};

export const CandleSticks = Template.bind({});
CandleSticks.args = {
  ...Default.args,
  chartType: 'candle',
};
