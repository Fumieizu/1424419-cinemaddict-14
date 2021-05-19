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
  }

  getTemplate() {
    return createSiteMenu(this._filters, this._currentFilter);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filter);
  }
}
