'use strict'

const searchUrl= "https://www.googleapis.com/youtube/v3/search"

const apiKey= "AIzaSyB3hw6YJqtiQRs1X5pNsmqWisgoifViVKE";

const history = [];

var current = 0;

function incrementHistory(){
  $('body').on('click', '.add', function(event){
    current++;
    console.log("current is " + current);
    history.push($(this).closest('section').attr('id'));
    console.log("something was clicked" + history);
  })
}

function startFunction(){
  $('#js-start-button').on('click', function(){
    $('.start-page').addClass('hidden').removeClass('current-page');
    $('.how-to-search').removeClass('hidden').addClass('current-page');
    $('#js-animals').empty();
  })
};

function navHome(){
  $('.nav-home').on('click', function(event){
    $('.start-page').removeClass('hidden').addClass('current-page');
    $('.how-to-search').addClass('hidden').removeClass('current-page');
    $('.search-by-habitat').addClass('hidden').removeClass('current-page');
    $('.search-by-type').addClass('hidden').removeClass('current-page');
    $('.animal-page').addClass('hidden').removeClass('current-page');
    $('.text-search').addClass('hidden').removeClass('current-page');
    $('.video-page').addClass('hidden').removeClass('current-page');
    seeAnother("");
    console.log("seeAnother from navHome");
  })
}

function backButton(){
  $('.back-button').on('click', function(event){
    let previous = current-1;
    console.log("currentPage is " + current);
    console.log("previousPage is " + previous);
    var previousPage = history[previous];
    var currentPage = history[current];
    $("body").find($("section")).not('hidden').addClass('hidden');
    $("body").find($('#' + previousPage )).removeClass('hidden');
    if (previousPage != "animalPage"){
      $('#js-animals').empty();}
    history.pop();
    current--;
  })
}

function getChoice(){
  $('.main-page-choice').on('click', function(event){
    var page = $(event.target).attr('id');
    choosePath(page);
  })
}

function choosePath(page){
  $('.how-to-search').addClass('hidden');
  if (page === 'habitat'){
    $('.search-by-habitat').removeClass('hidden');
  } else if (page == 'type'){
    $('.search-by-type').removeClass('hidden');
  } else if(page == 'text-search'){
    $('.text-search').removeClass('hidden');
  } else {
    randomAnimal();
  }
}

function searchHabitat(){
   $('.second-page-choice').on('click', function(event){
    var habitat = $(event.target).attr('id');
    for (let i=0; i< animals.length; i++){
      if (animals[i].habitat.includes(habitat)){
        generateAnimalCard(i);
      }
    }
    $('.search-by-habitat').addClass('hidden');
    $('.animal-page').removeClass('hidden');
   })
}

function searchType(){
   $('.second-page-choice').on('click', function(event){
    var type = $(event.target).attr('id');
    for (let i=0; i< animals.length; i++){
      if (animals[i].type == type){
        generateAnimalCard(i);
      }
    }
    $('.search-by-type').addClass('hidden');
    $('.animal-page').removeClass('hidden');
   })
}

function randomAnimal(){
  let randomizedAnimal= animals[Math.floor(Math.random() * animals.length)];
  let rando = randomizedAnimal.name;
  getVideo(rando);
}

function textSearch(){
  $('.text-search').on('click', '#js-submit-text', function(event){
    event.preventDefault();
    const textInput= $('#text-input').val();
    if (!textInput){
      alert("Please enter an animal");
    } else if ($.isNumeric(textInput)){
      alert("Please input a real animal");
    }
    else {
      getVideo(textInput);
      $('#text-input').val(null);
    }
  })
}

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function chooseAnimal(){
  $('#js-animals').on('click', '.animal-card', function(event){
    let animal= $(this).find('h4').text();
    $('.animal-page').addClass('hidden');
    $('.video-page').removeClass('hidden');
    getVideo(animal);
  });
} 

function generateAnimalCard(i){
  $('#js-animals').append( 
    `<div class="animal-card add">
      <h4>${animals[i].name}</h4>
      <img class="animal-pic" src="${animals[i].src}" alt="${animals[i].alt}">
    </div>`)
}

function getVideo(choice){
  const params= {
    key: apiKey,
    q: choice + " animal video kids education",
    part: "snippet",
    safeSearch: "strict",
    type: "video",
    maxResults: 50,
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
      if (responseJson.items.length === 0){
        alert(`We couldn't find you any animals. Try choosing something else`);
      }
      else {displayResults(responseJson);}
    })
    .catch(err => {
      if (err.message == "Cannot read property 'id' of undefined"){
        alert("We couldn't find any videos of that animal, try another!");
      } else{
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
      }
    });
}

function randomizeVideo(responseJson){
  var theVideo = responseJson["items"][Math.floor(Math.random()*responseJson["items"].length)];
  $('.video-container').append(`<iframe width="420" height="315"
    src="https://www.youtube.com/embed/${theVideo.id.videoId}?autoplay="1"">
    </iframe>`); 
}

function displayResults(responseJson){
  $('.text-search').addClass('hidden').removeClass('current-page');
  $('.video-page').removeClass('hidden');
  $('.video-container').empty();
  randomizeVideo(responseJson);
}

function seeAnother(animal){
  $('#js-same-animal-video').on('click', function(event){let animal = $('.video-animal-name').text();
    $('.video-container').empty();
      getVideo(animal);
  });
}


function chooseAnother(){
  $('#js-choose-another').on('click', function(event){
    event.preventDefault();
    $('#js-animals').empty();
    $('.video-container').empty();
    $('.video-page').addClass('hidden');
    $('.how-to-search').removeClass('hidden');
  })
}

function watchForm(){
  startFunction();
  incrementHistory();
  navHome();
  backButton();
  getChoice();
  searchHabitat();
  searchType();
  textSearch();
  seeAnother();
  chooseAnimal();
  chooseAnother();
};

$(watchForm);