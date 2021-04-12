import {createElement} from '../util.js';

const createSiteStatistic = (count) => {
  return `<section class="footer__statistics">
    <p>${count} movies inside</p>
  </section>`;
};

export default class SiteStatistic {
  constructor(count) {
    this._count = count;
    this._element = null;
  }

  getTemplate() {
    return createSiteStatistic(this._count);
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
