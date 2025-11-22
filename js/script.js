const global = {
  currPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
};

// Fetch data from API
async function fetchApiData(endpoint) {
  const API_KEY = "83b3d02513c7a14122d485ee939025f2";
  const API_URL = "https://api.themoviedb.org/3/";

  showSpinner();

  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );
  const data = await response.json();

  hideSpinner();

  return data;
}

// Make request to search
async function searchApiData(endpoint) {
  const API_KEY = "83b3d02513c7a14122d485ee939025f2";
  const API_URL = "https://api.themoviedb.org/3/";

  showSpinner();

  const response = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
  );
  const data = await response.json();

  hideSpinner();

  return data;
}

// Function to show spinner
function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}

// Function to hide spinner
function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}

// Display top 20 popular movies
async function displayPopularMovies() {
  const { results } = await fetchApiData("movie/popular");
  // console.log(results);
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `        
          <a href="movie-details.html?id=${movie.id}">
            ${
              movie.poster_path
                ? `<img
                    src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                    class="card-img-top"
                    alt="${movie.title}"
                />`
                : `<img
                    src="../images/no-image.jpg"
                    class="card-img-top"
                    alt="${movie.title}"
                />
                `
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
          </div>`;

    document.querySelector("#popular-movies").appendChild(div);
  });
}

// Display top 20 popular TV-shows
async function displayPopularShows() {
  const { results } = await fetchApiData("tv/popular");
  // console.log(results);
  results.forEach((show) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `        
          <a href="tv-details.html?id=${show.id}">
            ${
              show.poster_path
                ? `<img
                    src="https://image.tmdb.org/t/p/w500${show.poster_path}"
                    class="card-img-top"
                    alt="${show.name}"
                />`
                : `<img
                    src="../images/no-image.jpg"
                    class="card-img-top"
                    alt="${show.name}"
                />
                `
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${show.first_air_date}</small>
            </p>
          </div>`;

    document.querySelector("#popular-shows").appendChild(div);
  });
}

// Display Movie details
async function movieDetails() {
  const movieId = window.location.search.split("=")[1];
  const movie = await fetchApiData(`movie/${movieId}`);

  // Overlay for background image
  displayBackgroundImage("movie", movie.backdrop_path);

  const div = document.createElement("div");
  div.innerHTML = `
        <div class="details-top">
          <div>
            ${
              movie.poster_path
                ? `<img
                    src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                    class="card-img-top"
                    alt="${movie.name}"
                />`
                : `<img
                    src="../images/no-image.jpg"
                    class="card-img-top"
                    alt="${movie.name}"
                />
                `
            }
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
                ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
                ${movie.genres
                  .map((genre) => `<li>${genre.name}</li>`)
                  .join("")}
            </ul>
            <a href="${
              movie.homepage
            }" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${formatNumber(
              movie.budget
            )}</li>
            <li><span class="text-secondary">Revenue:</span> $${formatNumber(
              movie.revenue
            )}</li>
            <li><span class="text-secondary">Runtime:</span> ${
              movie.runtime
            } minutes</li>
            <li><span class="text-secondary">Status:</span> ${
              movie.status
            } </li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
                ${movie.production_companies
                  .map(
                    (company) => `
                    <span>${company.name}</span>`
                  )
                  .join("")}
          </div>
        </div>
    `;
  document.querySelector("#movie-details").appendChild(div);
  // console.log(movieId);
}

// Display TV Show details
async function ShowDetails() {
  const showId = window.location.search.split("=")[1];
  const show = await fetchApiData(`tv/${showId}`);
  // console.log(show);

  // Overlay for background image
  displayBackgroundImage("show", show.backdrop_path);

  const div = document.createElement("div");
  div.innerHTML = `
        <div class="details-top">
          <div>
            ${
              show.poster_path
                ? `<img
                    src="https://image.tmdb.org/t/p/w500${show.poster_path}"
                    class="card-img-top"
                    alt="${show.name}"
                />`
                : `<img
                    src="../images/no-image.jpg"
                    class="card-img-top"
                    alt="${show.name}"
                />
                `
            }
          </div>
          <div>
            <h2>${show.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Last Air Date: ${show.last_air_date}</p>
            <p>
                ${show.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
                ${show.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
            </ul>
            <a href="${
              show.homepage
            }" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number of Episodes:</span> ${
              show.number_of_episodes
            }</li>
            <li><span class="text-secondary">Last Episode to air:</span> ${
              show.last_episode_to_air.name
            }</li>
            <li><span class="text-secondary">Status:</span> ${show.status} </li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
                ${show.production_companies
                  .map(
                    (company) => `
                    <span>${company.name}</span>`
                  )
                  .join("")}
          </div>
        </div>
    `;
  document.querySelector("#show-details").appendChild(div);
  // console.log(movieId);
}

// Search Movies/shows
async function search() {
  const queryString = window.location.search;
  // console.log(queryString);
  const urlParams = new URLSearchParams(queryString);

  global.search.type = urlParams.get("type");
  global.search.term = urlParams.get("search-term");

  if (global.search.term !== "" && global.search.term !== null) {
    // @todo- make request and display results
    const { results, total_pages, page, total_results } = await searchApiData();

    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

    if (results.length === 0) {
      showAlert("No results found");
      return;
    }

    displaySearchResults(results);
    document.querySelector("#search-term").value = "";
  } else {
    showAlert("Please Enter a search term", "error");
  }
}

