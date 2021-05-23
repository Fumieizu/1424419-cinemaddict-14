import Observer from '../utils/observer.js';

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  set(updateType, films) {
    this._films = films;

    this._notify(updateType);
  }

  get() {
    return this._films;
  }

  update(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        poster: film.film_info.poster,
        title: film.film_info.title,
        originalName: film.film_info.alternative_title,
        rating: film.film_info.total_rating,
        description: film.film_info.description,
        director: film.film_info.director,
        year: film.film_info.release.date,
        time: film.film_info.runtime,
        writers: film.film_info.writers,
        actor: film.film_info.actors,
        country: film.film_info.release.release_country,
        ageRate: film.film_info.age_rating,
        genre: film.film_info.genre,
        comments: film.comments,
        isFavorites: film.user_details.favorite,
        isWatched: film.user_details.watchlist,
        isHistory: film.user_details.already_watched,
        watchingDate: film.user_details.watching_date,
      },
    );

    delete adaptedFilm.film_info;
    delete adaptedFilm.user_details;

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        'film_info': {
          'title': film.title,
          'alternative_title': film.originalName,
          'total_rating': film.rating,
          'poster': film.poster,
          'age_rating': film.ageRate,
          'director': film.director,
          'writers': film.writers,
          'actors': film.actor,
          'release': {
            'date': film.year,
            'release_country': film.country,
          },
          'runtime': film.time,
          'genre': film.genre,
          'description': film.description,
        },
        'user_details': {
          'watchlist': film.isWatched,
          'already_watched': film.isHistory,
          'watching_date': film.watchingDate,
          'favorite': film.isFavorites,
        },
      },
    );

    delete adaptedFilm.title;
    delete adaptedFilm.originalName;
    delete adaptedFilm.rating;
    delete adaptedFilm.poster;
    delete adaptedFilm.ageRate;
    delete adaptedFilm.director;
    delete adaptedFilm.writers;
    delete adaptedFilm.actor;
    delete adaptedFilm.year;
    delete adaptedFilm.country;
    delete adaptedFilm.time;
    delete adaptedFilm.genre;
    delete adaptedFilm.description;
    delete adaptedFilm.isWatched;
    delete adaptedFilm.isHistory;
    delete adaptedFilm.watchingDate;
    delete adaptedFilm.isFavorites;

    return adaptedFilm;
  }
}

