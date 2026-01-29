// 🌍 API endpoint: fetch all countries with necessary fields
const API_URL = "https://restcountries.com/v3.1/all?fields=name,flags,cca2,cca3,region,capital,population,area";

// 📦 DOM references and data storage
let allCountries = []; // store all countries
const countriesContainer = document.getElementById("countriesContainer");
const statusDiv = document.getElementById("status");
const searchName = document.getElementById("searchName");
const searchCode = document.getElementById("searchCode");
const searchCapital = document.getElementById("searchCapital");
const searchRegion = document.getElementById("searchRegion");
const nameSuggestions = document.getElementById("nameSuggestions");

// ⭐ Favorites stored in localStorage
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// 🚀 Fetch all countries on page load
async function fetchCountries() {
  try {
    const res = await fetch(API_URL); // fetch API data
    if (!res.ok) throw new Error("Failed to fetch countries");
    const data = await res.json();
    allCountries = data; // store in memory

    statusDiv.textContent = `Loaded ${allCountries.length} countries.`;
    renderCountries(allCountries); // show all countries
  } catch (error) {
    console.error(error);
    statusDiv.textContent = "Error loading countries. Please refresh and try again.";
  }
}

// 🎨 Render country cards dynamically
function renderCountries(countries) {
  countriesContainer.innerHTML = ""; // clear container

  if (countries.length === 0) {
    countriesContainer.innerHTML = '<p class="text-center text-muted">No countries found.</p>';
    return;
  }

  countries.forEach(country => {
    const { flags, name, cca2, cca3, region, capital, population } = country;

    const col = document.createElement("div");
    col.className = "col-sm-6 col-md-4 col-lg-3";

    const card = document.createElement("div");
    card.className = "country-card h-100";

    // 🔍 Clicking card opens modal
    card.addEventListener("click", () => openModal(country));

    card.innerHTML = `
      <img src="${flags?.png}" alt="Flag of ${name.common}" class="flag-img"/>
      <span class="favorite">${favorites.includes(name.common) ? "⭐" : "☆"}</span>
      <div class="country-details">
        <div class="country-name">${name.common}</div>
        <p class="country-info"><strong>Code:</strong> ${cca2 || ""} (${cca3 || ""})</p>
        <p class="country-info"><strong>Region:</strong> ${region || "N/A"}</p>
        <p class="country-info"><strong>Capital:</strong> ${capital ? capital[0] : "N/A"}</p>
        <p class="country-info mb-0"><strong>Population:</strong> ${population.toLocaleString()}</p>
      </div>
    `;

    // ⭐ Favorite toggle (stop modal propagation)
    card.querySelector(".favorite").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(name.common);
    });

    col.appendChild(card);
    countriesContainer.appendChild(col);
  });
}

// 🔍 Filter countries based on user inputs
function applyFilters() {
  const nameValue = searchName.value.trim().toLowerCase();
  const codeValue = searchCode.value.trim().toLowerCase();
  const capitalValue = searchCapital.value.trim().toLowerCase();
  const regionValue = searchRegion.value;

  const filtered = allCountries.filter(country => {
    const countryName = country.name?.common?.toLowerCase() || "";
    const cca2 = country.cca2?.toLowerCase() || "";
    const cca3 = country.cca3?.toLowerCase() || "";
    const capital = country.capital?.[0]?.toLowerCase() || "";
    const region = country.region || "";

    const matchesName = countryName.includes(nameValue);
    const matchesCode = !codeValue || cca2 === codeValue || cca3 === codeValue;
    const matchesCapital = capital.includes(capitalValue);
    const matchesRegion = !regionValue || region === regionValue;

    return matchesName && matchesCode && matchesCapital && matchesRegion;
  });

  statusDiv.textContent = `Showing ${filtered.length} of ${allCountries.length} countries.`;
  renderCountries(filtered);
}

// ✨ Show name suggestions while typing
function updateNameSuggestions() {
  const query = searchName.value.trim().toLowerCase();
  nameSuggestions.innerHTML = "";

  if (!query) {
    nameSuggestions.classList.add("d-none");
    return;
  }

  const matches = allCountries
    .filter(country => country.name?.common?.toLowerCase().includes(query))
    .slice(0, 7);

  if (matches.length === 0) {
    nameSuggestions.classList.add("d-none");
    return;
  }

  matches.forEach(country => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "list-group-item list-group-item-action";
    button.textContent = country.name.common;

    button.addEventListener("click", () => {
      searchName.value = country.name.common;
      nameSuggestions.classList.add("d-none");
      applyFilters();
    });

    nameSuggestions.appendChild(button);
  });

  nameSuggestions.classList.remove("d-none");
}