// Display the searched results
function displaySearchResults(results) {
  // Clear previous results
  document.querySelector("#search-results").innerHTML = "";
  document.querySelector("#search-results-heading").innerHTML = "";
  document.querySelector("#pagination").innerHTML = "";
  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `        
          <a href="${global.search.type}-details.html?id=${result.id}">
            ${
              result.poster_path
                ? `<img
                    src="https://image.tmdb.org/t/p/w500${result.poster_path}"
                    class="card-img-top"
                    alt="${
                      global.search.type === "movie"
                        ? result.title
                        : result.name
                    }"
                />`
                : `<img
                    src="../images/no-image.jpg"
                    class="card-img-top"
                    alt="${
                      global.search.type === "movie"
                        ? result.title
                        : result.name
                    }"
                />
                `
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${
              global.search.type === "movie" ? result.title : result.name
            }</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${
                global.search.type === "movie"
                  ? result.release_date
                  : result.first_air_date
              }</small>
            </p>
          </div>`;

    document.querySelector("#search-results-heading").innerHTML = `
        <h2> ${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>`;
    document.querySelector("#search-results").appendChild(div);
  });
  displayPagination();
}

// Display paginated results
function displayPagination() {
  const div = document.createElement("div");
  div.classList.add("pagination");
  div.innerHTML = `
          <button class="btn btn-primary" id="prev">Prev</button>
          <button class="btn btn-primary" id="next">Next</button>
          <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
        `;

  document.querySelector("#pagination").appendChild(div);

  //   Disable prev in first page
  if (global.search.page === 1) {
    document.querySelector("#prev").disabled = true;
  }
  //   Disable next in last page
  if (global.search.page === global.search.totalPages) {
    document.querySelector("#next").disabled = true;
  }

  //   Next page
  document.querySelector("#next").addEventListener("click", async () => {
    global.search.page++;
    const { results, total_pages } = await searchApiData();
    displaySearchResults(results);
  });

    //   Prev page
  document.querySelector("#prev").addEventListener("click", async () => {
    global.search.page--;
    const { results, total_pages } = await searchApiData();
    displaySearchResults(results);
  });
}
// Highlight Active link
function highlightActiveLink() {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.getAttribute("href") === global.currPage) {
      link.classList.add("active");
    }
  });
}

// Show Alert
function showAlert(message, className = "error") {
  const alertEl = document.createElement("div");
  alertEl.classList.add("alert", className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector("#alert").appendChild(alertEl);

  setTimeout(() => alertEl.remove(), 3000);
}
function formatNumber(number) {
  // Ensure the input is a valid number before formatting
  if (typeof number !== "number" || isNaN(number)) {
    return String(number); // Return as string if not a valid number
  }
  // Use toLocaleString() for locale-specific formatting with commas
  // 'en-US' specifically formats with commas for thousands separators
  return number.toLocaleString("en-US");
}

function displayBackgroundImage(type, path) {
  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${path})`;
  overlayDiv.style.backgroundSize = "cover";
  overlayDiv.style.backgroundPosition = "center";
  overlayDiv.style.backgroundRepeat = "no-repeat";
  overlayDiv.style.height = "100vh";
  overlayDiv.style.width = "100vw";
  overlayDiv.style.position = "absolute";
  overlayDiv.style.top = "0";
  overlayDiv.style.left = "0";
  overlayDiv.style.zIndex = "-1";
  overlayDiv.style.opacity = "0.1";

  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(overlayDiv);
  } else {
    document.querySelector("#show-details").appendChild(overlayDiv);
  }
}

async function displaySwiperImages() {
  const { results } = await fetchApiData("movie/now_playing");
  // console.log(result);
  results.forEach((content) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");
    div.innerHTML = `
            <a href="movie-details.html?id=${content.id}">
              ${
                content.poster_path
                  ? `<img
                    src="https://image.tmdb.org/t/p/w500${content.poster_path}"
                    class="card-img-top"
                    alt="${content.name}"
                />`
                  : `<img
                    src="../images/no-image.jpg"
                    class="card-img-top"
                    alt="${content.name}"
                />`
              }
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${content.vote_average.toFixed(
                1
              )} / 10
            </h4>
        `;

    document.querySelector(".swiper-wrapper").appendChild(div);
    initSwiper();
  });
}

function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

// Init pages
function init() {
  switch (global.currPage) {
    case "/":
    case "/index.html":
      console.log("Home");
      displaySwiperImages();
      displayPopularMovies();
      break;
    case "/movie-details.html":
      console.log("Movie Details");
      movieDetails();
      break;
    case "/search.html":
      console.log("Search page");
      search();
      break;
    case "/tv-details.html":
      console.log("TV Details");
      ShowDetails();
      break;
    case "/shows.html":
      console.log("Shows");
      displayPopularShows();
      break;
  }

  highlightActiveLink();
}

window.addEventListener("DOMContentLoaded", init);
