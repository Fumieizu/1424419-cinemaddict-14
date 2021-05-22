import AbstractView from './abstract.js';

export default class FooterStatistic extends AbstractView {
  constructor(count) {
    super();
    this._count = count;
  }

  getTemplate() {
    return `<section class="footer__statistics">
    <p>${this._count} movies inside</p>
  </section>`;
  }
}
