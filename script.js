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
  work_object = [];

  date = new Date();
  id = (Date.now() + '').slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
}

class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence; // in min/km
    this.calcPace();
  }

  calcPace() {
    ////another way to make properties in constructors
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class Cycling extends Workout {
  type = 'cycling';
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

class App {
  #workout = [];
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

    const Valid_input = (...inputs) =>
      inputs.every(val => Number.isFinite(val));
    const Allpositive = (...inputs) => inputs.every(val => val > 0);

    const type = inputType.value;
    const Cadence = +inputCadence.value;
    const distance = +inputDistance.value;
    const Elevation = +inputElevation.value;
    let work;
    const Duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    if (type === 'running') {
      if (
        !Valid_input(distance, Cadence, Duration) &&
        !Allpositive(distance, Duration)
      )
        return alert('Please enter a valid Number');
      work = new Running([lat, lng], distance, Duration, Cadence);
    }

    if (type === 'cycling') {
      if (
        !Valid_input(distance, Elevation, Duration) &&
        !Allpositive(distance, Duration)
      )
        return alert('Please enter a valid Number');
      work = new Cycling([lat, lng], distance, Duration, Elevation);
    }
    inputDistance.value =
      inputCadence.value =
      inputDuration.value =
      inputElevation.value =
        '';

    this.#workout.push(work);

    this.add_marker(work);
    this._renderWorkout(work); //imp to give parameters for object, because the object is created here.
  }

  add_marker(work) {
    L.marker(work.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxwidth: 200,
          minWidth: 55,
          closeOnClick: false,
          className: `${work.type}-popup`,
          closeOnEscapeKey: false,
          autoClose: false,
        })
      )
      .setPopupContent('Workout')
      .openPopup();
  }

  _renderWorkout(work) {
    console.log(work);
    console.log(work.type.slice(1));
    console.log(work.distance);
    let html = `<li class="workout workout--${work.type}" data-id="1234567890">
    <h2 class="workout__title">${work.type[0].toUpperCase()}${work.type.slice(
      1
    )} on April 14</h2>
          <div class="workout__details">
            <span class="workout__icon">${
              work.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
            }</span>
            <span class="workout__value">${work.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${work.duration}</span>
            <span class="workout__unit">min</span>
          </div>
          `;
    if (work.type === 'cycling') {
      html += `<div class="workout__details">
       <span class="workout__icon">⚡️</span>
       <span class="workout__value">${work.speed.toFixed()}</span>
       <span class="workout__unit">km/h</span>
     </div>
     <div class="workout__details">
       <span class="workout__icon"> 🦶🏼</span>
       <span class="workout__value">${work.Elevation}</span>
       <span class="workout__unit">m</span>
     </div></li> `;
    }
    if (work.type === 'running') {
      html += `<div class="workout__details">
    <span class="workout__icon">⚡️</span>
    <span class="workout__value">${work.pace.toFixed()}</span>
    <span class="workout__unit">min/km</span>
  </div>
  <div class="workout__details">
    <span class="workout__icon">⛰</span>
    <span class="workout__value">${work.cadence}</span>
    <span class="workout__unit">spm</span>
  </div></li> `;
    }

    containerWorkouts.insertAdjacentHTML('afterend', html);
  }
}

const app = new App();
