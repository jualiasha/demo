import { html } from 'lit';
import '../src/components/charts/LineChart.js';

export default {
  title: 'Line Chart',
  component: 'my-line-chart',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

function Template() {
  return html`
    <div style="--demo-story-background-color: 'white'">
      <my-line-chart .fetchId=${1}></my-line-chart>
    </div>
  `;
}

export const App = Template.bind({});
App.args = {
  backgroundColor: '#fff',
};
