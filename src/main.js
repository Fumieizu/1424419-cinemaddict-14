import ProfileRatingView from './view/profile-rating.js';
import SiteMenuView from './view/site-menu.js';
import SortView from './view/sort.js';
import SiteContainerView from './view/site-content-container.js';
import FilmTemplateView from './view/film-card.js';
import ShowMoreButtonView from './view/show-more-button.js';
import FilmPopupView from './view/film-popup.js';
import SiteStatisticView from './view/site-statistic.js';
import NoFilmView from './view/no-film.js';
import {RenderPosition, render, remove} from './utils/render';
import {generateFilm} from './mock/film.js';
import {generateFilter} from './mock/filter.js';
import './mock/film.js';


const FILM_COUNT = 25;
const FILM_COUNT_PER_STEP = 5;
const EXTRA_FILMS_COUNT = 2;

const films = new Array(FILM_COUNT).fill().map(generateFilm);
const filters = generateFilter(films);

const siteBody = document.querySelector('body');
const siteHeader = document.querySelector('.header');
const siteMain = document.querySelector('.main');
const siteFooter = document.querySelector('.footer');

render(siteHeader, new ProfileRatingView(), RenderPosition.BEFOREEND);
render(siteMain, new SiteMenuView(filters), RenderPosition.BEFOREEND);

const siteContainer = new SiteContainerView();

if (films.length === 0) {
  render(siteMain, new NoFilmView(), RenderPosition.BEFOREEND);
} else {
  render(siteMain, new SortView(), RenderPosition.BEFOREEND);
  render(siteMain, siteContainer, RenderPosition.BEFOREEND);
}

const createPopup = (film) => {
  const popupElement = new FilmPopupView(film);

  siteBody.classList.add('hide-overflow');
  siteBody.appendChild(popupElement.getElement());

  const removePopup = () => {
    siteBody.classList.remove('hide-overflow');
    siteBody.removeChild(popupElement.getElement());
  };

  const onClickCloseButton = () => {
    removePopup();
    document.removeEventListener('keydown', onEscKeyDown);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      removePopup();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  popupElement.setCloseButtonHandler(() => {
    onClickCloseButton();
  });

  document.addEventListener('keydown', onEscKeyDown);
};

const addListenersOnElement = (filmElement, film) => {
  filmElement.setPopupClickHandler(() => {
    createPopup(film);
  });
};

//All movies
const filmListAllMovies = siteContainer.getElement().querySelector('.films-list--all-movies');
const filmContainer = filmListAllMovies.querySelector('.films-list__container');
for (let i = 0;i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
  const film = new FilmTemplateView(films[i]);
  render(filmContainer, film,RenderPosition.BEFOREEND);
  addListenersOnElement(film, films[i]);
}

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  const showMoreButton = new ShowMoreButtonView();

  render(filmListAllMovies, showMoreButton, RenderPosition.BEFOREEND);

  showMoreButton.setClickHandler(() => {
    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => {
        const filmItem = new FilmTemplateView(film);
        render(filmContainer, filmItem, RenderPosition.BEFOREEND);
        addListenersOnElement(filmItem, film);
      });
    renderedFilmCount += FILM_COUNT_PER_STEP;

    if (renderedFilmCount >= films.length) {
      remove(showMoreButton);
    }
  });
}

//Top rated
const filmListTopRated = siteContainer.getElement().querySelector('.films-list--top-rated');
const filmListTopRatedContainer = filmListTopRated.querySelector('.films-list__container');
for (let i = 0;i < EXTRA_FILMS_COUNT; i++) {
  const film = new FilmTemplateView(films[i]);
  render(filmListTopRatedContainer, film, RenderPosition.BEFOREEND);
  addListenersOnElement(film, films[i]);
}

//Most commented
const filmListMostCommented = siteMain.querySelector('.films-list--most-commented');
const filmListMostCommentedContainer = filmListMostCommented.querySelector('.films-list__container');
for (let i = 0;i < EXTRA_FILMS_COUNT;i++) {
  const film = new FilmTemplateView(films[i]);
  render(filmListMostCommentedContainer, film, RenderPosition.BEFOREEND);
  addListenersOnElement(film, films[i]);
}

render(siteFooter, new SiteStatisticView(FILM_COUNT), RenderPosition.BEFOREEND);
