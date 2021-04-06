import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);
import {getRandomInteger, getRandomFloatNumber} from '../util.js';

const generateFilmPoster = () => {
  const filmPoster = [
    'made-for-each-other.png',
    'popeye-meets-sinbad.png',
    'sagebrush-trail.jpg',
    'santa-claus-conquers-the-martians.jpg',
    'the-dance-of-life.jpg',
    'the-great-flamarion.jpg',
    'the-man-with-the-golden-arm.jpg',
  ];

  const randomIndex = getRandomInteger(0, filmPoster.length - 1);

  return filmPoster[randomIndex];
};

const generateFilmTitle = () => {
  const filmTitle = [
    'The Dance of Life',
    'Sagebrush Trail',
    'The Man with the Golden Arm ',
    'Santa Claus Conquers the Martians',
    'Popeye the Sailor Meets Sindbad the Sailor',
  ];

  const randomIndex = getRandomInteger(0, filmTitle.length -1);

  return filmTitle[randomIndex];
};

const generateFilmDescription = () => {
  const description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';
  const createDescription = description.split(['. ']);

  const randomIndex = createDescription.slice(getRandomInteger(0, createDescription.length-1));
  randomIndex.splice(5, createDescription.length-1).join('. ');

  return randomIndex.join('. ');
};

const generateFilmRating = () => {
  const rating = getRandomFloatNumber(0, 10, 1);
  return rating;
};


const generateFilmTime = () => {
  return dayjs.duration({
    hours: getRandomInteger(0, 4),
    minutes: getRandomInteger(0, 59),
  });
};

const generateGenre = () => {
  const genres = [
    'Musical',
    'Western',
    'Drama',
    'Comedy',
    'Cartoon',
  ];
  const randomIndex = genres.slice(getRandomInteger(0, genres.length - 1));

  return randomIndex;
};

const generateReleaseDate = () => {
  const maxDaysGap = 100;
  const daysGap = getRandomInteger(-maxDaysGap * 250, maxDaysGap);

  return dayjs().add(daysGap, 'day').toDate();
};

const generateFilmDirector = () => {
  const directors = [
    'Anthony Mann',
    'Jhon Smith',
    'Smith Jhon',
    'Anthony Margareity',
    'Alex Green',
  ];
  const randomIndex = getRandomInteger(0, directors.length - 1);

  return directors[randomIndex];
};

const generateFilmWriters = () => {
  const writers = [
    'Anne Wigton',
    'Heinz Herald',
    'Richard Weil',
    'Jhon Smith',
    'Smith Jhon',
    'Alex Pink',
  ];
  const randomIndex = writers.slice(getRandomInteger(0, writers.length - 1));

  return randomIndex;
};

const generateFilmActors = () => {
  const actors = [
    'Erich von Stroheim',
    'Mary Beth Hughes',
    'Dan Duryea',
    'Smith Jhon',
    'Alex Pink',
    'Heinz Herald',
  ];

  const randomIndex = actors.slice(getRandomInteger(0, actors.length - 1));

  return randomIndex;
};

const generateFilmCountry = () => {
  const country = [
    'USA',
    'UK',
    'DE',
    'IT',
  ];

  const randomIndex = getRandomInteger(0, country.length - 1);

  return country[randomIndex];
};

const generateAgeRate = () => {
  const ageRate = [
    '18+',
    '16+',
    '12+',
    '6+',
    '0+',
  ];

  const randomIndex = getRandomInteger(0, ageRate.length - 1);

  return ageRate[randomIndex];
};

export const generateFilm = () => {
  return {
    poster: generateFilmPoster(),
    title: generateFilmTitle(),
    originalName: generateFilmTitle(),
    rating: generateFilmRating(),
    description: generateFilmDescription(),
    director: generateFilmDirector(),
    year: generateReleaseDate(),
    time: generateFilmTime(),
    writers: generateFilmWriters(),
    actor: generateFilmActors(),
    country: generateFilmCountry(),
    ageRate: generateAgeRate(),
    genre: generateGenre(),
    comments: getRandomInteger(0, 5),
    isFavorites: Boolean(getRandomInteger(0, 1)),
    isWatched: Boolean(getRandomInteger(0, 1)),
    isHistory: Boolean(getRandomInteger(0, 1)),
  };
};

//Comments

const generateCommentatorName = () => {
  const commentatorName = [
    'Tim Macoveev',
    'John Doe',
    'Jhon Smith',
    'Smith Jhon',
  ];

  const randomIndex = getRandomInteger(0, commentatorName.length - 1);

  return commentatorName[randomIndex];
};

const generateEmoji = () => {
  const emoji = [
    'angry.png',
    'puke.png',
    'sleeping.png',
    'smile.png',
  ];

  const randomIndex = getRandomInteger(0, emoji.length - 1);

  return emoji[randomIndex];
};

const generateCommentTime = () => {
  const maxDaysGap = 7;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);

  const date = dayjs().add(daysGap, 'day').toDate();

  return date;
};

export const generateComment = () => {
  return {
    text: generateFilmDescription(),
    emoji: generateEmoji(),
    commentator: generateCommentatorName(),
    commentTime: generateCommentTime(),
  };
};
