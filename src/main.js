import FilmBoardPresenter from './presenter/content-list.js';
import FilterPresenter from './presenter/filter.js';
import ProfileRankPresenter from './presenter/profile-rank.js';
import StatisticPresenter from './presenter/statistic.js';
import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import FilterModel from './model/filter';
import {UpdateType} from './const.js';
import FooterStatistic from './view/footer-statistic.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
import {RenderPosition, render} from './utils/render';
import Api from './api/api.js';


const AUTHORIZATION = 'Basic Wqp1I24pIOl20';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';
const STORE_PREFIX = 'cinemaddict-localstorage';
const STORE_VER = 'v14';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const filmsModel = new FilmsModel();


const commentsModel = new CommentsModel();

const filterModel = new FilterModel();

const siteBody = document.querySelector('body');
const siteHeader = document.querySelector('.header');
const siteMain = document.querySelector('.main');
const siteFooter = document.querySelector('.footer');


const statisticsPresenter = new StatisticPresenter(siteMain, filmsModel);
const boardPresenter = new FilmBoardPresenter(siteMain, siteBody, filmsModel, commentsModel, filterModel, apiWithProvider);


const renderStatistic = () => {
  boardPresenter.hide();
  statisticsPresenter.init();
};

const renderSiteContent = () => {
  statisticsPresenter.destroy();
  boardPresenter.show();
};

boardPresenter.init();

apiWithProvider.getFilms()
  .then((films) => {
    filmsModel.set(UpdateType.INIT, films);
    new ProfileRankPresenter(siteHeader,filmsModel).init();
  })
  .catch(() => {
    filmsModel.set(UpdateType.INIT, []);
  })
  .finally(() => {
    new FilterPresenter(siteMain, filterModel, filmsModel, renderStatistic, renderSiteContent).init();
    render(siteFooter, new FooterStatistic(filmsModel.get().length), RenderPosition.BEFOREEND);
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
});
