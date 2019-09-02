'use strict'

const searchUrl = "https://www.googleapis.com/youtube/v3/search"

const apiKey = "AIzaSyB3hw6YJqtiQRs1X5pNsmqWisgoifViVKE";

const eolUrl = "https://eol.org/api/search/1.0.json"

const history = [];

var current = 0;

//A function that keeps track of where the user has clicked, for the back button
function incrementHistory() {
  $('body').on('click', '.add', function (event) {
    current++;
    history.push($(this).closest('section').attr('id'));
  })
}

//On click of the start button brings users to the How to Search page
function startFunction() {
  $('#js-start-button').on('click', function () {
    $('.start-page').addClass('hidden').removeClass('current-page');
    $('.back-button').removeClass('invisible');
    $('.how-to-search').removeClass('hidden').addClass('current-page');
    $('#js-animals').empty();
  })
};


//on click of the nav bar, brings users back to the start page. 
function navHome() {
  $('.nav-home').on('click', function (event) {
    $('.start-page').removeClass('hidden').addClass('current-page');
    $('.back-button').addClass('invisible');
    $('.how-to-search').addClass('hidden').removeClass('current-page');
    $('.search-by-habitat').addClass('hidden').removeClass('current-page');
    $('.search-by-type').addClass('hidden').removeClass('current-page');
    $('.animal-page').addClass('hidden').removeClass('current-page');
    $('.text-search').addClass('hidden').removeClass('current-page');
    $('.video-page').addClass('hidden').removeClass('current-page');
    seeAnother("");
    emptyHistory();
  })
}

//empties history when users click nav to go back to the start
function emptyHistory() {
  history.length = 0;
}

function backButton() {
  $('.back-button').on('click', function (event) {
    let previous = current - 1;
    var previousPage = history[previous];
    $("body").find($("section")).not('hidden').addClass('hidden');
    $("body").find($('#' + previousPage)).removeClass('hidden');
    console.log("previous page is" + previousPage);
    if (previousPage != "animalPage") {
      $('#js-animals').empty();
    }
    if (previousPage == "startPage") {
      $('.back-button').addClass('invisible');
    }
    if (previousPage == "animalList") {
      $('.animal-name-container').empty();
    }
    if (previousPage == "searchAlphabetically") {
      $('.animal-name-container').empty();
    }
    history.pop();
    current--;
  })
}

//allows user to click on an option in the how to search page.
function getChoice() {
  $('.main-page-choice').on('click', function (event) {
    var page = $(event.target).closest('div.main-page-choice').attr('id');
    choosePath(page);
  })
}

function choosePath(page) {
  $('.how-to-search').addClass('hidden');
  if (page === 'habitat') {
    $('.search-by-habitat').removeClass('hidden');
  } else if (page == 'type') {
    $('.search-by-type').removeClass('hidden');
  } else if (page == 'text-search') {
    $('.text-search').removeClass('hidden');
  } else if (page == "animalAlphabet") {
    $('.search-alphabetically').removeClass('hidden');
  } else {
    randomAnimal();
  }
}

function searchHabitat() {
  $('.second-page-choice').on('click', function (event) {
    var habitat = $(event.target).closest('div.second-page-choice').attr('id');
    for (let i = 0; i < animals.length; i++) {
      if (animals[i].habitat.includes(habitat)) {
        generateAnimalCard(i);
      }
    }
    $('.search-by-habitat').addClass('hidden');
    $('.animal-page').removeClass('hidden');
  })
}

//allows users to search animals in the store alphabetically
function alphabetize() {
  $('.dictionaryChoice').on('click', function (event) {
    $('#searchAlphabetically').addClass('hidden');
    $('#animalList').removeClass('hidden');
    var letters = $(event.target).attr('id');
    const namesAlphabetized = [];
    if (letters == 'a-d') {
      for (let i = 0; i < animals.length; i++) {
        var firstLetter = animals[i].name.toLowerCase().charAt(0);
        if (firstLetter == 'a' || firstLetter == 'b' || firstLetter == 'c' || firstLetter == 'd') {
          namesAlphabetized.push(animals[i].name.toLowerCase());
        }
      }
    } else if (letters == 'e-m') {
      for (let i = 0; i < animals.length; i++) {
        var firstLetter = animals[i].name.toLowerCase().charAt(0);
        if (firstLetter == 'e' || firstLetter == 'f' || firstLetter == 'g' || firstLetter == 'h' || firstLetter == 'i' || firstLetter == 'j' || firstLetter == 'k' || firstLetter == 'l' || firstLetter == 'm') {
          namesAlphabetized.push(animals[i].name.toLowerCase());
        }
      }
    } else if (letters == 'n-z') {
      for (let i = 0; i < animals.length; i++) {
        var firstLetter = animals[i].name.toLowerCase().charAt(0);
        if (firstLetter == 'n' || firstLetter == 'o' || firstLetter == 'p' || firstLetter == 'q' || firstLetter == 'r' || firstLetter == 's' || firstLetter == 't' || firstLetter == 'u' || firstLetter == 'v' || firstLetter == 'w' || firstLetter == 'x' || firstLetter == 'y' || firstLetter == 'z') {
          namesAlphabetized.push(animals[i].name.toLowerCase());
        }
      }
    } else {
      for (let i = 0; i < animals.length; i++) {
        namesAlphabetized.push(animals[i].name.toLowerCase());
      }
    }
    namesAlphabetized.sort();
    for (let i = 0; i < namesAlphabetized.length; i++) {
      generateAnimalList(namesAlphabetized[i]);
    }
  })
}

