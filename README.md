🌍 Countries Explorer Web App

A dynamic and interactive web application that fetches country data from the REST Countries API and allows users to search, filter, sort, favorite, and explore detailed information about countries around the world.

✨ Features
🔎 Search & Filter

Search countries by name (with live suggestions)

Filter by:

Country code (CCA2 / CCA3)

Capital city

Region

Combined filters work together seamlessly

⭐ Favorites

Mark countries as favorites

Favorites are saved in localStorage

View only favorite countries

Remove favorites instantly

🔀 Sorting & Highlights

Sort countries by:

Name (A–Z)

Population (highest first)

View Top 10 Most Populated Countries

📊 Country Details Modal

Clicking a country card opens a modal with:

Flag, capital, region, population, and codes

Country Life Index with animated bars:
Population Power
Estimated Income
Urbanization
Sustainability

🌙 Dark Mode
Toggle dark/light theme
Theme preference saved in localStorage

⚡ Performance & UX
Client-side filtering (no repeated API calls)
Responsive layout using Bootstrap
Smooth interactions and instant updates

🛠️ Technologies Used
HTML5
CSS3
JavaScript (ES6+)
Bootstrap 5
REST Countries API
LocalStorage

🌐 API Used
https://restcountries.com/v3.1/all?fields=name,flags,cca2,cca3,region,capital,population,area

📁 Project Structure
📦 countries-explorer
├── index.html
├── style.css
├── script.js
├── README.md

🚀 How It Works
All countries are fetched once on page load
Data is stored in memory for fast filtering
UI updates dynamically based on user input
Favorites and theme preferences persist via localStorage

🧪 Key Functions
fetchCountries() – Fetch and store country data
renderCountries() – Render country cards
applyFilters() – Apply all active filters
updateNameSuggestions() – Live name suggestions
toggleFavorite() – Add/remove favorites
openModal() – Show country details modal
toggleTheme() – Dark mode switch

📌 Future Improvements
Pagination or infinite scrolling
More accurate economic & urbanization data
Map integration
Export favorites
Accessibility improvements

🧑‍💻 Author
Your Name
Front-End Developer
🌐 Portfolio: your-portfolio-link
📧 Email: your-email

📜 License
This project is open-source and available under the MIT License.
