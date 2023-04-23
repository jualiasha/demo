/*
import { html, LitElement, css, nothing } from 'lit';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';

const colors = {
  positiveChange: 'var(--observer-green)',
  negativeChange: 'var(--deviation-red)',
};

export class FHTile extends LitElement {
  static get properties() {
    return {
      size: { type: String },
      darkMode: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.header = '';
    this.value = null;
    this.unit = '';
    this.change = null;
    this.iconName = '';
    this.size = 'medium';
    this.darkMode = false;
    this.deviationChange = [];
    this.tileType = '';
    this._tile = null;
  }

  isPositiveChange() {
    return this.change > 0;
  }

  render() {
    const classes = {
      'tile-square': this.tileType === 'square',
      'tile-dark-mode': this.darkMode,
    };
    return html` <div class='tile ${classMap(classes)} ' >
      ${when(
        this.tileType === 'square',
        () => html`<div part="header" class="header header-square">
            <div class="header-square-name">${this.header}</div>
            <sl-icon name=${this.iconName}></sl-icon>
          </div>
          <div part="value" class="value value-square">
            ${this.value}${this.unit}
          </div> `,
        () => html`${this.renderIcon()}
          <div class="data">
            <div part="header" class="header">${this.header}</div>
            <div class="numbers">
              <div part="value" class="value">${this.value} ${this.unit}</div>
              ${this.renderChangeValue()}
            </div>
          </div>`
      )}

      </div>
    </div>`;
  }

  firstUpdated() {
    this._tile = this.renderRoot.querySelector('.tile');
  }

  updated(changedProps) {
    if (changedProps.has('size')) {
      this.setTileSizeStyle();
    }
  }

  /!* eslint class-methods-use-this: "off" *!/

  // eslint-disable-next-line consistent-return
  renderIcon() {
    if (this.iconName && !this.tileType) {
      return html`<div part="main-icon" class="main-icon">
        <sl-icon name=${this.iconName}></sl-icon>
      </div> `;
    }
  }

  renderChangeValue() {
    if (this.change) {
      return html`<div
        part="change"
        class="change"
        style="color: ${this.isPositiveChange()
          ? colors.positiveChange
          : colors.negativeChange}"
      >
        ${this.isPositiveChange() ? '+' : ''}${this.change}%
      </div>`;
    }
    if (this.deviationChange?.length) {
      return html`<div class="deviation-change">
        <div class="deviation-change--positive">
          <sl-icon name="hand-thumbs-up"></sl-icon
          ><span>${this.deviationChange[0]}</span>
        </div>
        <div class="deviation-change--negative">
          <sl-icon
            class="deviation-icon--negative"
            name="hand-thumbs-down"
          ></sl-icon
          ><span>${this.deviationChange[1]}</span>
        </div>
      </div>`;
    }
    return nothing;
  }

  getRectangleMainIconStyle(key) {
    const mainIcon = this.renderRoot.querySelector('.main-icon');
    if (mainIcon) {
      this._tile.style.display = 'flex';
      switch (key) {
        case 'small':
          mainIcon.style.width = '100px';
          mainIcon.style.height = '80px';
          mainIcon.style.fontSize = '2.5rem';
          break;
        case 'large':
          mainIcon.style.width = '120px';
          mainIcon.style.height = '100px';
          mainIcon.style.fontSize = '3.44rem';
          break;
        default:
          mainIcon.style.width = '110px';
          mainIcon.style.height = '90px';
          mainIcon.style.fontSize = '3.13rem';
      }
    }
  }

  setTileSizeStyle() {
    const header = this.renderRoot.querySelector('.header');
    const value = this.renderRoot.querySelector('.value');
    if (this._tile && header && value && !this.tileType) {
      switch (this.size) {
        case 'small':
          header.style.fontSize = '1.25rem';
          value.style.fontSize = '3.125rem';
          value.style.marginRight = '3rem';
          this.getRectangleMainIconStyle('small');

          break;
        case 'large':
          header.style.fontSize = '1.88rem';
          value.style.fontSize = '4rem';
          value.style.marginRight = '7rem';
          this.getRectangleMainIconStyle('large');
          break;
        default:
          header.style.fontSize = '1.56rem';
          value.style.fontSize = '3.5rem';
          value.style.marginRight = '5rem';
          this.getRectangleMainIconStyle('medium');
      }
    }
    if (this.tileType === 'square') {
      switch (this.size) {
        case 'small':
          this._tile.style.height = '200px';
          header.style.fontSize = '2rem';
          value.style.fontSize = '2rem';
          break;
        case 'large':
          this._tile.style.height = '300px';
          header.style.fontSize = '4rem';
          value.style.fontSize = '4rem';
          break;
        default:
          this._tile.style.height = '250px';
          header.style.fontSize = '3rem';
          value.style.fontSize = '3rem';
      }
    }
  }

  static get styles() {
    return css`
      @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
      .tile {
        padding: 0.5rem;
        border-radius: 4px;
        border: 1px solid var(--tile-border-color, #000);
        font-family: 'Poppins', sans-serif;
        background-color: #fff;
        width: 100%;
      }
      .tile-dark-mode {
        border: 1px solid var(--sl-color-neutral-600);
        background-color: var(--sl-color-neutral-800);
        color: var(--sl-color-neutral-300);
      }
      .data {
        width: 100%;
      }
      .numbers {
        display: flex;
        justify-content: space-between;
      }
      .header {
        font-weight: 500;
        margin-bottom: 5px;
      }
      .value {
        font-weight: 600;
      }
      .change {
        font-size: 1.88rem;
        align-self: center;
      }
      .deviation-change {
        font-size: 1.88rem;
        align-self: center;
      }
      .deviation-change--positive,
      .deviation-change--negative {
        display: inline;
        margin-right: 3px;
      }
      .deviation-change--positive {
        color: var(--observer-green);
      }
      .deviation-change--negative {
        color: var(--deviation-red);
      }
      .main-icon {
        color: var(--icon-color, green);
        margin-right: 20px;
        background: var(--icon-background-color);
        border-radius: var(--icon-background-radius, 2px);
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .deviation-icon--negative::part(svg) {
        margin-top: 5px;
      }
      .header-square {
        display: flex;
        justify-content: space-between;
        padding: 1rem;
        margin-bottom: 20%;
      }
      .header-square-name {
        margin-right: 50px;
      }
      .value-square {
        display: flex;
        justify-content: center;
      }
      @media (max-width: 900px) {
        .tile-square {
          height: 130px !important;
        }
        .header-square {
          font-size: 2rem !important;
          margin-bottom: 15px; !important;
        }
        .value-square {
          font-size: 2rem !important;
        }
      }
      @media (max-width: 500px) {
        .header-square {
          font-size: 1.5rem !important;

        }
      }
    `;
  }
}

window.customElements.define('fh-tile', FHTile);
*/
