import FilmBoardPresenter from './presenter/content-list.js';
import FilterPresenter from './presenter/filter.js';
import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import FilterModel from './model/filter';
import SiteStatisticView from './view/site-statistic.js';
import ProfileRatingView from './view/profile-rating.js';
import {RenderPosition, render} from './utils/render';
import {generateFilm, generateComment} from './mock/film.js';
import {generateProfileRank} from './utils/profile-rank.js';
import './mock/film.js';


const FILM_COUNT = 25;
const COMMENTS_COUNT = 50;

const films = new Array(FILM_COUNT).fill().map(generateFilm);
const comments = new Array(COMMENTS_COUNT).fill().map(generateComment);

const profileRating = generateProfileRank(films);

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const commentsModel = new CommentsModel();
commentsModel.setComments(comments);

const filterModel = new FilterModel();

const siteBody = document.querySelector('body');
const siteHeader = document.querySelector('.header');
const siteMain = document.querySelector('.main');
const siteFooter = document.querySelector('.footer');

render(siteHeader, new ProfileRatingView(profileRating), RenderPosition.BEFOREEND);

const boardPresenter = new FilmBoardPresenter(siteMain, siteBody, filmsModel, commentsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMain, filterModel, filmsModel);

filterPresenter.init();
boardPresenter.init();

render(siteFooter, new SiteStatisticView(FILM_COUNT), RenderPosition.BEFOREEND);