//creates list of animals for the dictionary path
function generateAnimalList(i) {
  $('.animal-name-container').append(
    `<div class="animal-name add" role="listitem">
      <h4>${i}</h4>
    </div>`)
}

//allows user to choose from the list of animal names
function chooseAnimalName() {
  $('#animalList').on('click', '.animal-name', function (event) {
    let animal = $(this).find('h4').text();
    $('.animal-list').addClass('hidden');
    $('.video-page').removeClass('hidden');
    getVideo(animal);
  });
}

function searchType() {
  $('.second-page-choice').on('click', function (event) {
    var type = $(event.target).closest('div.second-page-choice').attr('id');
    for (let i = 0; i < animals.length; i++) {
      if (animals[i].type == type) {
        generateAnimalCard(i);
      }
    }
    $('.search-by-type').addClass('hidden');
    $('.animal-page').removeClass('hidden');
  })
}

//allows user to choose a random animal
function randomAnimal() {
  let randomizedAnimal = animals[Math.floor(Math.random() * animals.length)];
  let rando = randomizedAnimal.name;
  getVideo(rando);
}

$('.text-search').bind('keypress', function (e) {
  if (e.keyCode == 13) {
    $('#js-submit-text').trigger('click');
  }
});

function textSearch() {
  $('#js-submit-text').click(function (event) {
    event.preventDefault();
    const textInput = $('#text-input').val();
    if (!textInput) {
      alert("Please enter an animal");
    } else if ($.isNumeric(textInput)) {
      alert("Please input a real animal");
    } else {
      verifyAnimal(textInput);
      $('#text-input').val(null);
    }
  })
}

//turns the parameters into an encoded string
function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

//lets users choose from the animal cards
function chooseAnimal() {
  $('#js-animals').on('click', '.animal-card', function (event) {
    let animal = $(this).find('h4').text();
    $('.animal-page').addClass('hidden');
    $('.video-page').removeClass('hidden');
    getVideo(animal);
  });
}

//creates the animal cards
function generateAnimalCard(i) {
  $('#js-animals').append(
    `<div class="animal-card add">
      <h4>${animals[i].name}</h4>
      <img class="animal-pic" src="${animals[i].src}" alt="${animals[i].alt}">
    </div>`)
}

//runs the input from the text search area through the Encyclopedia of Life api, to verify that the text entered is an animal. 
//Although nearly every word in the dictionary returns at least one entry, I found that real animals will have at least 6 entries. 
function verifyAnimal(textInput) {
  const params = {
    q: textInput,
    exact: "true",
  };
  const queryString = formatQueryParams(params);
  const url = eolUrl + '?' + queryString;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      if (responseJson.totalResults < 6) {
        alert("We couldn't find that animal, try another!");
      } else {
        getVideo(textInput);
      }
    })
}

//pulls a video from the YouTube API
function getVideo(choice) {
  const params = {
    key: apiKey,
    q: choice + " animal kids nature learn",
    part: "snippet",
    safeSearch: "strict",
    type: "video",
    maxResults: 30,
  };
  const queryString = formatQueryParams(params);
  const url = searchUrl + '?' + queryString;
  $('.video-animal-name').empty()
  $('.video-animal-name').append(choice);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      if (responseJson.items.length === 0) {
        alert(`We couldn't find you any animals. Try choosing something else`);
      }
      else { displayResults(responseJson); }
    })
    .catch(err => {
      if (err.message == "Cannot read property 'id' of undefined") {
        alert("We couldn't find any videos of that animal, try another!");
      } else {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
      }
    });
}

//Of the 30 videos returned, randomly selects one to show to the user
function randomizeVideo(responseJson) {
  var theVideo = responseJson["items"][Math.floor(Math.random() * responseJson["items"].length)];
  $('.video-container').append(`<iframe width="90%" height="315"
    src="https://www.youtube.com/embed/${theVideo.id.videoId}?autoplay="1"">
    </iframe>`);
}

//displays the video page
function displayResults(responseJson) {
  $('.text-search').addClass('hidden').removeClass('current-page');
  $('.video-page').removeClass('hidden');
  $('.video-container').empty();
  randomizeVideo(responseJson);
}

//allows user to choose another video of the same animal
function seeAnother(animal) {
  $('#js-same-animal-video').on('click', function (event) {
    let animal = $('.video-animal-name').text();
    $('.video-container').empty();
    getVideo(animal);
  });
}

//brings user back to the how to search page
function chooseAnother() {
  $('#js-choose-another').on('click', function (event) {
    event.preventDefault();
    $('#js-animals').empty();
    $('#animalList').empty();
    $('.video-container').empty();
    $('.video-page').addClass('hidden');
    $('.how-to-search').removeClass('hidden');
  })
}

function watchForm() {
  startFunction();
  incrementHistory();
  navHome();
  backButton();
  getChoice();
  searchHabitat();
  searchType();
  textSearch();
  alphabetize();
  chooseAnimalName();
  seeAnother();
  chooseAnimal();
  chooseAnother();
};

$(watchForm);