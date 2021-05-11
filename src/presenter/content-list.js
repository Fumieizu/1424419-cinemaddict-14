import SortView from '../view/sort.js';
import SiteContainerView from '../view/site-content-container.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import NoFilmView from '../view/no-film.js';
import FilmPresenter from './film.js';
import {RenderPosition, render, remove} from '../utils/render.js';
import {filter} from '../utils/filter.js';
// import {updateItem} from '../utils/common.js';
import {SortType, UpdateType, UserAction} from '../const.js';
import {sortByDate, sortByRating} from '../utils/film.js';

const FILM_COUNT_PER_STEP = 5;
const EXTRA_FILMS_COUNT = 2;


export default class FilmBoard {
  constructor(boardContainer, siteBody, filmsModel, commentsModel, filterModel) {
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._filterModel = filterModel;
    this._boardContainer = boardContainer;
    this._siteBody = siteBody;
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    this._filmPresenters = {
      allFilmsList: {},
      topRatingList: {},
      mostCommentList: {},
    };

    this._siteContainer = new SiteContainerView();
    this._sort = null;
    this._noFilm = new NoFilmView();
    this._showMoreButton = null;

    this._currentSortType = SortType.DEFAULT;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderFilmBoard();
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filtredFilms = filter[filterType](films);

    switch (this._currentSortType) {
      case SortType.BY_RATING:
        return filtredFilms.slice().sort(sortByRating);
      case SortType.BY_DATE:
        return filtredFilms.slice().sort(sortByDate);
    }
    return filtredFilms;
  }

  _handleFilmChange(updatedFilm) {
    Object
      .values(this._filmPresenters)
      .forEach((presenter) => {
        if (updatedFilm.id in presenter) {
          presenter[updatedFilm.id].init(updatedFilm);
        }
      });
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this._commentsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._commentsModel.deleteComment(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        Object
          .values(this._filmPresenters)
          .forEach((presenter) => {
            if (data.id in presenter) {
              presenter[data.id].init(data);
            }
          });
        break;
      case UpdateType.MINOR:
        this._clearFilmList();
        this._renderFilmBoard();
        break;
      case UpdateType.MAJOR:
        this._clearFilmList({resetRenderedFilmCount: true, resetSortType: true});
        this._renderFilmBoard();
        break;
    }
  }

  _handleModeChange() {
    Object.values(this._filmPresenters).forEach((store) => {
      Object.values(store).forEach((presenter) => {
        presenter.resetView();
      });
    });
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearFilmList({resetRenderedFilmCount: true});
    this._renderFilmBoard();
  }

  _renderFilmBoard() {
    if (this._getFilms().length === 0) {
      return this._renderNoFilm();
    }

    this._renderSort();
    this._renderSiteContainer();
    this._renderAllFilms();
    this._renderTopRatedFilm();
    this._renderMostCommented();
  }

  _renderFilm(container, film) {
    const filmPresenter = new FilmPresenter(container, this._siteBody, this._handleViewAction, this._handleModeChange, this._commentsModel);
    filmPresenter.init(film);

    switch (container) {
      case this._filmContainer:
        this._filmPresenters.allFilmsList[film.id] = filmPresenter;
        break;
      case this._filmListTopRatedContainer:
        this._filmPresenters.topRatingList[film.id] = filmPresenter;
        break;
      case this._filmListMostCommentedContainer:
        this._filmPresenters.mostCommentList[film.id] = filmPresenter;
        break;
    }
  }

  _renderFilms(container, films) {
    films.forEach((film) => this._renderFilm(container, film));
  }

  _renderNoFilm() {
    render(this._boardContainer, this._noFilm, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    if (this._sort !== null) {
      this._sort = null;
    }

    this._sort = new SortView(this._currentSortType);
    this._sort.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._boardContainer, this._sort, RenderPosition.BEFOREEND);
  }

  _renderSiteContainer() {
    render(this._boardContainer, this._siteContainer, RenderPosition.BEFOREEND);
  }

  _handleShowMoreButtonClick() {
    const filmCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmCount, this._renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmCount, newRenderedFilmCount);

    this._renderFilms(this._filmContainer, films);
    this._renderedFilmCount = newRenderedFilmCount;

    if (this._renderedFilmCount >= filmCount) {
      remove(this._showMoreButton);
    }
  }

  _renderShowMoreButton() {
    if (this._showMoreButton !== null) {
      this._showMoreButton = null;
    }

    this._showMoreButton = new ShowMoreButtonView();

    render(this._siteContainer.getFilmListAllMovies(), this._showMoreButton, RenderPosition.BEFOREEND);

    this._showMoreButton.setClickHandler(this._handleShowMoreButtonClick);
  }

  _clearFilmList({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    const filmCount = this._getFilms().length;

    Object.values(this._filmPresenters).forEach((store) => {
      Object.values(store).forEach((presenter) => {
        presenter.destroy();
      });
    });
    this._filmPresenters.allFilmsList = {};
    this._filmPresenters.mostCommentList = {};
    this._filmPresenters.topRatingList = {};

    remove(this._sort);
    remove(this._noFilm);
    remove(this._showMoreButton);

    if (resetRenderedFilmCount) {
      this._renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this._renderedFilmCount = Math.min(filmCount, this._renderedFilmCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderAllFilms() {
    const filmsCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmsCount, this._renderedFilmCount));

    this._filmContainer = this._siteContainer.getFilmListAllMovies().querySelector('.films-list__container');
    this._renderFilms(this._filmContainer,  films);

    if (filmsCount > this._renderedFilmCount) {
      this._renderShowMoreButton();
    }
  }

  _renderTopRatedFilm() {
    const filmsCount = this._getFilms().length;
    const ratedFilm = this._getFilms().slice().sort((a, b) => b.rating - a.rating);

    const film = ratedFilm.slice(0, Math.min(filmsCount, EXTRA_FILMS_COUNT));

    this._filmListTopRatedContainer = this._siteContainer.getFilmListTopRated().querySelector('.films-list__container');

    this._renderFilms(this._filmListTopRatedContainer, film);
  }

  _renderMostCommented() {
    const filmsCount = this._getFilms().length;
    const mostCommented = this._getFilms().slice().sort((a, b) => b.comments.length - a.comments.length);

    const film = mostCommented.slice(0, Math.min(filmsCount, EXTRA_FILMS_COUNT));

    this._filmListMostCommentedContainer = this._siteContainer.getFilmListMostCommented().querySelector('.films-list__container');

    this._renderFilms(this._filmListMostCommentedContainer, film);
  }
}
