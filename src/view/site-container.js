import AbstractView from './abstract.js';

export default class SiteContainer extends AbstractView {
  getTemplate() {
    return `<section class="films">
    <section class="films-list films-list--all-movies">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container"></div>

    </section>

    <section class="films-list films-list--extra films-list--top-rated">
      <h2 class="films-list__title">Top rated</h2>

      <div class="films-list__container"></div>
    </section>

    <section class="films-list films-list--extra films-list--most-commented">
      <h2 class="films-list__title">Most commented</h2>

      <div class="films-list__container"></div>
    </section>
  </section>`;
  }

  getFilmListAllMovies() {
    return this.getElement().querySelector('.films-list--all-movies');
  }

  getFilmListTopRated() {
    return  this.getElement().querySelector('.films-list--top-rated');
  }

  getFilmListMostCommented () {
    return  this.getElement().querySelector('.films-list--most-commented');
  }

  removeExtraList(element) {
    if (!this.getElement().contains(element)) {
      return;
    }

    return element.remove();
  }
}
