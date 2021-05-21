import FilmBoardPresenter from './presenter/content-list.js';
import FilterPresenter from './presenter/filter.js';
import ProfileRankPresenter from './presenter/profile-rank.js';
import StatisticPresenter from './presenter/statistic.js';
import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import FilterModel from './model/filter';
import FooterStatistic from './view/footer-statistic.js';
import {RenderPosition, render} from './utils/render';
import {generateFilm} from './mock/film.js';
import './mock/film.js';
import './utils/statistic.js';

const FILM_COUNT = 25;

const films = new Array(FILM_COUNT).fill().map(generateFilm);

const filmsModel = new FilmsModel();
filmsModel.set(films);

const commentsModel = new CommentsModel();

const filterModel = new FilterModel();

const siteBody = document.querySelector('body');
const siteHeader = document.querySelector('.header');
const siteMain = document.querySelector('.main');
const siteFooter = document.querySelector('.footer');

const profileRating = new ProfileRankPresenter(siteHeader,filmsModel);
profileRating.init();

const StatisticsPresenter = new StatisticPresenter(siteMain, filmsModel);
const boardPresenter = new FilmBoardPresenter(siteMain, siteBody, filmsModel, commentsModel, filterModel);


const renderStatistic = () => {
  boardPresenter.hide();
  StatisticsPresenter.init();
};

const renderSiteContent = () => {
  StatisticsPresenter.destroy();
  boardPresenter.show();
};
const filterPresenter = new FilterPresenter(siteMain, filterModel, filmsModel, renderStatistic, renderSiteContent);

filterPresenter.init();
boardPresenter.init();

render(siteFooter, new FooterStatistic(FILM_COUNT), RenderPosition.BEFOREEND);
