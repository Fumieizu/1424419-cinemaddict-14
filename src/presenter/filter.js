import SiteMenuView from '../view/site-menu.js';
import {render, RenderPosition, remove, replace} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import {FilterType, UpdateType} from '../const.js';

export default class Filter {
  constructor(filterContainer, filterModel, filmsModel, renderStatistic, renderSiteContent) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._renderStatistic = renderStatistic;
    this._renderSiteContent = renderSiteContent;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._statsClickHandler = this._statsClickHandler.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filter = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new SiteMenuView(filter, this._filterModel.get());

    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);
    this._filterComponent.setStatsClickHandler(this._statsClickHandler);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    this._filterModel.set(UpdateType.MAJOR, filterType);
    this._renderSiteContent();
  }

  _statsClickHandler() {
    this._renderStatistic();
  }

  _getFilters() {
    const films = this._filmsModel.get();

    return [
      {
        type: FilterType.ALL,
        name: FilterType.ALL_MOVIES,
        count: filter[FilterType.ALL](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: FilterType.WATCHLIST,
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        name: FilterType.HISTORY,
        count: filter[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: FilterType.FAVORITES,
        count: filter[FilterType.FAVORITES](films).length,
      },
    ];
  }
}
