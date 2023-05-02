import { html, LitElement, css } from 'lit';
import Highcharts from 'highcharts/es-modules/masters/highstock.src.js';
import 'highcharts/es-modules/masters/modules/pattern-fill.src.js';
import 'highcharts/es-modules/masters/modules/accessibility.src.js';
import { format } from 'date-fns';
// import { fetchChartData } from '../../services/chartService.js';
import response from '../../services/fetchedData.json' assert { type: 'json' };

const lineChartColors = {
  selectedArea: 'rgba(51,92,173,0.25)',
  trendLine: '#6B7280',
  valuePlotLine: '#e51212',
  selectedTime: '#e51212',
  darkThemeBackgroundColor: '#313131',
  darkModeTrendLine: '#dedcdc',
  bullCandle: '#22C55E',
  bearCandle: '#EF4444',
};

export class LineChart extends LitElement {
  static properties = {
    selectedArea: { type: Array },
    trendData: { type: Array },
    trendCandleData: { type: Array },
    darkMode: { type: Boolean },
    chartType: { type: String },
  };

  constructor() {
    super();
    this._chart = null;
    this.selectedArea = null;
    this.trendData = null;
    this.trendCandleData = null;
    this.fetchId = 1;
    this.darkMode = false;
    this.chartType = 'line';
  }

  /* eslint class-methods-use-this: "off" */

  async connectedCallback() {
    super.connectedCallback();
    const fetchedData = await this._fetchData();
    const trendData = [];
    const trendCandleData = [];
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
        color:
          res.o - res.c > 0
            ? lineChartColors.bullCandle
            : lineChartColors.bearCandle,
      });
    });
    this.trendData = trendData;
    this.trendCandleData = trendCandleData;
  }

  async _fetchData() {
    // let response = null;
    // try {
    //   response = await fetchChartData(this.fetchId);
    // } catch (error) {
    //   console.log('fetchDataError:', error);
    // }
    return Object.values(response.response);
  }

  shouldUpdateChartData(_changedProperties) {
    return (
      (_changedProperties.has('trendData') && this.trendData) ||
      (_changedProperties.has('trendCandleData') && this.trendCandleData) ||
      _changedProperties.has('chartType')
    );
  }

  willUpdate(_changedProperties) {
    console.log(_changedProperties, this.selectedArea);
    if (this._chart) {
      if (this.shouldUpdateChartData(_changedProperties)) {
        this.updateChartData();
      }
      if (_changedProperties.has('darkMode')) {
        this.updateChartTheme();
      }
      if (_changedProperties.has('selectedArea')) {
        this.updateChartXAxis();
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

  updateChartData() {
    this._chart.update({
      series: [
        {
          data: this.isLineChart() ? this.trendData : [],
        },
        {
          data: !this.isLineChart() ? this.trendCandleData : [],
        },
      ],
    });
  }

  updateChartTheme() {
    if (this.darkMode) {
      this._chart.update({
        chart: {
          backgroundColor: lineChartColors.darkThemeBackgroundColor,
        },
        plotOptions: {
          candlestick: {
            lineColor: lineChartColors.darkModeTrendLine,
          },
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
        plotOptions: {
          candlestick: {
            lineColor: lineChartColors.trendLine,
          },
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
    console.log(selectedTime);
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
              text: `${selectedTime ? format(xUtc, 'dd.MM HH:mm') : ''}`,
              style: {
                color: lineChartColors.selectedTime,
              },
            },
          },
        ],
      },
    });
  }

  updateYAxisPlotLine(value) {
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
          selection: event => {
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
          data: this.isLineChart() ? this.trendData : [],
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
        {
          type: 'candlestick',
          name: 'Candle',
          id: 'candle',
          data: !this.isLineChart() ? this.trendCandleData : [],
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

  isLineChart() {
    return this.chartType === 'line';
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
    this.updateYAxisPlotLine(pointY);
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
    this.updateYAxisPlotLine(pointY);
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
