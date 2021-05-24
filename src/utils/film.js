import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
dayjs.extend(relativeTime);
dayjs.extend(duration);

export const sortByDate = (filmA, filmB) => dayjs(filmB.year).diff(dayjs(filmA.year));

export const sortByRating = (filmA, filmB) => filmB.rating - filmA.rating;

export const getFilmCardDate = (date) => {
  return dayjs(date).format('YYYY');
};

export const getDateFromNow = (date) => {
  return dayjs(date).fromNow();
};

export const getHumanizedDuration = (minutesTotal) => {
  const hours = Math.floor(minutesTotal / 60);
  const minutes = minutesTotal % 60;
  const hoursOutput = hours ? hours + 'h ' : '';

  return hoursOutput + minutes + 'm';
};
