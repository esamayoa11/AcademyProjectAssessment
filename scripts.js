/**
 * Data Catalog Project Starter Code - SEA Stage 2 (UPGRADED VERSION)
 *
 * I upgraded the original "TV Show catalog" into a Pokémon Gen 1 catalog.
 *
 * Key upgrade:
 * - Moved from an ARRAY OF STRINGS → ARRAY OF OBJECTS (JSON dataset)
 * - This allows the building of real data operations like search, sort, and filtering.
 *
 */

const cardContainer = document.getElementById("card-container");

// ================================
// GLOBAL DATA STATE
// ================================

// Full dataset of 151 Pokemon loaded from JSON
let pokemons = [];
let filteredPokemons = []; // What the user is currently seeing (filtered/sorted version)
let allTypes = []; // Store all unique Pokémon types

// ================================
// LOAD DATA FROM JSON FILE
// ================================

/**
 * Load external JSON instead of hardcoding data
 * since per rules provided we are not allowed:
 * - to use an API
 * - data_gen1_pokemon.JSON is a local file that lives in the project
 */
fetch("data_gen1_pokemon.json")
  .then((response) => response.json())
  .then((data) => {
    pokemons = Object.values(data); // Convert JSON object → array
    filteredPokemons = []; // Start with an empty array to show no Pokémon initially

    // Get unique types and populate the dropdown
    getUniqueTypes();
  })
  .catch((err) => console.error("Error loading Pokémon data:", err));

// ================================
// RENDER POKEMON (CORE FUNCTION)
// ================================

/**
 * This function replaces the original "titles loop".
 * Instead of strings, we render full Pokémon objects.
 *
 * Each Pokémon card is created, and the card is populated with basic details.
 */
function showCards(list) {
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = ""; // Clear existing cards

  list.forEach((pokemon) => {
    const card = document.createElement("div");
    card.classList.add("card");

    // Simplified card: Only name and image
    card.innerHTML = `
      <h3>#${pokemon.dex_id} ${pokemon.name}</h3>
      <img src="${pokemon.images[0]}" alt="${pokemon.name} Image" />
    `;

    // Add click event to view full details of the Pokémon
    card.addEventListener("click", () => showPokemonDetails(pokemon));

    // Append the card to the container
    cardContainer.appendChild(card);
  });
}

// ================================
// SEARCH FEATURE (DATA OPERATION #1)
// ================================

/**
 * Filters Pokémon by name based on user input.
 * array.filter() + string matching.
 */
function filterPokemons() {
  const query = document.getElementById("search").value.toLowerCase();
  filteredPokemons = pokemons.filter((p) =>
    p.name.toLowerCase().includes(query)
  );
  showCards(filteredPokemons); // Re-render the filtered list
}

// ================================
// SORT FEATURE (DATA OPERATION #2)
// ================================

/**
 * Sorts Pokémon alphabetically or by Dex ID.
 * array.sort() and string or number comparison.
 */
function sortPokemons(sortBy) {
  if (sortBy === "name") {
    // Sort alphabetically by name
    filteredPokemons = filteredPokemons.length > 0 ? [...filteredPokemons] : [...pokemons]; // Ensure we're working with the latest dataset
    filteredPokemons.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "dex_id") {
    // Sort by Dex ID
    filteredPokemons = filteredPokemons.length > 0 ? [...filteredPokemons] : [...pokemons];
    filteredPokemons.sort((a, b) => a.dex_id - b.dex_id);
  }
  showCards(filteredPokemons); // Re-render the sorted Pokémon
}

// ================================
// RESET FEATURE
// ================================

/**
 * Restores original dataset view.
 */
function resetCatalog() {
  filteredPokemons = []; // Reset to empty (no Pokémon initially)
  document.getElementById("search").value = ""; // Clear search bar
  document.getElementById("type-select").value = ""; // Clear type selection
  showCards(filteredPokemons); // Re-render the empty state
}

// ================================
// POPULATE DROPDOWN (FILTER BY TYPE)
// ================================

/**
 * Get all unique Pokémon types and populate the dropdown menu.
 */
function getUniqueTypes() {
  allTypes = []; // Reset the list of types
  pokemons.forEach((pokemon) => {
    const types = pokemon.Type.split(", "); // Handle multiple types
    types.forEach((type) => {
      if (!allTypes.includes(type)) {
        allTypes.push(type);
      }
    });
  });

  // Populate the dropdown with the unique types
  const typeSelect = document.getElementById("type-select");
  allTypes.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    typeSelect.appendChild(option);
  });
}

/**
 * Filter Pokémon based on the selected type from the dropdown.
 */
function filterByType() {
  const selectedType = document.getElementById("type-select").value;

  if (selectedType === "") {
    // If no type is selected, show no Pokémon
    filteredPokemons = [];
  } else {
    // Filter by the selected type
    filteredPokemons = pokemons.filter((p) =>
      p.Type.toLowerCase().includes(selectedType.toLowerCase())
    );
  }

  showCards(filteredPokemons); // Re-render the filtered Pokémon cards
}

// ================================
// SHOW POKEMON DETAILS
// ================================

/**
 * Show Pokémon details in a separate section when clicked.
 */
function showPokemonDetails(pokemon) {
  const detailsContainer = document.getElementById("pokemon-info");
  detailsContainer.innerHTML = `
    <h3>${pokemon.name} (Dex #${pokemon.dex_id})</h3>
    <img src="${pokemon.images[0]}" alt="${pokemon.name} Image" />
    <ul>
      <li>Type: ${pokemon.Type}</li>
      <li>Species: ${pokemon.Species}</li>
      <li>Height: ${pokemon.Height}</li>
      <li>Weight: ${pokemon.Weight}</li>
      <li>Abilities: ${pokemon["Abilities"]}</li>
      <li>EV Yield: ${pokemon["EV Yield"]}</li>
      <li>Catch Rate: ${pokemon["Catch Rate"]}</li>
      <li>Base Friendship: ${pokemon["Base Friendship"]}</li>
      <li>Base Exp: ${pokemon["Base Exp"]}</li>
      <li>Growth Rate: ${pokemon["Growth Rate"]}</li>
      <li>Egg Groups: ${pokemon["Egg Groups"]}</li>
      <li>HP: ${pokemon["HP Base"]}</li>
      <li>Attack: ${pokemon["Attack Base"]}</li>
      <li>Defense: ${pokemon["Defense Base"]}</li>
      <li>Special Attack: ${pokemon["Special Attack Base"]}</li>
      <li>Special Defense: ${pokemon["Special Defense Base"]}</li>
      <li>Speed: ${pokemon["Speed Base"]}</li>
    </ul>
  `;
  document.getElementById("pokemon-details").style.display = "block"; // Show details section
  document.getElementById("catalog").style.display = "none"; // Hide catalog
}

/**
 * Go back to the catalog view after viewing details.
 */
function backToCatalog() {
  document.getElementById("pokemon-details").style.display = "none"; // Hide details
  document.getElementById("catalog").style.display = "block"; // Show catalog
}
