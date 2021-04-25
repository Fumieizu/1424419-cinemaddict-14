import FilmBoardPresenter from './presenter/content-list.js';
import SiteStatisticView from './view/site-statistic.js';
import SiteMenuView from './view/site-menu.js';
import ProfileRatingView from './view/profile-rating.js';
import {RenderPosition, render} from './utils/render';
import {generateFilm} from './mock/film.js';
import {generateFilter} from './mock/filter.js';
import './mock/film.js';


const FILM_COUNT = 25;

const films = new Array(FILM_COUNT).fill().map(generateFilm);
const filters = generateFilter(films);


const siteBody = document.querySelector('body');
const siteHeader = document.querySelector('.header');
const siteMain = document.querySelector('.main');
const siteFooter = document.querySelector('.footer');

render(siteHeader, new ProfileRatingView(), RenderPosition.BEFOREEND);
render(siteMain, new SiteMenuView(filters), RenderPosition.BEFOREEND);
const boardPresenter = new FilmBoardPresenter(siteMain, siteBody);

boardPresenter.init(films);

render(siteFooter, new SiteStatisticView(FILM_COUNT), RenderPosition.BEFOREEND);


