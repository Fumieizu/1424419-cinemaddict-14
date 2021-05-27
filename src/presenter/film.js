import FilmTemplateView from '../view/film-card.js';
import FilmPopupView from '../view/film-popup.js';
import {UserAction, UpdateType, State} from '../const.js';
import {RenderPosition, render, remove, replace} from '../utils/render.js';
import {toast} from '../utils/toast.js';
import {isOnline} from '../utils/common.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

const ErrorMessage = {
  DELETE_ERROR: 'You can\'t delete comment. Offline mode',
  SAVING_ERROR: 'You can\'t send comment. Offline mode',
};

export default class film {
  constructor(filmContainer, popupContainer, changeData, changeMode, commentsModel, onPopupOpen, api) {
    this._filmContainer = filmContainer;
    this._popupContainer = popupContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._commentsModel = commentsModel;
    this._onPopupOpen = onPopupOpen;
    this._api = api;

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
    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
  }

  init(film) {
    this._film = film;
    const prevFilmComponent = this._filmComponent;
    const prevPopupComponent = this._popupComponent;
    this._filmComponent = new FilmTemplateView(film);
    this._popupComponent = new FilmPopupView(film, this._commentsModel);


    this._filmComponent.setPopupClickHandler(this._handleFilmCardClick);
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
    document.removeEventListener('keydown', this._onEscKeyDownHandler);
  }

  resetView() {
    if(this._mode !== Mode.DEFAULT) {
      this._removePopup();
    }
  }

  showPopup(scroll) {
    this._changeMode();
    this._renderPopup();
    this._popupComponent.getElement().scrollTop = scroll;
  }

  setViewState(state, comment) {
    const resetFormState = () => {
      this._popupComponent.updateData({
        isDisabled: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._popupComponent.updateData({
          isDisabled: true,
        });
        break;
      case State.DELETING:
        this._popupComponent.disableDeleteCommentButton(comment);
        break;
      case State.ABORTING_SAVING:
        if (!isOnline()) {
          toast(ErrorMessage.SAVING_ERROR);
        }
        this._popupComponent.shake(resetFormState);
        break;
      case State.ABORTING_DELETING:
        if (!isOnline()) {
          toast(ErrorMessage.DELETE_ERROR);
        }

        this._popupComponent.setCommentDeleteShake(comment);
        break;
    }
  }

  _renderPopup() {
    this._popupContainer.classList.add('hide-overflow');
    render(this._popupContainer, this._popupComponent, RenderPosition.BEFOREEND);
    this._mode = Mode.POPUP;
    this._onPopupOpen({
      id: this._film.id,
    });
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
    this._popupComponent.reset(this._film, this._commentsModel);
    this._removePopup();
    document.removeEventListener('keydown', this._onEscKeyDownHandler);
  }

  _onEscKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._popupComponent.reset(this._film, this._commentsModel);
      this._removePopup();
      document.removeEventListener('keydown', this._onEscKeyDownHandler);
    }
  }

  _handleFilmCardClick() {
    this._api.getComments(this._film.id)
      .then((comments) => {
        this._commentsModel.set(UpdateType.INIT, comments);
        this.showPopup();
        this._popupComponent.reset(this._film, this._commentsModel);
      })
      .catch(() => {
        this._commentsModel.set(UpdateType.INIT, []);
        this.showPopup();
      });
  }

  _handleCommentDeleteClick(commentId) {
    this._onPopupOpen({
      scrollPosition: this._popupComponent.getElement().scrollTop,
    });

    const newComments = this._film.comments.filter((comment) => comment !== commentId);

    this._changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._film,
        {
          comments: newComments,
        },
      ),
      commentId,
    );
  }

  _handleWatchedListClick() {
    this._onPopupOpen({
      scrollPosition: this._popupComponent.getElement().scrollTop,
    });

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
    this._onPopupOpen({
      scrollPosition: this._popupComponent.getElement().scrollTop,
    });

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
    this._onPopupOpen({
      scrollPosition: this._popupComponent.getElement().scrollTop,
    });

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
    this._onPopupOpen({
      scrollPosition: this._popupComponent.getElement().scrollTop,
    });

    this._changeData(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      this._film,
      newComment,
    );
  }
}
