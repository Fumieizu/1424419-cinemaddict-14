const SortType = {
  DEFAULT: 'default',
  BY_DATE: 'by-date',
  BY_RATING: 'by-rating',
};

const UserAction = {
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
  UPDATE_FILM: 'UPDATE_FILM',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const FilterType = {
  ALL: 'All',
  ALL_MOVIES: 'All movies',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
};

const DatePeriod = {
  ALL_TIME: 'all-time',
  TODAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING_SAVING: 'ABORTING_SAVING',
  ABORTING_DELETING: 'ABORTING_DELETING',
};

export {SortType, UserAction, UpdateType, FilterType, DatePeriod, State};
