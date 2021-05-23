import AbstractView from './abstract.js';
import {getHumanizedDuration, getFilmCardDate} from '../utils/film';

const createFilmTemplate = ({poster, title, rating, year, time, genre, description, comments, isFavorites, isWatched, isHistory}) => {

  const descriptionLimitValidation = (text, limit) => {

    if (text.length <= limit){
      return  text;
    }
    return text.slice(0, limit - 1) + '...';
  };


  const descriptionLimit = descriptionLimitValidation(description, 140);

  const favoritesClassName = isFavorites ? 'film-card__controls-item--active' : '';

  const watchedClassName = isWatched ? 'film-card__controls-item--active' : '';

  const historyClassName = isHistory ? 'film-card__controls-item--active' : '';

  return `<article class="film-card">
          <h3 class="film-card__title film-card__popup-open">${title}</h3>
          <p class="film-card__rating">${rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${getFilmCardDate(year)}</span>
            <span class="film-card__duration">${getHumanizedDuration(time)}</span>
            <span class="film-card__genre">${genre[0]}</span>
          </p>
          <img src="${poster}" alt="" class="film-card__poster film-card__popup-open">
          <p class="film-card__description">${descriptionLimit}</p>
          <a class="film-card__comments film-card__popup-open">${comments.length} comments</a>
          <div class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${historyClassName}" type="button">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${watchedClassName}" type="button">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${favoritesClassName}" type="button">Mark as favorite</button>
          </div>
        </article>`;
};

export default class FilmTemplate extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
    this._popupClickHandler = this._popupClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._historyClickHandler = this._historyClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmTemplate (this._film);
  }

  setPopupClickHandler(callback) {
    this._callback.popupClick = callback;
    this.getElement().querySelectorAll('.film-card__popup-open')
      .forEach((element) => {
        element.addEventListener('click', this._popupClickHandler);
      });
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._favoriteClickHandler);
  }

  setHistoryClickHandler(callback) {
    this._historyClickHandler = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._historyClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._watchedClickHandler = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._watchedClickHandler);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _historyClickHandler(evt) {
    evt.preventDefault();
    this._callback.historyClick();
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  _popupClickHandler(evt) {
    evt.preventDefault();
    this._callback.popupClick();
  }
}
