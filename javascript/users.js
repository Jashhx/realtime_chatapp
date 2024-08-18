// Get elements
const searchBar = document.querySelector(".search input");
const searchIcon = document.querySelector(".search button");
const usersList = document.querySelector(".users-list");

// Debounce function to limit API calls while typing
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Handle search icon click event
function handleSearchIconClick() {
  searchBar.classList.toggle("show");
  searchIcon.classList.toggle("active");
  searchBar.focus();
  if (searchBar.classList.contains("show")) {
    searchBar.value = "";
    searchBar.classList.remove("active");
    fetchUsers();
  }
}

// Handle search bar keyup event
function handleSearchBarKeyup() {
  const searchTerm = searchBar.value.trim();
  searchBar.classList.toggle("active", searchTerm !== "");

  fetchSearchResults(searchTerm);
}

// Fetch search results from the server
function fetchSearchResults(searchTerm) {
  fetch("php/search.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({ searchTerm })
  })
  .then(response => response.text())
  .then(data => {
    usersList.innerHTML = data;
  })
  .catch(error => {
    console.error("Error fetching search results:", error);
  });
}

// Fetch users list from the server
function fetchUsers() {
  fetch("php/users.php")
    .then(response => response.text())
    .then(data => {
      usersList.innerHTML = data;
    })
    .catch(error => {
      console.error("Error fetching users list:", error);
    });
}

// Debounced version of fetchSearchResults
const debouncedFetchSearchResults = debounce(fetchSearchResults, 300);

// Event listeners
searchIcon.addEventListener("click", handleSearchIconClick);
searchBar.addEventListener("keyup", () => {
  debouncedFetchSearchResults(searchBar.value.trim());
});

// Periodically refresh users list
setInterval(() => {
  if (!searchBar.classList.contains("show")) {
    fetchUsers();
  }
}, 500);
