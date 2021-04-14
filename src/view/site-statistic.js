import {createElement} from '../util.js';

export default class SiteStatistic {
  constructor(count) {
    this._count = count;
    this._element = null;
  }

  getTemplate() {
    return `<section class="footer__statistics">
    <p>${this._count} movies inside</p>
  </section>`;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