// 👂 Event listeners for search inputs
searchName.addEventListener("input", () => { updateNameSuggestions(); applyFilters(); });
[searchCode, searchCapital].forEach(input => input.addEventListener("input", applyFilters));
searchRegion.addEventListener("change", applyFilters);

// Hide suggestions when clicking outside
document.addEventListener("click", (event) => {
  const isClickInside = event.target === searchName || nameSuggestions.contains(event.target);
  if (!isClickInside) nameSuggestions.classList.add("d-none");
});

// ⭐ Favorites management
function toggleFavorite(name) {
  if (favorites.includes(name)) favorites = favorites.filter(f => f !== name);
  else favorites.push(name);

  localStorage.setItem("favorites", JSON.stringify(favorites));
  applyFilters(); // refresh current view
}

// Show favourites with ✖ cross
function showFavorites() {
  const favCountries = allCountries.filter(c => favorites.includes(c.name.common));

  statusDiv.innerHTML = `
    ⭐ Favorite Countries
    <span style="cursor:pointer; margin-left:10px; font-weight:bold;"
          title="Back to all countries"
          onclick="showAllCountries()">✖</span>
  `;

  renderCountries(favCountries);
}

// 🔙 Restore all countries
function showAllCountries() {
  statusDiv.textContent = `Loaded ${allCountries.length} countries.`;
  renderCountries(allCountries);
}

// 🔀 Sort countries
document.getElementById("sortSelect").addEventListener("change", (e) => {
  let sorted = [...allCountries];

  if (e.target.value === "name") sorted.sort((a,b) => a.name.common.localeCompare(b.name.common));
  if (e.target.value === "population") sorted.sort((a,b) => b.population - a.population);

  renderCountries(sorted);
});

// 🏆 Show Top 10 most populated
function showTop10() {
  const top10 = [...allCountries].sort((a,b) => b.population - a.population).slice(0,10);
  statusDiv.textContent = "🏆 Top 10 Most Populated Countries";
  renderCountries(top10);
}

// 🌙 Theme toggle
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}

// Apply saved theme on load
if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark-mode");

// 🔍 Modal logic
function openModal(country) {
  document.getElementById("modalTitle").textContent = country.name.common;

  const maxPop = Math.max(...allCountries.map(c => c.population));
  const populationScore = Math.round((country.population / maxPop) * 100);
  const incomeScore = getIncomeLevel(country);
  const urbanScore = getUrbanizationLevel(country);

  document.getElementById("modalBody").innerHTML = `
    <div class="row g-4 align-items-center">
      <div class="col-md-6">
        <img src="${country.flags.png}" class="img-fluid rounded mb-3">
        <p><strong>Capital:</strong> ${country.capital?.[0] || "N/A"}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Codes:</strong> ${country.cca2} / ${country.cca3}</p>
      </div>
      <div class="col-md-6">
        <h5 class="mb-3">🧬 Country Life Index</h5>
        ${createBar("🧍 Population Power", populationScore)}
        ${createBar("💰 Estimated Income", incomeScore)}
        ${createBar("🏙 Urbanization", urbanScore)}
        ${createBar("🌱 Sustainability", 100 - urbanScore)}
      </div>
    </div>
  `;

  new bootstrap.Modal(document.getElementById("countryModal")).show();
}

// 🔧 Helper functions for modal
function createBar(label, value) {
  return `
    <div class="dna-bar">
      <div class="d-flex justify-content-between"><span>${label}</span><span>${value}%</span></div>
      <div class="bar-track">
        <div class="bar-fill" style="--level:${value}%"></div>
      </div>
    </div>
  `;
}

function getIncomeLevel(country) {
  const region = country.region;
  const pop = country.population;
  if (region === "Europe") return 80;
  if (region === "Americas") return 70;
  if (region === "Asia" && pop > 100_000_000) return 65;
  if (region === "Africa") return 45;
  return 55;
}

function getUrbanizationLevel(country) {
  if (!country.area) return 50;
  const density = country.population / country.area;
  if (density > 300) return 85;
  if (density > 100) return 65;
  if (density > 50) return 50;
  return 35;
}

// 🚀 Initial load
fetchCountries();
