import FilmTemplateView from '../view/film-card.js';
import FilmPopupView from '../view/film-popup.js';
import {RenderPosition, render, remove, replace} from '../utils/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

export default class film {
  constructor(filmContainer, popupContainer, changeData, changeMode) {
    this._filmContainer = filmContainer;
    this._popupContainer = popupContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;


    this._filmComponent = null;
    this._popupComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleWatchedListClick = this._handleWatchedListClick.bind(this);
    this._handleFavoriteListClick = this._handleFavoriteListClick.bind(this);
    this._handleWatchListClick = this._handleWatchListClick.bind(this);
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);
    this._handleClick = this._handleClick.bind(this);
    this._onEscKeyDownHandler = this._onEscKeyDownHandler.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmComponent = this._filmComponent;
    const prevPopupComponent = this._popupComponent;

    this._filmComponent = new FilmTemplateView(film);
    this._popupComponent = new FilmPopupView(film);

    this._filmComponent.setPopupClickHandler(this._handleClick);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteListClick);
    this._filmComponent.setHistoryClickHandler(this._handleWatchListClick);
    this._filmComponent.setWatchedClickHandler(this._handleWatchedListClick);

    this._popupComponent.setCloseButtonHandler(this._handleCloseButtonClick);
    this._popupComponent.setFavoriteClickHandler(this._handleFavoriteListClick);
    this._popupComponent.setHistoryClickHandler(this._handleWatchListClick);
    this._popupComponent.setWatchedClickHandler(this._handleWatchedListClick);

    if (prevFilmComponent === null || prevPopupComponent === null) {
      render(this._filmContainer, this._filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._filmContainer.contains(prevFilmComponent.getElement())) {
      replace(this._filmComponent, prevFilmComponent);
    }

    if (this._popupContainer.contains(prevPopupComponent.getElement())) {
      replace(this._popupComponent, prevPopupComponent);
    }

    remove(prevFilmComponent);
    remove(prevPopupComponent);
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._popupComponent);
  }

  resetView() {
    if(this._mode !== Mode.DEFAULT) {
      this._removePopup();
    }
  }

  _handleClick() {
    this._changeMode();
    this._renderPopup();
  }

  _renderPopup() {
    this._popupContainer.classList.add('hide-overflow');
    render(this._popupContainer, this._popupComponent, RenderPosition.BEFOREEND);
    this._mode = Mode.POPUP;
    document.addEventListener('keydown', this._onEscKeyDownHandler);
  }

  _removePopup() {
    this._popupContainer.removeChild(this._popupComponent.getElement());
    this._popupContainer.classList.remove('hide-overflow');
    this._mode = Mode.DEFAULT;
    document.removeEventListener('keydown', this._onEscKeyDownHandler);
  }

  _handleCloseButtonClick() {
    this._popupComponent.reset(this._film);
    this._removePopup();
    document.removeEventListener('keydown', this._onEscKeyDownHandler);
  }

  _onEscKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._popupComponent.reset(this._film);
      this._removePopup();
      document.removeEventListener('keydown', this._onEscKeyDownHandler);
    }

    if (evt.ctrlKey && evt.key === 'Enter') {
      evt.preventDefault();

      /*if (this._popupComponent.emotion) {

      }*/
    }
  }

  _handleWatchedListClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          isWatched: !this._film.isWatched,
        },
      ),
    );
  }

  _handleFavoriteListClick() {
    this._changeData(
      Object.assign({}, this._film, {isFavorites: !this._film.isFavorites},
      ),
    );
  }

  _handleWatchListClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          isHistory: !this._film.isHistory,
        },
      ),
    );
  }
}
