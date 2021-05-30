import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
dayjs.extend(relativeTime);
dayjs.extend(duration);

const sortByDate = (filmA, filmB) => dayjs(filmB.year).diff(dayjs(filmA.year));

const sortByRating = (filmA, filmB) => filmB.rating - filmA.rating;

const getFilmCardDate = (date) => dayjs(date).format('YYYY');

const getDateFromNow = (date) => dayjs(date).fromNow();

const getHumanizedDuration = (minutesTotal) => {
  const hours = Math.floor(minutesTotal / 60);
  const minutes = minutesTotal % 60;
  const hoursOutput = hours ? hours + 'h ' : '';

  return hoursOutput + minutes + 'm';
};

export {sortByDate, sortByRating, getFilmCardDate, getDateFromNow, getHumanizedDuration};
