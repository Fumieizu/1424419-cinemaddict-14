import ProfileRatingView from './view/profile-rating.js';
import SiteMenuView from './view/site-menu.js';
import SortView from './view/sort.js';
import SiteContainerView from './view/site-content-container.js';
import FilmTemplateView from './view/film-card.js';
import ShowMoreButtonView from './view/show-more-button.js';
import FilmPopupView from './view/film-popup.js';
import SiteStatisticView from './view/site-statistic.js';
import NoFilmView from './view/no-film.js';
import {RenderPosition, render} from './util.js';
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

render(siteHeader, new ProfileRatingView().getElement(), RenderPosition.BEFOREEND);
render(siteMain, new SiteMenuView(filters).getElement(), RenderPosition.BEFOREEND);

const siteContainer = new SiteContainerView();

if (films.length === 0) {
  render(siteMain, new NoFilmView().getElement(), RenderPosition.BEFOREEND);
} else {
  render(siteMain, new SortView().getElement(), RenderPosition.BEFOREEND);
  render(siteMain, siteContainer.getElement(), RenderPosition.BEFOREEND);
}


const createPopup = (film) => {
  const popupElement = new FilmPopupView(film).getElement();

  siteBody.classList.add('hide-overflow');
  siteBody.appendChild(popupElement);

  const closePopupButton = popupElement.querySelector('.film-details__close-btn');

  const removePopup = () => {
    siteBody.classList.remove('hide-overflow');
    siteBody.removeChild(popupElement);
  };

  const onClickCloseButton = (evt) => {
    evt.preventDefault();
    removePopup();
    closePopupButton.removeEventListener('click', onClickCloseButton);
    document.removeEventListener('keydown', onEscKeyDown);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      removePopup();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  closePopupButton.addEventListener('click', onClickCloseButton);
  document.addEventListener('keydown', onEscKeyDown);
};

const addListenersOnElement = (filmElement, film) => {


  filmElement.querySelectorAll('.film-card__popup-open')
    .forEach((element) => {
      element.addEventListener('click', () => {
        createPopup(film);
      });
    });
};

//All movies
const filmListAllMovies = siteMain.querySelector('.films-list--all-movies');
const filmContainer = filmListAllMovies.querySelector('.films-list__container');
for (let i = 0;i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
  const film = new FilmTemplateView(films[i]).getElement();
  render(filmContainer, film,RenderPosition.BEFOREEND);
  addListenersOnElement(film, films[i]);
}

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  const showMoreButton = new ShowMoreButtonView();

  render(filmListAllMovies, showMoreButton.getElement(), RenderPosition.BEFOREEND);

  showMoreButton.getElement().addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => {
        const filmItem = new FilmTemplateView(film).getElement();
        render(filmContainer, filmItem, RenderPosition.BEFOREEND);
        addListenersOnElement(filmItem, film);
      });
    renderedFilmCount += FILM_COUNT_PER_STEP;

    if (renderedFilmCount >= films.length) {
      showMoreButton.getElement().remove();
      showMoreButton.getElement().removeElement();
    }
  });
}

//Top rated
const filmListTopRated = siteMain.querySelector('.films-list--top-rated');
const filmListTopRatedContainer = filmListTopRated.querySelector('.films-list__container');
for (let i = 0;i < EXTRA_FILMS_COUNT; i++) {
  const film = new FilmTemplateView(films[i]).getElement();
  render(filmListTopRatedContainer, film, RenderPosition.BEFOREEND);
  addListenersOnElement(film, films[i]);
}

//Most commented
const filmListMostCommented = siteMain.querySelector('.films-list--most-commented');
const filmListMostCommentedContainer = filmListMostCommented.querySelector('.films-list__container');
for (let i = 0;i < EXTRA_FILMS_COUNT;i++) {
  const film = new FilmTemplateView(films[i]).getElement();
  render(filmListMostCommentedContainer, film, RenderPosition.BEFOREEND);
  addListenersOnElement(film, films[i]);
}

render(siteFooter, new SiteStatisticView(FILM_COUNT).getElement(), RenderPosition.BEFOREEND);


