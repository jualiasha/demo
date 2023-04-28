import { html, LitElement, css } from 'lit';
import Highcharts from 'highcharts/es-modules/masters/highstock.src.js';
import 'highcharts/es-modules/masters/modules/pattern-fill.src.js';
import 'highcharts/es-modules/masters/modules/accessibility.src.js';
// import { fetchChartData } from '../../services/chartService';
import response from '../../services/fetchedData.json' assert { type: 'json' };

const lineChartColors = {
  selectedArea: 'rgba(51,92,173,0.25)',
  selectedTime: '#212121',
  trendLine: '#6B7280',
};

export class LineChart extends LitElement {
  static properties = {
    selectedArea: { type: Array },
    trendData: { type: Array },
  };

  constructor() {
    super();
    this._chart = null;
    this.selectedArea = null;
    this.maxY = null;
    this.minY = null;
    this.trendData = null;
    this.fetchId = 1;
  }

  /* eslint class-methods-use-this: "off" */

  async connectedCallback() {
    super.connectedCallback();
    this.trendData = await this._fetchTrendData();
    const y = this.trendData.map(trend => trend.y);
    this.minY = Math.min(...y);
    this.maxY = Math.max(...y);
    console.log(this.trendData);
  }

  async _fetchTrendData() {
    /* let response = null;
    try {
      response = await fetchChartData(this.fetchId);
    } catch (error) {
      console.log('fetchDataError:', error);
    } */
    return Object.values(response.response).map(res => ({
      x: res.t,
      y: Number(res.c),
    }));
  }

  willUpdate(_changedProperties) {
    console.log(_changedProperties);
    if (_changedProperties.has('trendData') && this.trendData) {
      this.updateChartData();
    }
  }

  render() {
    return html`<figure></figure>`;
  }

  firstUpdated() {
    this.initChart();
  }

  updateChartData() {
    this._chart.update({
      series: [{ data: this.trendData }],
    });
  }

  initChart() {
    console.log(this.trendData);
    const range30min = 60000 * 30;
    const self = this;
    const figure = this.renderRoot.querySelector('figure');
    // eslint-disable-next-line new-cap
    this._chart = new Highcharts.stockChart(figure, {
      chart: {
        height: 350,
        backgroundColor: 'transparent',
        events: {
          click: e => this.graphClickEvent(e),
          selection(event) {
            event.preventDefault();
            self.selectedArea = {
              from: event.xAxis[0].min,
              to: event.xAxis[0].max,
              color: lineChartColors.selectedArea,
              id: 'selectedArea',
            };
          },
        },
        zoomType: 'x',
        margin: [0, 50, 50, 0],
        animation: false,
      },
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: false,
      },
      title: {
        text: null,
      },
      navigator: {
        enabled: false,
      },
      navigation: {
        buttonOptions: {
          enabled: false,
        },
      },
      rangeSelector: {
        enabled: false,
        inputEnabled: false,
      },
      scrollbar: {
        enabled: false,
      },
      xAxis: {
        crosshair: {
          snap: false,
        },
        type: 'datetime',
        title: {
          text: null,
        },
        maxPadding: 0.002,
        minRange: range30min,
        tickInterval: range30min,
      },

      yAxis: {
        title: {
          text: null,
        },
        crosshair: {
          snap: false,
          label: {
            enabled: true,
            backgroundColor: '#cccccc',
            padding: 3,
            shape: 'square',
            style: {
              fontSize: '0.8rem',
              color: '#000',
            },
            formatter(value) {
              return Number(value.toFixed(4));
            },
          },
        },
        opposite: true,
        gridLineWidth: 0,
        lineWidth: 1,
        tickWidth: 1,
        labels: {
          align: 'left',
        },
        endOnTick: false,
        startOnTick: false,
      },

      tooltip: {
        enabled: false,
      },

      legend: {
        enabled: false,
      },
      plotOptions: {
        series: {
          turboThreshold: 100000,
          lineWidth: 1,
          stickyTracking: false,
          states: {
            inactive: {
              opacity: 0.7,
            },
            hover: {
              lineWidthPlus: 0,
            },
          },
        },
      },
      series: [
        {
          type: 'line',
          name: 'Trend',
          id: 'trend',
          data: this.trendData,
          tooltip: {
            enabled: false,
          },
          color: lineChartColors.trendLine,
          marker: {
            enabled: false,
          },
          events: {
            click: e => this.pointClickEvent(e),
          },
        },
      ],
    });
  }

  hideSelectedArea() {
    this.selectedArea = null;
  }

  getTickInterval() {
    if ((this.maxY - this.minY) / 7 >= 1) {
      return Math.round((this.maxY - this.minY) / 7);
    }
    return Math.round((1000 * (this.maxY - this.minY)) / 5) / 1000;
  }

  graphClickEvent(e) {
    if (this.selectedArea) {
      this.hideSelectedArea();
    }
    const pointX =
      this.trendData.length ??
      this.trendData.find(point => point.x >= e.xAxis[0].value).x;
    const options = {
      detail: {
        pointX,
      },
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('line-chart-click', options));
  }

  pointClickEvent(e) {
    if (this.selectedArea) {
      this.hideSelectedArea();
    }
    const options = {
      detail: {
        pointX: e.point.x,
      },
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('line-chart-click', options));
  }

  static styles = css`
    figure {
      margin: 0;
    }
  `;
}

customElements.define('my-line-chart', LineChart);
