import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);
import {getRandomInteger, getRandomFloatNumber, getRandomIndexElement, getRandomArrayLength} from '../utils/common.js';

const FILMS_POSTERS = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];

const FILMS_TITLES = [
  'The Dance of Life',
  'Sagebrush Trail',
  'The Man with the Golden Arm ',
  'Santa Claus Conquers the Martians',
  'Popeye the Sailor Meets Sindbad the Sailor',
];

const DESCRIPTION = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';

const GENRES = [
  'Musical',
  'Western',
  'Drama',
  'Comedy',
  'Cartoon',
];

const DIRECTORS = [
  'Anthony Mann',
  'Jhon Smith',
  'Smith Jhon',
  'Anthony Margareity',
  'Alex Green',
];

const WRITERS = [
  'Anne Wigton',
  'Heinz Herald',
  'Richard Weil',
  'Jhon Smith',
  'Smith Jhon',
  'Alex Pink',
];

const ACTORS = [
  'Erich von Stroheim',
  'Mary Beth Hughes',
  'Dan Duryea',
  'Smith Jhon',
  'Alex Pink',
  'Heinz Herald',
];

const COUNTRIES = [
  'USA',
  'UK',
  'DE',
  'IT',
];

const AGE_RATES = [
  '18+',
  '16+',
  '12+',
  '6+',
  '0+',
];

const COMMENTATOR_NAMES = [
  'Tim Macoveev',
  'John Doe',
  'Jhon Smith',
  'Smith Jhon',
];

const EMOJIS = [
  'angry.png',
  'puke.png',
  'sleeping.png',
  'smile.png',
];

const HoursLength = {
  MIN: 0,
  MAX: 4,
};

const MinutesLength = {
  MIN: 0,
  MAX: 59,
};

const CommentsCount = {
  MIN: 0,
  MAX: 5,
};

const DaysGap = {
  MIN: 360,
  MAX: 0,
};

const MAX_SENTENCE_COUNT = 5;

const RELEASE_DATE_MAX_DAYS_GAP = 1000;

const COMMENT_TIME_MAX_DAYS_GAP = 7;

const RatingRange = {
  MIN: 0,
  MAX: 10,
  FLOAT: 1,
};

const BooleanFlag = {
  FALSE: 0,
  TRUE: 1,
};

const generateFilmDescription = () => {
  const createDescription = DESCRIPTION.split(['. ']);

  const randomIndex = createDescription.slice(getRandomInteger(0, createDescription.length-1));
  randomIndex.splice(MAX_SENTENCE_COUNT, createDescription.length-1).join('. ');

  return randomIndex.join('. ');
};

const generateFilmTime = () => {
  return dayjs.duration({
    hours: getRandomInteger(HoursLength.MIN, HoursLength.MAX),
    minutes: getRandomInteger(MinutesLength.MIN, MinutesLength.MAX),
  });
};

const generateReleaseDate = () => {
  const maxDaysGap = RELEASE_DATE_MAX_DAYS_GAP;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);

  return dayjs().add(daysGap, 'day').toDate();
};

const generateWatchingDate = () => {
  const maxDaysGap = DaysGap.MAX;
  const minDaysGap = DaysGap.MIN;
  const daysGap = getRandomInteger(minDaysGap, maxDaysGap);

  const date = dayjs().add(daysGap, 'day').toDate();

  return date;
};

//Comments
const generateCommentTime = () => {
  const maxDaysGap = COMMENT_TIME_MAX_DAYS_GAP;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);

  const date = dayjs().add(daysGap, 'day').toDate();

  return date;
};

export const generateComment = () => ({
  id: nanoid(),
  text: generateFilmDescription(),
  emoji: getRandomIndexElement(EMOJIS),
  commentator: getRandomIndexElement(COMMENTATOR_NAMES),
  commentTime: generateCommentTime(),
});

export const generateFilm = () => ({
  id: nanoid(),
  poster: getRandomIndexElement(FILMS_POSTERS),
  title: getRandomIndexElement(FILMS_TITLES),
  originalName: getRandomIndexElement(FILMS_TITLES),
  rating: getRandomFloatNumber(RatingRange.MIN, RatingRange.MAX, RatingRange.FLOAT),
  description: generateFilmDescription(),
  director: getRandomIndexElement(DIRECTORS),
  year: generateReleaseDate(),
  time: generateFilmTime(),
  writers: getRandomArrayLength(WRITERS),
  actor: getRandomArrayLength(ACTORS),
  country: getRandomIndexElement(COUNTRIES),
  ageRate: getRandomIndexElement(AGE_RATES),
  genre: getRandomArrayLength(GENRES),
  mainGenre: getRandomIndexElement(GENRES),
  comments: new Array(getRandomInteger(CommentsCount.MIN, CommentsCount.MAX)).fill().map(generateComment),
  isFavorites: Boolean(getRandomInteger(BooleanFlag.FALSE, BooleanFlag.TRUE)),
  isWatched: Boolean(getRandomInteger(BooleanFlag.FALSE, BooleanFlag.TRUE)),
  isHistory: Boolean(getRandomInteger(BooleanFlag.FALSE, BooleanFlag.TRUE)),
  watchingDate: generateWatchingDate(),
});
