import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart.js';
import {DatePeriod} from '../const.js';

const BAR_HEIGHT = 50;

const createChart = (statisticCtx, {genres, count}) => {

  statisticCtx.height = BAR_HEIGHT * genres.length;

  return new Chart(
    statisticCtx, {
      plugins: [ChartDataLabels],
      type: 'horizontalBar',
      data: {
        labels: genres,
        datasets: [{
          data: count,
          backgroundColor: '#ffe800',
          hoverBackgroundColor: '#ffe800',
          anchor: 'start',
          barThickness: 24,
        }],
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 20,
            },
            color: '#ffffff',
            anchor: 'start',
            align: 'start',
            offset: 40,
          },
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: '#ffffff',
              padding: 100,
              fontSize: 20,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
        },
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
      },
    });
};

const getHumanizedDurationStats = (totalTime) => {
  const hours = Math.floor(totalTime / 60);
  const minutes = totalTime % 60;
  const hoursOutput = hours ? hours + '<span class="statistic__item-description">h</span> ' : '';

  return hoursOutput + minutes + '<span class="statistic__item-description">m</span>';
};

const getTopGenre = (genres) => genres.length === 0 ? '' : genres[0];

const createStatisticsTemplate = ({period, watchedFilms,  genres, profileRank}) => {

  const watchedFilmsTimeInMinutesCount = watchedFilms.reduce((accumulator, film) => {

    return accumulator + film.time;
  }, 0);

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${profileRank}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="${DatePeriod.ALL_TIME}" ${period === DatePeriod.ALL_TIME ? 'checked' : ''}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="${DatePeriod.TODAY}" ${period === DatePeriod.TODAY ? 'checked' : ''}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="${DatePeriod.WEEK}" ${period === DatePeriod.WEEK ? 'checked' : ''}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="${DatePeriod.MONTH}" ${period === DatePeriod.MONTH ? 'checked' : ''}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="${DatePeriod.YEAR}" ${period === DatePeriod.YEAR ? 'checked' : ''}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedFilms.length}<span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${getHumanizedDurationStats(watchedFilmsTimeInMinutesCount)}</p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${getTopGenre(genres)}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};

export default class Statistic extends SmartView {
  constructor(data) {
    super();

    this._data = data;

    this._statisticFilterChangeHandler = this._statisticFilterChangeHandler.bind(this);

    this._setChart();
  }

  getTemplate() {
    return createStatisticsTemplate(this._data);
  }

  restoreHandlers() {
    this.setFilterStatisticChangeHandler(this._callback.statisticFilterChange);
    this._setChart();
  }

  setFilterStatisticChangeHandler(callback) {
    this._callback.statisticFilterChange = callback;
    this.getElement().querySelector('.statistic__filters').addEventListener('change', this. _statisticFilterChangeHandler);
  }

  _statisticFilterChangeHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    evt.preventDefault();

    this._callback.statisticFilterChange(evt.target.value);
  }

  _setChart() {
    const statisticCtx = this.getElement().querySelector('.statistic__chart');

    createChart(statisticCtx, this._data);
  }
}
