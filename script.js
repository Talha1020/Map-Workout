'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
let map, mapEvent;

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
}

class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence; // in min/km
    this.calcPace();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class Cycling extends Workout {
  constructor(coords, distance, duration, Elevation) {
    super(coords, distance, duration);
    this.Elevation = Elevation;
    this.calcSpeed();
  }
  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}
const Run1 = new Running([32, 9], 12, 100, 123);
const Cyc1 = new Cycling([32, 45], 12, 34, 124);
console.log(Run1, Cyc1);
class App {
  #map;

  #mapEvent;
  constructor() {
    this._GetPosition();
    this._workEvent();
    this._changeField();
    // this._showClick();
  }

  _GetPosition() {
    navigator.geolocation.getCurrentPosition(
      this._loadMap.bind(this),
      function () {
        console.log('Invalid');
      }
    );
  }

  _loadMap(position) {
    const { longitude, latitude } = position.coords;

    this.#map = L.map('map').setView([50.7821312, 6.0819434], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
    this._showClick();
  }
  _showClick() {
    console.log(this);
    this.#map.on('click', this._showForm.bind(this));
  }
  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }
  _changeField() {
    inputType.addEventListener('change', this._changeFormField.bind(this));
  }

  _changeFormField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _workEvent() {
    form.addEventListener('submit', this._newWorkout.bind(this));
  }

  _newWorkout(e) {
    e.preventDefault();
    inputDistance.value =
      inputCadence.value =
      inputDuration.value =
      inputElevation.value =
        '';
    const { lat, lng } = this.#mapEvent.latlng;

    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxwidth: 200,
          minWidth: 55,
          closeOnClick: false,
          className: 'running-popup',
          closeOnEscapeKey: false,
          autoClose: false,
        })
      )
      .setPopupContent('Workout')
      .openPopup();
  }
}

const app = new App();
