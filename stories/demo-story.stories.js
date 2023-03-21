import { html } from 'lit';


export default {
  title: 'DemoStory',
  component: 'demo-story-my',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

function Template({ header, backgroundColor }) {
  return html`
    <div
      style="--demo-story-background-color: ${backgroundColor || 'white'}"
    >
      Hello
    </div>
  `;
}

export const App = Template.bind({});
App.args = {
  header: 'My app',
};
