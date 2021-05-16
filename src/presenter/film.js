import FilmTemplateView from '../view/film-card.js';
import FilmPopupView from '../view/film-popup.js';
import {UserAction, UpdateType} from '../const.js';
import {RenderPosition, render, remove, replace} from '../utils/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

export default class film {
  constructor(filmContainer, popupContainer, changeData, changeMode, commentsModel, onPopupOpen) {
    this._filmContainer = filmContainer;
    this._popupContainer = popupContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._commentsModel = commentsModel;
    this._onPopupOpen = onPopupOpen;

    this._film = null;
    this._filmComponent = null;
    this._popupComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleWatchedListClick = this._handleWatchedListClick.bind(this);
    this._handleFavoriteListClick = this._handleFavoriteListClick.bind(this);
    this._handleWatchListClick = this._handleWatchListClick.bind(this);
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);
    this._handleCommentDeleteClick = this._handleCommentDeleteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this.showPopup = this.showPopup.bind(this);
    this._onEscKeyDownHandler = this._onEscKeyDownHandler.bind(this);
  }

  init(film) {
    this._film = film;
    const prevFilmComponent = this._filmComponent;
    const prevPopupComponent = this._popupComponent;
    this._filmComponent = new FilmTemplateView(film);
    this._popupComponent = new FilmPopupView(film, this._commentsModel.getComments());


    this._filmComponent.setPopupClickHandler(this.showPopup);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteListClick);
    this._filmComponent.setHistoryClickHandler(this._handleWatchListClick);
    this._filmComponent.setWatchedClickHandler(this._handleWatchedListClick);

    this._popupComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._popupComponent.setDeleteCommentHandler(this._handleCommentDeleteClick);
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

  showPopup() {
    this._changeMode();
    this._renderPopup();
  }

  _renderPopup() {
    this._popupContainer.classList.add('hide-overflow');
    render(this._popupContainer, this._popupComponent, RenderPosition.BEFOREEND);
    this._mode = Mode.POPUP;
    this._onPopupOpen(this._film.id);
    document.addEventListener('keydown', this._onEscKeyDownHandler);
  }

  _removePopup() {
    this._popupContainer.removeChild(this._popupComponent.getElement());
    this._popupContainer.classList.remove('hide-overflow');
    this._mode = Mode.DEFAULT;
    this._onPopupOpen(null);
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
  }

  _handleCommentDeleteClick(comment) {
    this._film.comments.splice(comment, 1); //хоть spcile и мутирует исходные данные,
    this._changeData(                                  // я не придумал(не смог реализовать) что нибудь получше
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      Object.assign({},
        this._film,
      ),
    );
  }

  _handleWatchedListClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
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
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._film,
        {
          isFavorites: !this._film.isFavorites,
        },
      ),
    );
  }

  _handleWatchListClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._film,
        {
          isHistory: !this._film.isHistory,
        },
      ),
    );
  }

  _handleFormSubmit(newComment) {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      Object.assign(
        {},
        newComment,
      ),
    );
  }
}
