const searchButton = document.getElementById('search-button');
const overlay = document.getElementById('modal-overlay');
const movieName = document.querySelector('input#movie-name');
const movieYear = document.querySelector('input#movie-year');
const movieListContainer = document.querySelector('section#movie-list');

let movieList = JSON.parse(localStorage.getItem('movieList')) ?? [];

async function searchButtonClickHandler() {
  try {
    let url = `https://www.omdbapi.com/?apikey=${key}&t=${movieNameParameterGenerator()}${movieYearParameterGenerator()}`;
    const response = await fetch(url);
    const data = await response.json();
    createModal(data);
    if(data.Error){
      throw new Error('Filme não encontrado!')
    }
    overlay.classList.add('open');
  } catch(error) {
    notie.alert({type: 'error', text: error.message});
  }
}

function movieNameParameterGenerator(){
  if(movieName.value === ''){
    throw new Error('O nome do filme deve ser informado!');
  } else {
    return movieName.value.split(' ').join('+');
  }
}

function movieYearParameterGenerator(){
  if(movieYear.value === '') {
    return '';
  } 
  if(movieYear.value.length != 4 || Number.isNaN(Number(movieYear.value))) {
    throw new Error('Ano do filme inválido!');
  } else {
    return `&y=${movieYear.value}`;
  }
}

function addToList(movieObject) {
  movieList.push(movieObject);
}

function isMovieAlreadyOnList(id) {
  function comparatorMovieId(movieObject) {
    return movieObject.imdbID === id;
  }
  return Boolean(movieList.find(comparatorMovieId));
}

function updateUI(movieObject) {
  movieListContainer.innerHTML += 
    `<article id="movie-card-${movieObject.imdbID}">
        <img 
          src= "${movieObject.Poster}"
          alt="Poster do filme ${movieObject.Title}."
        />
        <button class="remove-button" onclick="{removeMovieFromList('${movieObject.imdbID}')}">
          <i class="bi bi-trash"></i> Remover
        </button>
      </article>`;
}

function removeMovieFromList(id) {
    notie.confirm({
      text:'Deseja remover o filme da sua lista?',
      submitText: 'Sim', 
      cancelText: 'Não',
      position: 'top',
      submitCallback: () => {
        movieList = movieList.filter(movie => movie.imdbID !== id);
        document.getElementById(`movie-card-${id}`).remove();
        updateLocalStorage();
      },
      cancellCallback: () => {
        return;
      }
    });
  }

function updateLocalStorage () {
  localStorage.setItem('movieList', JSON.stringify(movieList));
}

for(const movieInfo of movieList) {
  updateUI(movieInfo);
}

searchButton.addEventListener('click', searchButtonClickHandler);
