import {createProfileRating} from './view/profile-rating.js';
import {createSiteMenu} from './view/site-menu.js';
import {createSiteContainer} from './view/site-content-container.js';
import {createFilmTemplate} from './view/film.js';
import {createShowMoreButton} from './view/show-more-button.js';
// import {createFilmPopup} from './view/film-popup.js';
import {createSiteStatistic} from './view/site-statistic.js';

const FILM_COUNT = 5;
const EXTRA_FILMS_COUNT = 2;

const siteHeader = document.querySelector('.header');
const siteMain = document.querySelector('.main');
const siteFooter = document.querySelector('.footer');

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(siteHeader, createProfileRating(), 'beforeend');
render(siteMain, createSiteMenu(), 'beforeend');
render(siteMain, createSiteContainer(), 'beforeend');

//All movies
const filmListAllMovies = siteMain.querySelector('.films-list--all-movies');
const filmContainer = filmListAllMovies.querySelector('.films-list__container');
for (let i = 0;i < FILM_COUNT; i++) {
  render(filmContainer, createFilmTemplate(),'beforeend');
}
render(filmListAllMovies, createShowMoreButton(), 'beforeend');

//Top rated
const filmListTopRated = siteMain.querySelector('.films-list--top-rated');
const filmListTopRatedContainer = filmListTopRated.querySelector('.films-list__container');
for (let i = 0;i < EXTRA_FILMS_COUNT; i++) {
  render(filmListTopRatedContainer, createFilmTemplate(), 'beforeend');
}

//Most commented
const filmListMostCommented = siteMain.querySelector('.films-list--most-commented');
const filmListMostCommentedContainer = filmListMostCommented.querySelector('.films-list__container');
for (let i = 0;i < EXTRA_FILMS_COUNT;i++) {
  render(filmListMostCommentedContainer, createFilmTemplate(), 'beforeend');
}

render(siteFooter, createSiteStatistic(), 'beforeend');
