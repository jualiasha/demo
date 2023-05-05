import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import response from './fetchedData.json' assert { type: 'json' };
import '../src/components/charts/line-chart/my-line-chart.js';

const fetchedData = Object.values(response.response);
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
    color: res.o - res.c > 0 ? '#22C55E' : '#EF4444',
  });
});

describe('LineChart', () => {
  const chart = html`
    <my-line-chart
      .trendData=${trendData}
      .trendCandleData=${trendCandleData}
    ></my-line-chart>
  `;
  it('has main props to build chart', async () => {
    const el = await fixture(chart);
    expect(el.trendData.length).to.be.above(0);
    expect(el.trendCandleData.length).to.be.above(0);
  });
  it('updates theme with darkMode toggle', async () => {
    const el = await fixture(chart);
    expect(el.darkMode).to.be.false;
    el.darkMode = true;
    await el.updateComplete;
    expect(el._chart.options.chart.backgroundColor).to.equal('#313131');
  });
  it('switches to candlestick', async () => {
    const el = await fixture(chart);
    expect(el.chartType).to.equal('line');
    el.chartType = 'candle';
    await el.updateComplete;
    const candleDataMax = el._chart.get('candlestick').dataMax;
    expect(candleDataMax).to.be.above(0);
  });
});
