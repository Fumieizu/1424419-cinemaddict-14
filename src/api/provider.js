import FilmsModel from '../model/films.js';
import CommentsModel from '../model/comments.js';
import {isOnline} from '../utils/common.js';

const getSyncedFilms = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.film);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getFilms() {
    if (isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const item = createStoreStructure(films.map(FilmsModel.adaptToServer));
          this._store.setItems(item);
          return films;
        });
    }

    const storeFilms = Object.values(this._store.getItems());

    return Promise.resolve(storeFilms.map(FilmsModel.adaptToClient));
  }

  getComments(filmId) {
    if (isOnline()) {
      return this._api.getComments(filmId)
        .then((comment) => {
          const item = createStoreStructure(comment.map(CommentsModel.adaptToServer));
          this._store.setItems(item);
          return comment;
        });
    }

    const storeComments = Object.values(this._store.getItems());

    return Promise.resolve(storeComments.map(CommentsModel.adaptToClient));
  }

  updateFilm(film) {
    if (isOnline()) {
      return this._api.updateFilm(film)
        .then((updatedFilm) => {
          this._store.setItems(updatedFilm.id, FilmsModel.adaptToServer(updatedFilm));
          return updatedFilm;
        });
    }

    this._store.setItems(film.id, FilmsModel.adaptToServer(Object.assign({}, film)));

    return Promise.resolve(film);
  }

  addComment(film, comment) {
    if (isOnline()) {
      return this._api.addComment(film, comment);
    }

    return Promise.reject();
  }

  deleteComment(commentId) {
    if (isOnline()) {
      return this._api.deleteComment(commentId);
    }

    return Promise.reject();
  }

  sync() {
    if (isOnline()) {
      const storeFilms =Object.values(this._store.getItems());
      return this._api.sync(storeFilms)
        .then((response) => {
          const updatedFilms = getSyncedFilms(response.updated);

          const items = createStoreStructure(updatedFilms);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
