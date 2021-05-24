import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import SmartView from './smart';
// import he from 'he';
import {nanoid} from 'nanoid';
import {getHumanizedDuration, getDateFromNow} from '../utils/film.js';

const EMOJIS = ['smile', 'sleeping', 'puke', 'angry'];

const createGenres = (genre) => {
  return genre.map((it) =>`
      <span class="film-details__genre">${it}</span>
    `).join(' ');
};

const createFilmComment = (comments, isDeleting) => {
  return Object.values(comments).map(({id, text, emoji, commentator, commentTime}) => `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-smile">
            </span>
            <div>
              <p class="film-details__comment-text">${text}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${commentator}</span>
                <span class="film-details__comment-day">${getDateFromNow(commentTime)}</span>
                <button class="film-details__comment-delete" data-id="${id}">${isDeleting ? 'Deleting...' : 'Delete'}</button>
              </p>
            </div>
          </li>
    `).join('');
};

const createEmojiList = (emotion, isDisabled) => {
  return EMOJIS.map((emoji) => `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value=${emoji} ${emotion === emoji ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
            <label class="film-details__emoji-label" for="emoji-${emoji}">
              <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
            </label>`).join('');
};

const createFilmPopup = ({poster, title, originalName, emotion, isDeleting, isDisabled, isComments, comment, comments, rating, director, description, year, time, writers, ageRate, actor, genre, country, isFavorites, isWatched, isHistory}) => {

  const commentFilm = createFilmComment(isComments, isDeleting);

  const date = year!== null
    ? dayjs(year).format('DD MMMM YYYY')
    : '';

  const genreTemplate = createGenres(genre);

  const genresCountValidation = genre.length > 1 ? 'Genres' : 'Genre';

  const favoritesClassName = isFavorites ? 'checked' : '';

  const watchedClassName = isWatched ? 'checked' : '';

  const historyClassName = isHistory ? 'checked' : '';


  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button" ${isDisabled ? 'disabled' : ''}>close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${ageRate}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${originalName}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actor}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${date}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${getHumanizedDuration(time)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genresCountValidation}</td>
              <td class="film-details__cell">${genreTemplate}</td>
            </tr>
          </table>

          <p class="film-details__film-description">
          ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${historyClassName}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${watchedClassName}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${favoritesClassName}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">${commentFilm}</ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">${!emotion ? '' : `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">`}</div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${comment}</textarea>
          </label>

          <div class="film-details__emoji-list">${createEmojiList(emotion)}</div>
        </div>
      </section>
    </div>
  </form>
</section>`;
};

export default class FilmPopup extends SmartView {
  constructor(film, comments) {
    super();
    this._data = FilmPopup.parsFilmToData(film, comments);
    this._closeButtonClickHandler = this._closeButtonClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._historyClickHandler = this._historyClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._emotionChangeHandler = this._emotionChangeHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._deleteCommentHandler = this._deleteCommentHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);

    this._setInnerHandler();
  }

  getTemplate() {
    return createFilmPopup(this._data);
  }

  static parsFilmToData(film, comments) {
    return Object.assign(
      {},
      film,
      {
        isComments: comments.get().filter((comment) => film.comments.includes(comment.id)),
        isDeleting: false,
        isDisabled: false,
        emotion: null,
        comment: '',
      },
    );
  }

  static parsDataToComment(data) {
    return {
      id: nanoid(),
      text: data.comment,
      emoji: data.emotion,
      commentator: null,
      commentTime: null,
    };
  }

  setCloseButtonHandler(callback) {
    this._callback.closeButtonClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closeButtonClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('#favorite').addEventListener('click', this._favoriteClickHandler);
  }

  setHistoryClickHandler(callback) {
    this._callback.historyClick = callback;
    this.getElement().querySelector('#watchlist').addEventListener('click', this._historyClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector('#watched').addEventListener('click', this._watchedClickHandler);
  }

  setDeleteCommentHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelectorAll('.film-details__comment-delete')
      .forEach((button) => button.addEventListener('click', this._deleteCommentHandler));
  }

  setFormSubmitHandler(callback) {
    this._callback.submitHandler = callback;
    this.getElement().querySelector('.film-details__inner').addEventListener('keydown', this._formSubmitHandler);
  }


  reset(film, comments) {
    this.updateData(
      FilmPopup.parsFilmToData(film, comments),
    );
  }

  restoreHandlers() {
    this._setInnerHandler();

    this.setCloseButtonHandler(this._callback.closeButtonClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setHistoryClickHandler(this._callback.historyClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setDeleteCommentHandler(this._callback.deleteClick);
    this.setFormSubmitHandler(this._callback.submitHandler);
  }

  _setInnerHandler() {
    this.getElement()
      .querySelectorAll('.film-details__emoji-item')
      .forEach((element) => {
        element.addEventListener('change', this._emotionChangeHandler);
      });
    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._commentInputHandler);
  }

  _formSubmitHandler(evt) {
    if ((evt.ctrlKey || evt.metaKey) && evt.key === 'Enter') {
      if (!this._data.emotion || !this._data.comment) {
        return;
      }
      evt.preventDefault();
      this._callback.submitHandler(FilmPopup.parsDataToComment(this._data));
    }
  }

  _deleteCommentHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(evt.target.dataset.id);
  }

  _emotionChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      emotion: evt.target.value,
    });
  }

  _commentInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      comment: evt.target.value,
    }, true);
  }

  _closeButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeButtonClick();
  }

  _favoriteClickHandler() {
    this._callback.favoriteClick();
  }

  _historyClickHandler() {
    this._callback.historyClick();
  }

  _watchedClickHandler() {
    this._callback.watchedClick();
  }
}
