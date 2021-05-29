import NewFetchApiFilms from './apiService';
import resetPage from './common/clear-markup';
import filmsGalleryTmp from '../templates/films-gallery.hbs';
import renderMarkup from './common/render-markup';
import { containerRef } from './common/refs';

const debounce = require('lodash.debounce');

const newFetchApiFilms = new NewFetchApiFilms();

const inputRef = document.querySelector('.search-form__input');
// resetPage(containerRef);

// function resetPage() {
//   containerRef.innerHTML = '';
//   console.log('containerRef', containerRef);
// }
inputRef.addEventListener('input', debounce(searchNewFilm, 1000));

async function showPopularFilms() {
  try {
    const films = await newFetchApiFilms
      .fetchApiPopularFilms()
      .then(response => response.data.results);

    addGenreToFilm(films);
    renderMarkup(containerRef, filmsGalleryTmp(films));
  } catch (error) {
    console.log(error);
  }
}

async function searchNewFilm(e) {
  try {
    newFetchApiFilms.query = e.target.value;

    const films = await newFetchApiFilms.fetchApiFilms().then(response => response.data.results);

    resetPage(containerRef);
    addGenreToFilm(films);
    renderMarkup(containerRef, filmsGalleryTmp(films));
  } catch (error) {
    console.log(error);
  }
}

async function addGenreToFilm(films) {
  const genres = await newFetchApiFilms.fetchGenreList().then(response => response.data.genres);

  const filmsWithGenre = films.map(film => {
    const genreArray = film.genre_ids.map(id => {
      return genres.find(genre => genre.id == id).name;
    });
    return { ...film, genre: genreArray };
  });
}
