document.addEventListener("DOMContentLoaded", async function () {
    async function fetchTrendingAnime() {
        try {
            const response = await fetch('https://kitsu.io/api/edge/trending/anime');
            const data = await response.json();
            const container = document.getElementById('trending-anime');

            // Ensure there is at least one anime in the response
            if (data.data.length === 0) return;

            // Get the first image in the existing card and update it
            const existingCardImg = document.querySelector('.cards .card .image img');
            if (existingCardImg) {
                existingCardImg.src = data.data[0].attributes.posterImage.small;
                existingCardImg.alt = data.data[0].attributes.titles.en || data.data[0].attributes.titles.ja_jp;
            }

            // Append additional anime cards
            data.data.slice(1, 10).forEach(anime => {
                const animeCard = document.createElement('div');
                animeCard.classList.add('card');
                animeCard.innerHTML = `
                    <div class="image">
                        <img src="${anime.attributes.posterImage.small}" alt="${anime.attributes.titles.en || anime.attributes.titles.ja_jp}">
                    </div>
                `;
                container.appendChild(animeCard);
            });

        } catch (error) {
            console.error('Error fetching trending anime:', error);
        }
    }

    fetchTrendingAnime();
});



// top arising //
document.addEventListener("DOMContentLoaded", function () {
    fetchTopFavoriteAnime();
    fetchTopArisingAnime();
    fetchMostPopularAnime();
    fetchUpcomingAnime(); // ✅ Added upcoming anime fetch
  });
  
  // 🔹 Fetch Top Favorite Anime
  function fetchTopFavoriteAnime() {
    fetch("https://kitsu.io/api/edge/anime?sort=-favoritesCount&page[limit]=6")
        .then(response => response.json())
        .then(data => insertAnimeData(data, "top-favorite-anime"))
        .catch(error => console.error("Error fetching top favorite anime:", error));
  }
  
  // 🔹 Fetch Top Arising Anime
  function fetchTopArisingAnime() {
    fetch("https://kitsu.io/api/edge/anime?sort=-averageRating&page[limit]=6")
        .then(response => response.json())
        .then(data => insertAnimeData(data, "top-arising-anime"))
        .catch(error => console.error("Error fetching top arising anime:", error));
  }
  
  // 🔹 Fetch Most Popular Anime
  function fetchMostPopularAnime() {
    fetch("https://kitsu.io/api/edge/anime?sort=-averageRating&filter[seasonYear]=1990..1999&page[limit]=6")
        .then(response => response.json())
        .then(data => insertAnimeData(data, "most-popular-anime"))
        .catch(error => console.error("Error fetching most popular anime:", error));
  }
  
  // 🔹 Fetch Upcoming Anime
  function fetchUpcomingAnime() {
    fetch("https://kitsu.io/api/edge/anime?filter[status]=upcoming&page[limit]=6")
        .then(response => response.json())
        .then(data => insertAnimeData(data, "upcoming-anime")) // ✅ Insert into upcoming anime container
        .catch(error => console.error("Error fetching upcoming anime:", error));
  }
  
  // 🔹 Insert Anime Data into the Respective Section
  function insertAnimeData(data, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ""; // Clear previous content
  
    data.data.forEach(anime => {
        const title = anime.attributes.titles.en || anime.attributes.titles.ja_jp;
        const imageUrl = anime.attributes.posterImage.original;
        const rating = anime.attributes.averageRating || "?";
        const type = anime.attributes.showType.toUpperCase();
        const episodeCount = anime.attributes.episodeCount || "?"; // Get episode count
  
        const animeHTML = `
            <div class="an-grid-content">
                <img src="${imageUrl}" alt="${title}">
                <div class="an-grid-content-info">
                    <h4>${title}</h4>
                    <div class="grid-meta-info">
                        <span class="grid-cc"><svg><use href="#grid-cc-svg"></use></svg> ${episodeCount}</span>
                        <span class="grid-rating"><svg><use href="#grid-rating-svg"></use></svg> ${rating}</span>
                        <span class="grid-type">• ${type}</span>
                    </div>
                </div>
            </div>
            <hr>
        `;
        container.innerHTML += animeHTML;
    });
  }
  
  /* Genres */
  async function fetchGenres() {
    const genres = [
        "Action", "Adventure", "Animation", "Comedy", "Drama", "Fantasy", "Magic", "Mystery", "Romance",
        "Sci-Fi", "Slice of Life", "Supernatural", "Thriller", "Horror", "School", "Sports", "Music", "Mecha"
    ];

    const buttonWrapper = document.getElementById('mg-btn-wrapper');
    buttonWrapper.innerHTML = ''; // Clear any existing buttons

    // Create a button for each genre in the hardcoded list
    genres.forEach(genre => {
        const button = document.createElement('button');
        button.classList.add('cn-btn-an');
        button.innerText = genre; // Genre name from the hardcoded list
        buttonWrapper.appendChild(button);
    });
}

// Call the function to fetch genres and display them
fetchGenres();
