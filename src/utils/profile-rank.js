const ProfileRank = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff',
};
const NoviceCount = {
  MIN: 0,
  MAX: 10,
};

const FanCount = {
  MIN: 10,
  MAX: 20,
};

const MovieBuffCount = {
  MIN: 20,
  MAX: Infinity,
};

const getProfileRank = (count) => {
  if (count === NoviceCount.MIN) {
    return '';
  }
  if (count > NoviceCount.MIN && count <= NoviceCount.MAX) {
    return ProfileRank.NOVICE;
  }
  if (count > FanCount.MIN && count <= FanCount.MAX) {
    return ProfileRank.FAN;
  }
  if (count > MovieBuffCount.MIN) {
    return ProfileRank.MOVIE_BUFF;
  }
};

export const generateProfileRank = (films) => {
  const watchedFilmCount = films.filter((film) => film.isWatched).length;

  return getProfileRank(watchedFilmCount);
};

// Есть сомнения на счет 'качества' реализации, а так же на счет расположения данного кода(оставить его в моках?)
