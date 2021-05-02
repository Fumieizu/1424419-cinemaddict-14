import AbstractView from './abstract.js';

export default class ProfileRating  extends AbstractView {
  constructor(profileRank) {
    super();
    this._profileRank = profileRank;
  }
  getTemplate() {
    return `<section class="header__profile profile">
    <p class="profile__rating">${this._profileRank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
  }
}
