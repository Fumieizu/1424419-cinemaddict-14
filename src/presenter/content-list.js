import SortView from '../view/sort.js';
import SiteContainerView from '../view/site-content-container.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import NoFilmView from '../view/no-film.js';
import FilmPresenter from './film.js';
import {RenderPosition, render, remove} from '../utils/render.js';
import {updateItem} from '../utils/common.js';

const FILM_COUNT_PER_STEP = 5;
const EXTRA_FILMS_COUNT = 2;


export default class FilmBoard {
  constructor(boardContainer, siteBody) {
    this._boardContainer = boardContainer;
    this._siteBody = siteBody;
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    this._filmPresenter = {};

    this._siteContainer = new SiteContainerView;
    this._sort = new SortView;
    this._noFilm = new NoFilmView;
    this._showMoreButton = new ShowMoreButtonView;

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
  }

  init(films) {
    this._films = films.slice();


    this._renderFilmBoard();
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    this._filmPresenter[updatedFilm.id].init(updatedFilm);
  }

  _handleModeChange() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _renderFilmBoard() {
    if (this._films.length === 0) {
      return this._renderNoFilm();
    }

    this._renderSort();
    this._renderSiteContainer();
    this._renderAllFilms();
    this._renderTopRatedFilm();
    this._renderMostCommented();
  }

  _renderFilm(container, film) {
    const filmPresenter = new FilmPresenter(container, this._siteBody, this._handleFilmChange, this._handleModeChange);
    filmPresenter.init(film);
    this._filmPresenter[film.id] = filmPresenter;
  }

  _renderFilms(container, films, from, too) {
    films
      .slice(from, too)
      .forEach((film) => this._renderFilm(container, film));
  }

  _renderNoFilm() {
    render(this._boardContainer, this._noFilm, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    render(this._boardContainer, this._sort, RenderPosition.BEFOREEND);
  }

  _renderSiteContainer() {
    render(this._boardContainer, this._siteContainer, RenderPosition.BEFOREEND);
  }

  _handleShowMoreButtonClick() {
    this._renderFilms(this._filmContainer, this._films, this._renderedFilmCount,this._renderedFilmCount + FILM_COUNT_PER_STEP);
    this._renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this._renderedFilmCount >= this._films.length) {
      remove(this._showMoreButton);
    }
  }

  _renderShowMoreButton() {
    render(this._filmListAllMovies, this._showMoreButton, RenderPosition.BEFOREEND);

    this._showMoreButton.setClickHandler(this._handleShowMoreButtonClick);
  }

  _clearFilmList() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this._showMoreButton);
  }

  _renderAllFilms() {
    this._filmListAllMovies = this._siteContainer.getElement().querySelector('.films-list--all-movies');
    this._filmContainer = this._filmListAllMovies.querySelector('.films-list__container');
    this._renderFilms(this._filmContainer,  this._films, 0, Math.min(this._films.length, FILM_COUNT_PER_STEP));

    if (this._films.length > FILM_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderTopRatedFilm() {
    this._filmListTopRated = this._siteContainer.getElement().querySelector('.films-list--top-rated');
    this._filmListTopRatedContainer = this._filmListTopRated.querySelector('.films-list__container');

    const ratedFilm = this._films.slice().sort((a, b) => b.rating - a.rating);
    this._renderFilms(this._filmListTopRatedContainer, ratedFilm, 0, Math.min(this._films.length, EXTRA_FILMS_COUNT));
  }

  _renderMostCommented() {
    this._filmListMostCommented = this._siteContainer.getElement().querySelector('.films-list--most-commented');
    this._filmListMostCommentedContainer = this._filmListMostCommented.querySelector('.films-list__container');

    const mostCommented = this._films.slice().sort((a, b) => b.comments.length - a.comments.length);

    this._renderFilms(this._filmListMostCommentedContainer, mostCommented,0, Math.min(this._films.length, EXTRA_FILMS_COUNT));
  }
}
