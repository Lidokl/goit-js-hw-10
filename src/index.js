import './css/styles.css';

import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
var debounce = require('lodash.debounce');


const refs = {
    inputBox: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
  };
  
  refs.inputBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));
  
  function onInput(e) {
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
    const searchName = e.target.value.trim();
    if (searchName !== '') {
      fetchCountries(searchName).then(renderCountry).catch(onFetchError);
    }
  }
  
  function renderCountry(countries) {
    if (countries.length > 10) {
      Notify.info('Too many matches found. Please enter a more specific name');
      return;
    }
  
    if (2 < countries.length && countries.length < 10) {
      renderCountryList(countries);
      return;
    }
  
    renderCountryInfo(countries);
  }
  
  function renderCountryList(countries) {
    const markup = countries
      .map(country => {
        return `<li>
                  <img src="${country.flags.svg}" width = 35 height = 35>
                  <span><b>${country.name.official}</b></span>
                </li>`;
      })
      .join('');
    refs.countryList.innerHTML = markup;
  }
  
  function renderCountryInfo(countries) {
    const markup = countries.map(country => {
      return `<div class="country-flag-name">
                <img src="${country.flags.svg}" width = 35 height = 35>
                <span><b style="font-size: 20px">${country.name.official}</b></span>
              </div>
              <p><b>Capital</b>: ${country.capital}</p>
              <p><b>Population</b>: ${country.population}</p>
              <p><b>Languages</b>: ${Object.values(country.languages).join(', ')}</p>`;
    });
    refs.countryInfo.innerHTML = markup;
  }
  
  function onFetchError(error) {
    Notify.failure('Oops, there is no country with that name');
  }