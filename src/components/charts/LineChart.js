import { html, LitElement, css } from 'lit';
import Highcharts from 'highcharts/es-modules/masters/highstock.src.js';
import 'highcharts/es-modules/masters/modules/pattern-fill.src.js';
import 'highcharts/es-modules/masters/modules/accessibility.src.js';
import { format } from 'date-fns';
// import { fetchChartData } from '../../services/chartService';
import response from '../../services/fetchedData.json' assert { type: 'json' };

const lineChartColors = {
  selectedArea: 'rgba(51,92,173,0.25)',
  trendLine: '#6B7280',
  valuePlotLine: '#e51212',
  selectedTime: '#e51212',
  darkThemeBackgroundColor: '#313131',
  darkModeTrendLine: '#fff',
};

export class LineChart extends LitElement {
  static properties = {
    selectedArea: { type: Array },
    trendData: { type: Array },
    darkMode: { type: Boolean },
    chartType: { type: String },
  };

  constructor() {
    super();
    this._chart = null;
    this.selectedArea = null;
    this.trendData = null;
    this.fetchId = 1;
    this.darkMode = false;
    this.chartType = null;
  }

  /* eslint class-methods-use-this: "off" */

  async connectedCallback() {
    super.connectedCallback();
    this.trendData = await this._fetchTrendData();
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
    if (this._chart) {
      if (_changedProperties.has('trendData') && this.trendData) {
        this.updateChartData();
      }
      if (_changedProperties.has('darkMode')) {
        this.updateChartTheme();
      }
    }
  }

  render() {
    return html`<figure></figure>`;
  }

  firstUpdated() {
    this.initChart();
    this.updateChartTheme();
  }

  updateChartTheme() {
    if (this.darkMode) {
      this._chart.update({
        chart: {
          backgroundColor: lineChartColors.darkThemeBackgroundColor,
        },
        series: [
          {
            type: 'line',
            id: 'trend',
            color: lineChartColors.darkModeTrendLine,
          },
        ],
      });
    } else {
      this._chart.update({
        chart: {
          backgroundColor: 'transparent',
        },
        series: [
          {
            type: 'line',
            id: 'trend',
            color: lineChartColors.trendLine,
          },
        ],
      });
    }
  }

  updateChartXAxis(selectedTime) {
    const xUtc = this._getTimezoneTime(selectedTime, 'UTC');
    this._chart.update({
      xAxis: {
        plotBands: this.selectedArea ? [this.selectedArea] : [],
        plotLines: [
          {
            value: selectedTime,
            color: lineChartColors.selectedTime,
            width: 1,
            zIndex: 3,
            label: {
              verticalAlign: 'bottom',
              align: 'left',
              rotation: 0,
              text: `${format(xUtc, 'dd.MM HH:mm')}`,
              style: {
                color: lineChartColors.selectedTime,
              },
            },
          },
        ],
      },
    });
  }

  updateChartYAxis(value) {
    this._chart.update({
      yAxis: {
        plotLines: [
          {
            value,
            color: lineChartColors.valuePlotLine,
            width: 1,
            zIndex: 3,
            label: {
              text: `${value}`,
              align: 'right',
              style: {
                color: lineChartColors.valuePlotLine,
              },
            },
          },
        ],
      },
    });
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
              const valueFixed = value.toFixed(4);
              return `${Number(valueFixed)}`;
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

  graphClickEvent(e) {
    if (this.selectedArea) {
      this.hideSelectedArea();
    }
    const pointY = e.yAxis[0].value;
    const pointX = e.xAxis[0].value;
    const options = {
      detail: {
        pointX,
        pointY,
      },
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('graph-click', options));
  }

  pointClickEvent(e) {
    if (this.selectedArea) {
      this.hideSelectedArea();
    }
    const pointY = this.trendData.find(point => point.y >= e.point.y).y;
    const pointX = this.trendData.find(point => point.x >= e.point.x).x;
    const options = {
      detail: {
        pointX,
        pointY,
      },
      bubbles: true,
      composed: true,
    };
    this.updateChartXAxis(pointX);
    this.updateChartYAxis(pointY);
    this.dispatchEvent(new CustomEvent('point-click', options));
  }

  _getTimezoneTime = (date, timeZone) => {
    const zonedDate = new Date(date).toLocaleString('en-US', { timeZone });
    return new Date(Date.parse(zonedDate));
  };

  static styles = css`
    figure {
      margin: 0;
    }
  `;
}

customElements.define('my-line-chart', LineChart);
