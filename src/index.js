import './css/styles.css';
import { fetchCountries } from './fetchCounries';
import Notiflix, { Notify } from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const searchInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch (evt) {
    const countryName = evt.target.value.trim();

    if (!countryName) {
        clearListMarkup();
        clearInfoMarkup();
        return;
    };

    fetchCountries(countryName).then(countries => {
    if(countries.length > 10){
        Notify.info("Too many matches found. Please enter a more specific name.");
        return;
    };

    if(countries.length >= 2){
        createListMarkup(countries);
        clearInfoMarkup();
    };

    createInfoOfCountryMarkup(countries);
    clearListMarkup();
    
}).catch(error => 
    Notify.failure("Oops, there is no country with that name"));
    clearListMarkup();
    clearInfoMarkup();
    return
};

function createListMarkup(countries) {
    const listMarkup = countries.map(({ name: { official }, flags: { svg } }) => 
    `<li class="country-list_item">
    <img class="country-list_flag" src="${svg}" alt="${official} flag" width="30">${official}</li>`);
    countryList.innerHTML = listMarkup.join('');
}


function createInfoOfCountryMarkup(countries) {
    const infoOfCountryMarkup = countries.map(({ name: { official }, capital, population, languages, flags: { svg } }) => 
    `<img class="country-info_flag" src="${svg}" alt="${official} flag" width = "50">
    <h1 class="country-info_name">${official}</h1>
    <ul class="country-info_list">
    <li class = "country-info_item"><b>Capital:</b> ${capital}</li>
    <li class = "country-info_item"><b>Population:</b> ${population}</li>
    <li class = "country-info_item"><b>Languages:</b> ${Object.values(languages)}</li>
    </ul>`
    );

    countryInfo.innerHTML = infoOfCountryMarkup.join('');
}

function clearListMarkup() {
    countryList.innerHTML = '';
}

function clearInfoMarkup() {
    countryInfo.innerHTML = '';
}

