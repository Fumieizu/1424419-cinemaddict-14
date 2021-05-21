import dayjs from 'dayjs';
import {DatePeriod} from '../const.js';

export const getWatchedFilmByRange = (films, period) => {
  const watchedFilm = films.filter((film) => film.isHistory);

  if (period === DatePeriod.ALL_TIME) {
    return watchedFilm;
  }

  return films.filter((film) => film.isHistory && dayjs().diff(dayjs(film.watchingDate), period) === 0);
};

export const getFilmGenresStat = (films) => {
  const results = {};

  films.reduce((acc, film) => acc.concat(film.genre), [])
    .forEach((genre) => {
      if (results[genre]) {
        results[genre]++;
        return;
      }
      results[genre] = 1;
    });
  return Object.entries(results).sort((a, b) =>b[1] - a[1]);
};
