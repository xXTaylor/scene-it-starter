// this function will take an array of movies (movieData) and render some cards to the page for each one
function renderMovies(movieData) {
    // map over each movie
    var movieHTML = movieData.map(function(movie) {
        // for each movie, return a string with the details that apply to that movie
        return `
        <div class="card movie-card" style="width: 18rem;">
            <img class="card-img-top" src="${movie.Poster}" alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title">${movie.Title}</h5>
                <p class="card-text">${movie.Year}</p>
                <button class="btn btn-primary" onClick="saveToWatchlist('${movie.imdbID}')">Save to Watchlist</button>
            </div>
        </div>
        `;
    })

    // NB: movieHTML is an array of strings at this point. i.e.
    // [
    //    '<div>movie 1</div>',
    //    '<div>movie 2</div>',
    //    '<div>movie 3</div>',
    // ]
    
    // join each string in the movieHTML array into one long string
    // i.e. '<div>movie 1</div><div>movie 2</div><div>movie 3</div>'
    var finalHTML = movieHTML.join('')

    // return the big long string of HTML
    return finalHTML;
}

// this function will store the movie data in localstorage based
// on the imdbID that is passed to the function
function saveToWatchlist(imdbID) {
    // find the movie from the `movieData` variable
    var movie = movieData.find(function(currentMovie) {
        // if  the currentMovie's imdbID matches the one we
        // are looking for, use that and store it in 'movie'
        return currentMovie.imdbID == imdbID;
    });

    // attempt to load the watchlist from localStorage
    var watchlistJSON = localStorage.getItem('watchlist');
    // localStorage can only store strings, so let's parse it into and object
    var watchlist = JSON.parse(watchlistJSON);
    // if the watchlist is null, nothing has ever been saved to localStorage
    if (watchlist == null) {
        // because the watchlist is null, let's make it an empty array so
        // that we can 'push' movies into it
        watchlist = [];
    }
    // push the movie we found earlier into the watchlist
    watchlist.push(movie);
    // again, localStorage can only store strings so let's convert the watchlist
    // object back into a JSON string (stringify it)
    watchlistJSON = JSON.stringify(watchlist);
    // finally, store the watchlisJSON string into localStorage
    localStorage.setItem('watchlist', watchlistJSON);
}

// once the content for the page (the DOM) has finished loading, this function will run
window.addEventListener('DOMContentLoaded', function() {
    // find form with  'id="search-form"' as an attribute
    var searchForm = document.getElementById('search-form');

    // add an event listener to the form so that when the form is submitted, this function will run
    searchForm.addEventListener('submit', function(event) {
        // the default behaviour of a form is to refresh the page, so lets prevent that
        event.preventDefault();
        // find the results container. This is where we will put the movie HTML
        var results = document.getElementsByClassName('results')[0];
        // set the innerHTML of the results div to the output of the render function

        var searchString = document.getElementById("search").value;

        var urlEncodedSearchString = encodeURIComponent(searchString);

        axios.get("https://www.omdbapi.com/?apikey=3430a78&s=" + urlEncodedSearchString)
        
        .then(function (response) {
            results.innerHTML = renderMovies(response.data.Search);
            movieData = response.data.Search;
        console.log(response);
        })
    })
});