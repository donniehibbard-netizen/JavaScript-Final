// to search for movies using the OMDB API
// https://www.omdbapi.com/?apikey=e8b0f28d&s=

const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const movieGrid = document.querySelector("#movieGrid");
const apiKey = "e8b0f28d";

const resultsInfo = document.querySelector("#resultsInfo");
const sortSelect = document.querySelector("#sortSelect");

let currentMovies = [];

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    fetchMovies(searchTerm);
  }
});

function showSkeletons() {
  const skeletons = Array(10)
    .fill(0)
    .map(
      () => `<div class="movie-card__poster-placeholder">
          Movie Poster<br>Not Available
        </div>`,
    )
    .join("");
  movieGrid.innerHTML = skeletons;
}

async function fetchMovies(searchTerm) {
  showSkeletons();

  const res = await fetch(
    `https://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm}`,
  );
  const data = await res.json();

  if (data.Response === "True") {
    currentMovies = data.Search;
    resultsInfo.textContent = `showing: ${searchTerm}`;
    sortSelect.value = "default";
    displayMovies(currentMovies);
  } else {
    resultsInfo.textContent = `showing: ${searchTerm}`;
    movieGrid.innerHTML = `<p>No Movies found.</p>`;
    currentMovies = [];
  }
}

// function displayMovies(movies) {
//   const moviesHTML = movies
//     .map((movie) => {
//       const posterImg = movie.Poster !== "N/A" ? movie.Poster : "";

//       return `
//             <div class="movie-card">
//                 <img class="movie-card__img" src="${
//                   posterImg || "https://via.placeholder.com/300x450"
//                 }" alt="${movie.Title}">
//                 <h2 class="movie-card__title">${movie.Title}</h2>
//                 <p class="movie-card__year">Year: ${movie.Year}</p>
//             </div>
//         `;
//     })
//     .join("");

//   movieGrid.innerHTML = moviesHTML;
// }

function displayMovies(movies) {
  const moviesHTML = movies
    .map((movie) => {
      // Check if poster exists and is not "N/A"
      const hasPoster = movie.Poster && movie.Poster !== "N/A";

      return `
            <div class="movie-card">
                ${
                  hasPoster
                    ? `<img class="movie-card__img" src="${movie.Poster}" alt="${movie.Title}">`
                    : `<div class="movie-card__poster-placeholder">
                         Movie Poster<br>Not Available
                       </div>`
                }
                <h2 class="movie-card__title">${movie.Title}</h2>
                <p class="movie-card__year">Year: ${movie.Year}</p>
            </div>
        `;
    })
    .join("");

  movieGrid.innerHTML = moviesHTML;
}

sortSelect.addEventListener("change", () => {
  const sortBy = sortSelect.value;
  let sortedMovies = [...currentMovies];

  if (sortBy === "a-z") {
    // Sort alphabetically A to Z by Title
    sortedMovies.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (sortBy === "z-a") {
    // Sort alphabetically Z to A by Title
    sortedMovies.sort((a, b) => b.Title.localeCompare(a.Title));
  } else if (sortBy === "Newest") {
    // Sort by Year descending (Newest first)
    // Note: OMDB years are strings (e.g., "2023" or sometimes "2015–2020"), so we parse them as numbers
    sortedMovies.sort((a, b) => parseInt(b.Year) - parseInt(parseInt(a.Year)));
  } else if (sortBy === "Oldest") {
    // Sort by Year ascending (Oldest first)
    sortedMovies.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
  }
  // If sortBy === "Default", it skips the filters and uses the original array order

  displayMovies(sortedMovies);
});
