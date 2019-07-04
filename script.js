'use strict'

const searchUrl= "https://www.googleapis.com/youtube/v3/search"

const apiKey= "AIzaSyCjp8B1KBh8hGAWWlHt3QyzvUn8UIxLl7E";

function startFunction(){
  $('#js-start-button').on('click', function(){
    $('.start-page').addClass('hidden');
    $('.how-to-search').removeClass('hidden');
    $('#js-animals').empty();
  })
};

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
      if (animals[i].habitat == habitat){
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
    q: choice,
    channelId: "UCXVCgDuD_QCkI7gTKU7-tpg",
    part: "snippet",
    safeSearch: "strict",
    type: "video",
  };
  const queryString = formatQueryParams(params);
  const url = searchUrl + '?' + queryString;
    console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
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
    </iframe>`)
}

function displayResults(responseJson){
  //console.log(responseJson);
  $('.video-page').removeClass('hidden');
  $('.video-container').empty();
  //console.log(responseJson["items"]);
  randomizeVideo(responseJson);
}

function seeAnother(){
  $('#js-same-animal-video').on('click', function(event){
    let animal= $(this).find('h4').text();
    console.log('seeAnother ran ' + animal);
    $('.animal-page').addClass('hidden');
    $('.video-page').removeClass('hidden');
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
  getChoice();
  searchHabitat();
  searchType();
  textSearch();
  chooseAnimal();
  seeAnother();
  chooseAnother();
};

$(watchForm);