import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import '../src/components/charts/LineChart.js';

describe('LineChart', () => {
  const chart = html` <my-line-chart></my-line-chart> `;
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
