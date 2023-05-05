import { html } from 'lit';
import '../src/components/charts/line-chart/my-line-chart.js';
import { fetchChartData } from '../src/services/chartService.js';

const _fetch = async id => {
  let response = null;
  try {
    response = await fetchChartData(id);
  } catch (error) {
    console.log('fetchDataError:', error);
  }
  console.log(response);
  return Object.values(response.response);
};

const trendData = [];
const trendCandleData = [];
const fetchData = async id => {
  const fetchedData = await _fetch(id);
  fetchedData.forEach(res => {
    const x = res.t;
    const close = Number(res.c);
    trendData.push({
      x,
      y: close,
    });
    trendCandleData.push({
      x,
      open: Number(res.o),
      close,
      high: Number(res.h),
      low: Number(res.l),
      color: res.o - res.c > 0 ? '#22C55E' : '#EF4444',
    });
  });
};

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
const getLineChart = args => html` <my-line-chart
  .darkMode=${args.darkMode}
  .chartType=${args.chartType}
  .trendData=${trendData}
  .trendCandleData=${trendCandleData}
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
Default.loaders = [
  async () => ({
    todo: await fetchData(Default.args.fetchId),
  }),
];

export const CandleSticks = Template.bind({});
CandleSticks.args = {
  ...Default.args,
  chartType: 'candle',
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
