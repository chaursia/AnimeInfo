async function fetchAnime(startYear, endYear, containerSelector, loadMore = false) {
    const container = document.querySelector(containerSelector);
    const offset = loadMore ? container.children.length : 0;
    const url = `https://api.jikan.moe/v4/anime?start_date=${startYear}-01-01&end_date=${endYear}-12-31&order_by=score&sort=desc&limit=5&page=${Math.floor(offset / 10) + 1}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        data.data.forEach(anime => {
            const animeCard = document.createElement("div");
            animeCard.className = "grid-data";
            animeCard.innerHTML = `
                <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
                <div class="anime-info">
                    <div class="anime-title">${anime.title}</div>
                    <div class="anime-details">
                        <span class="rating">${anime.type} ${anime.year || 'N/A'} • ${anime.episodes || 'N/A'} eps</span><br>
                        <span class="rating">⭐ ${anime.score} (${anime.scored_by} votes)</span><br>
                        <span class="genre-list">${anime.genres.map(g => g.name).join(", ")}</span>
                    </div>
                </div>
            `;
            container.appendChild(animeCard);
        });

    } catch (error) {
        console.error("Error fetching anime data:", error);
    }
}

// Function to load upcoming anime trailers
async function loadUpcomingAnimeTrailers() {
    const videoTrailerContainer = document.getElementById("video-trailer");

    try {
        let page = 1;
        let foundTrailers = 0;

        while (foundTrailers < 8) {
            const response = await fetch(`https://api.jikan.moe/v4/anime?status=upcoming&page=${page}`);
            const data = await response.json();
            if (!data.data.length) break;

            for (const anime of data.data) {
                if (anime.trailer && anime.trailer.youtube_id) {
                    const videoCard = document.createElement("div");
                    videoCard.className = "video-card";

                    videoCard.innerHTML = `
                        <iframe class="video-frame" src="https://www.youtube.com/embed/${anime.trailer.youtube_id}" allowfullscreen></iframe>
                        <div class="video-info">
                            <p class="video-title">🎬 ${anime.title} - Trailer</p>
                            <div class="channel-info">
                                <img src="${anime.images.webp.image_url}" alt="Anime">
                                <span>${anime.title} | Upcoming Anime</span>
                            </div>
                        </div>
                    `;

                    videoTrailerContainer.appendChild(videoCard);
                    foundTrailers++;

                    if (foundTrailers >= 8) return;
                }
            }

            page++;
        }
    } catch (error) {
        console.error("Error fetching upcoming anime trailers:", error);
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    // Function to load anime by decade concurrently
    async function loadAnimeData() {
        await Promise.all([
            fetchAnime(1990, 1999, "#anime-90s"),
            fetchAnime(2000, 2009, "#anime-00s"),
            fetchAnime(2010, 2019, "#anime-10s")
        ]);
    }

    // Run both functions concurrently
    await Promise.all([loadAnimeData(), loadUpcomingAnimeTrailers()]);
});


