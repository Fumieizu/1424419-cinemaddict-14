import {createProfileRating} from './view/profile-rating.js';
import {createSiteMenu} from './view/site-menu.js';
import {createSiteContainer} from './view/site-content-container.js';
import {createFilmTemplate} from './view/film-card.js';
import {createShowMoreButton} from './view/show-more-button.js';
import {createFilmPopup, createFilmComment} from './view/film-popup.js';
import {createSiteStatistic} from './view/site-statistic.js';
import {getRandomInteger} from './util.js';
import {generateFilm, generateComment} from './mokc/film.js';
import {generateFilter} from './mokc/filter.js';
import './mokc/film.js';


const FILM_COUNT = 25;
const FILM_COUNT_PER_STEP = 5;
const COMMENTS_COUNT = 5;
const EXTRA_FILMS_COUNT = 2;

const films = new Array(FILM_COUNT).fill().map(generateFilm);
const filters = generateFilter(films);

const siteHeader = document.querySelector('.header');
const siteMain = document.querySelector('.main');
const siteFooter = document.querySelector('.footer');

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(siteHeader, createProfileRating(), 'beforeend');
render(siteMain, createSiteMenu(filters), 'beforeend');
render(siteMain, createSiteContainer(), 'beforeend');
render(siteFooter, createFilmPopup(films[0]), 'beforeend');

//All movies
const filmListAllMovies = siteMain.querySelector('.films-list--all-movies');
const filmContainer = filmListAllMovies.querySelector('.films-list__container');
for (let i = 0;i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
  render(filmContainer, createFilmTemplate(films[i]),'beforeend');
}

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  render(filmListAllMovies, createShowMoreButton(), 'beforeend');

  const loadMoreButton = filmListAllMovies.querySelector('.films-list__show-more');

  loadMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => render(filmContainer, createFilmTemplate(film), 'beforeend'));

    renderedFilmCount += FILM_COUNT_PER_STEP;

    if (renderedFilmCount >= films.length) {
      loadMoreButton.remove();
    }
  });
}

//Top rated
const filmListTopRated = siteMain.querySelector('.films-list--top-rated');
const filmListTopRatedContainer = filmListTopRated.querySelector('.films-list__container');
for (let i = 0;i < EXTRA_FILMS_COUNT; i++) {
  render(filmListTopRatedContainer, createFilmTemplate(films[i]), 'beforeend');
}

//Most commented
const filmListMostCommented = siteMain.querySelector('.films-list--most-commented');
const filmListMostCommentedContainer = filmListMostCommented.querySelector('.films-list__container');
for (let i = 0;i < EXTRA_FILMS_COUNT;i++) {
  render(filmListMostCommentedContainer, createFilmTemplate(films[i]), 'beforeend');
}

render(siteFooter, createSiteStatistic(FILM_COUNT), 'beforeend');

//Comment

const commentsContainer = siteFooter.querySelector('.film-details__comments-list');

const comments = new Array(COMMENTS_COUNT).fill().map(generateComment);
const randomCountComments = comments.slice(getRandomInteger(0, COMMENTS_COUNT));

for (let i =0;i < randomCountComments.length; i++) {
  render(commentsContainer, createFilmComment(randomCountComments[i]), 'beforeend');
}

