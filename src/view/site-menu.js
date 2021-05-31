import AbstractView from './abstract.js';

const createFilterItemTemplate = (filter, currentFilterType) =>  {
  const {type, count} = filter;

  return (`
    <a href="#${type}" data-filter="${type}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}">
    ${type === 'All' ? `${type} movies` : `${type} <span class="main-navigation__item-count">${count}</span>`}</a>
  `);

};

const createSiteMenu = (filterItems, currentFilterType) => {
  const filterItemTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class SiteMenu extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._statsClickHandler = this._statsClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenu(this._filters, this._currentFilter);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().querySelectorAll('.main-navigation__item')
      .forEach((filter) =>filter.addEventListener('click', this._filterTypeChangeHandler));
  }

  setStatsClickHandler(callback) {
    this._callback.statsClick = callback;

    this.getElement().querySelector('.main-navigation__additional')
      .addEventListener('click', this._statsClickHandler);
  }

  _filterTypeChangeHandler(evt) {
    if (this._currentFilter === evt.target.dataset.filter) {
      return;
    }

    evt.preventDefault();

    if (evt.target.classList.contains('main-navigation__item-count')) {
      this._callback.filterTypeChange(evt.target.parentNode.dataset.filter);
      return;
    }

    this._callback.filterTypeChange(evt.target.dataset.filter);
  }

  _statsClickHandler(evt) {
    const statClick = this.getElement().querySelector('.main-navigation__additional');

    evt.preventDefault();

    if (statClick.classList.contains('main-navigation__item--active')) {
      return;
    }

    this.getElement().querySelector('.main-navigation__item--active').classList.remove('main-navigation__item--active');

    this._currentFilter = null;

    statClick.classList.add('main-navigation__item--active');

    this._callback.statsClick();
  }
}
