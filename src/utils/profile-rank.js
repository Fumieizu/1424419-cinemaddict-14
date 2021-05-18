export const ProfileRanks = {
  UNRANKED: 'Unranked',
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
    return ProfileRanks.UNRANKED;
  }
  if (count > NoviceCount.MIN && count <= NoviceCount.MAX) {
    return ProfileRanks.NOVICE;
  }
  if (count > FanCount.MIN && count <= FanCount.MAX) {
    return ProfileRanks.FAN;
  }
  if (count > MovieBuffCount.MIN) {
    return ProfileRanks.MOVIE_BUFF;
  }
};

export const generateProfileRank = (films) => {
  const watchedFilmCount = films.filter((film) => film.isHistory).length;

  return getProfileRank(watchedFilmCount);
};
