import ProfileRatingView from '../view/profile-rating.js';
import {generateProfileRank, ProfileRanks} from '../utils/profile-rank.js';
import {RenderPosition, render, remove} from '../utils/render.js';


export default class ProfileRank {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;

    this._handleModeEvent = this._handleModeEvent.bind(this);

    this._filmsModel.addObserver(this._handleModeEvent);
  }

  init() {
    const films = this._filmsModel.get();

    this._profileRankComponent = new ProfileRatingView(generateProfileRank(films));
    render(this._container, this._profileRankComponent, RenderPosition.BEFOREEND);

    if (films.length === 0 || generateProfileRank(films) === ProfileRanks.UNRANKED) {
      remove(this._profileRankComponent);
    }
  }

  _getUpdatedRank(rank) {
    this._profileRankComponent.getElement().querySelector('.profile__rating').textContent = rank;
  }

  _handleModeEvent() {
    const films = this._filmsModel.get();

    this._getUpdatedRank(generateProfileRank(films));

    if (films.length === 0 || generateProfileRank(films) === ProfileRanks.UNRANKED) {
      remove(this._profileRankComponent);
    }
  }
}
