'use strict'

const searchUrl= "https://www.googleapis.com/youtube/v3/search"

const apiKey= "AIzaSyB3hw6YJqtiQRs1X5pNsmqWisgoifViVKE";

function startFunction(){
  $('#js-start-button').on('click', function(){
    console.log("start clicked");
    $('.start-page').addClass('hidden');
    $('.how-to-search').removeClass('hidden');
    $('#js-animals').empty();
  })
};

function navHome(){
  $('.nav-home').on('click', function(event){
    $('.start-page').removeClass('hidden');
    $('.how-to-search').addClass('hidden');
    $('.search-by-habitat').addClass('hidden');
    $('.search-by-type').addClass('hidden');
    $('.animal-page').addClass('hidden');
    $('.text-search').addClass('hidden');
    $('.video-page').addClass('hidden');
    seeAnother("");
    console.log("seeAnother from navHome");
  })
}

function getChoice(){
  $('.main-page-choice').on('click', function(event){
    var page = $(event.target).attr('id');
    console.log('getChoice: ' + page);
    choosePath(page);
  })
}

function choosePath(page){
  console.log('choosePath: ' + page);
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
  console.log(rando);
  getVideo(rando);
  //seeAnother(rando);
  console.log("seeAnother from randomAnimal ran" + rando);
}

function textSearch(){
  $('.text-search').on('click', '#js-submit-text', function(event){
    event.preventDefault();
    const textInput= $('#text-input').val();
    console.log(textInput + "2");
    if (!textInput){
      alert("Please enter an animal");
    }else {
      $('.text-search').addClass('hidden');
      getVideo(textInput);
      $('#text-input').val(null);
      //seeAnother(textInput);
      console.log("seeAnother ran from textSearch " + textInput);
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
    console.log('chooseAnimal ran ' + animal);
    $('.animal-page').addClass('hidden');
    $('.video-page').removeClass('hidden');
    getVideo(animal);
    //seeAnother(animal);
    console.log("seeAnother ran from chooseAnimal" + animal)
  });
} 

function generateAnimalCard(i){
  $('#js-animals').append( 
    `<div class="animal-card">
      <h4>${animals[i].name}</h4>
      <img class="animal-pic" src="${animals[i].src}" alt="${animals[i].alt}">
    </div>`)
}

function getVideo(choice){
  console.log('getVideo ran');
  const params= {
    key: apiKey,
    q: choice + " animal video kids education",
    topicId: "kids",
    part: "snippet",
    safeSearch: "strict",
    type: "video",
    maxResults: 50,
  };
  const queryString = formatQueryParams(params);
  const url = searchUrl + '?' + queryString;
  console.log("search url is " + url);
  $('.video-animal-name').empty()
  $('.video-animal-name').append(choice);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
        console.log("theVideo is fetched");
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      if (responseJson.total == "0"){
        $('#js-error-message').text(`We couldn't find you any animals. Try choosing something else`);
      }
      else {displayResults(responseJson)};
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
  console.log("randomize ran");
  var theVideo = responseJson["items"][Math.floor(Math.random()*responseJson["items"].length)];
  $('.video-container').append(`<iframe width="420" height="315"
    src="https://www.youtube.com/embed/${theVideo.id.videoId}?autoplay="1"">
    </iframe>`); 
}

function displayResults(responseJson){
  console.log("displayResults ran");
  $('.video-page').removeClass('hidden');
  $('.video-container').empty();
  //console.log(responseJson["items"]);
  randomizeVideo(responseJson);
  //seeAnother("null");
  //console.log("seeAnother ran from displayResults");
}

function seeAnother(animal){
  $('#js-same-animal-video').on('click', function(event){let animal = $('.video-animal-name').text();
    console.log('seeAnother clicked, display ' + animal);
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
    seeAnother("");
    console.log("seeAnother ran from chooseAnother")
  })
}

function watchForm(){
  startFunction();
  navHome();
  getChoice();
  searchHabitat();
  searchType();
  textSearch();
  seeAnother();
  chooseAnimal();
  chooseAnother();
};

$(watchForm);