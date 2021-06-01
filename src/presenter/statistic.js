import StatisticView from '../view/statistics.js';
import {render, remove, RenderPosition} from '../utils/render.js';
import {DatePeriod} from '../const.js';
import {getFilmGenresStat, getWatchedFilmByRange} from '../utils/statistic.js';
import {generateProfileRank} from '../utils/profile-rank.js';

export default class Statistic {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;

    this._statisticComponent = null;
    this._handleStatisticFilterChange = this._handleStatisticFilterChange.bind(this);
  }

  init() {
    this._statisticComponent = new StatisticView(this._getStatData(DatePeriod.ALL_TIME));

    this._statisticComponent.setFilterStatisticChangeHandler(this._handleStatisticFilterChange);

    render(this._container, this._statisticComponent, RenderPosition.BEFOREEND);
  }

  destroy() {
    remove(this._statisticComponent);
    this._statisticComponent = null;
  }

  _getStatData(period) {
    const films = this._filmsModel.get();
    const watchedFilms = getWatchedFilmByRange(films, period);
    const genresCount = getFilmGenresStat(watchedFilms);
    const genres = genresCount.map((genre) => genre[0]);
    const count = genresCount.map((genre) => genre[1]);
    const profileRank = generateProfileRank(films);

    return {
      period,
      watchedFilms,
      genresCount,
      genres,
      count,
      profileRank,
    };
  }

  _handleStatisticFilterChange(period) {
    this._statisticComponent.updateData(this._getStatData(period));
  }
}
