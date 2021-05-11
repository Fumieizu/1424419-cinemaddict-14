import {FilterType} from '../const.js';

export const filter = {
  [FilterType.ALL]: (films) => films.filter(() => true),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.isWatched),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.isHistory),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.isFavorites),
};
