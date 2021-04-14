import dayjs from 'dayjs';
import {createElement, getRandomIndexElement} from '../util.js';

const createFilmTemplate = ({poster, title, rating, year, time, genre, description, comments, isFavorites, isWatched, isHistory}) => {

  const {hours, minutes} = time.$d;

  const mainGenre = getRandomIndexElement(genre);

  const date = year !== null
    ? dayjs(year).format('YYYY')
    : '';

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
            <span class="film-card__year">${date}</span>
            <span class="film-card__duration">${hours}h ${minutes}m</span>
            <span class="film-card__genre">${mainGenre}</span>
          </p>
          <img src="./images/posters/${poster}" alt="" class="film-card__poster film-card__popup-open">
          <p class="film-card__description">${descriptionLimit}</p>
          <a class="film-card__comments film-card__popup-open">${comments.length} comments</a>
          <div class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${historyClassName}" type="button">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${watchedClassName}" type="button">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${favoritesClassName}" type="button">Mark as favorite</button>
          </div>
        </article>`;
};

export default class FilmTemplate {
  constructor(film) {
    this._film = film;
    this._element = null;
  }

  getTemplate() {
    return createFilmTemplate (this._film);
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
