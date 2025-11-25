async function fetchTopCharacters() {
    const query = `
    query {
        Page(perPage: 18) {
            characters(sort: FAVOURITES_DESC) {
                name { full }
                image { large }
                media(sort: POPULARITY_DESC) {
                    edges {
                        node {
                            title {
                                romaji
                            }
                            type
                        }
                    }
                }
            }
        }
    }`;

    try {
        const response = await fetch("https://graphql.anilist.co", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query })
        });

        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        const characters = data.data.Page.characters;

        const grid = document.getElementById("character-grid");
        grid.innerHTML = "";

        characters.forEach(character => {
            let animeTitle = "Unknown Anime";  

            if (character.media.edges.length > 0) {
                // Get the first anime or manga title
                const mediaEntry = character.media.edges.find(media => media.node.title.romaji);
                animeTitle = mediaEntry ? mediaEntry.node.title.romaji : "Unknown Anime";
            }

            const charDiv = document.createElement("div");
            charDiv.className = "character";
            charDiv.innerHTML = `
                <img src="${character.image.large}" alt="${character.name.full}">
                <div class="chara-info">
                    <h3>${character.name.full}</h3>
                    <p>${animeTitle}</p>
                </div>
            `;
            grid.appendChild(charDiv);
        });

    } catch (error) {
        console.error("Error fetching characters:", error);
    }
}

// Load top characters on page load
fetchTopCharacters();