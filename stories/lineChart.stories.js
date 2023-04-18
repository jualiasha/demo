import { html } from 'lit';
import '../src/components/charts/LineChart.js';

export default {
  title: 'Line Chart',
  component: 'my-line-chart',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

function Template({ header, backgroundColor }) {
  return html`
    <div style="--demo-story-background-color: ${backgroundColor || 'white'}">
      <my-line-chart></my-line-chart>
    </div>
  `;
}

export const App = Template.bind({});
App.args = {
  header: 'My app',
};
