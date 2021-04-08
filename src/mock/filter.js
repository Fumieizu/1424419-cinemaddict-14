const filmToFilterMap = {
  watchlist: (films) => films.filter((film) => film.isWatched).length,
  history: (films) => films.filter((film) => film.isHistory).length,
  favorites: (films) => films.filter((film) => film.isFavorites).length,
};

export const generateFilter = (films) => {
  return Object.entries(filmToFilterMap).map(([filterName, countFilms]) => ({
    name: filterName,
    count: countFilms(films),
  }));
};
