import AbstractView from './abstract.js';

const createFilterItemTemplate = (filter) =>  {
  const {name, count} = filter;
  return (`
    <a href="#${name}" class="main-navigation__item">${name}<span class="main-navigation__item-count">${count}</span></a>
  `);
};

const createSiteMenu = (filterItems) => {
  const filterItemTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join('');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      ${filterItemTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class SiteMenu extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createSiteMenu(this._filters);
  }
}
