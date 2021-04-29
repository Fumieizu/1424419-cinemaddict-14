import dayjs from 'dayjs';

export const sortByDate = (filmA, filmB) => dayjs(filmB.year).diff(dayjs(filmA.year));

export const sortByRating = (filmA, filmB) => filmB.rating - filmA.rating;
