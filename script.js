'use strict'

const url="https://www.googleapis.com/youtube/v3/search?part=snippet&safeSearch=strict"

function startFunction(){
  $('#js-start-button').click(function(){
    $('.start-page').addClass('hidden');
    $('.how-to-search').removeClass('hidden');
    getChoice();
  })
};

function choosePath(page){
  console.log('choosePath: ' + page);
  $('.how-to-search').addClass('hidden');
  if (page === 'habitat'){
    $('.search-by-habitat').removeClass('hidden');
    searchHabitat();
  } else if (page == 'type'){
    $('.search-by-type').removeClass('hidden');
  } else if(page == 'text-search'){
    $('.text-search').removeClass('hidden');
  } else {
    randomAnimal();
    showVideo();
  }
}

function getChoice(){
  $('.main-page-choice').click(function(event){
    var page = $(event.target).attr('id');
    console.log('getChoice: ' + page);
    choosePath(page);
  })
}

function randomAnimal(){
  console.log('randomAnimal ran');
}

function showVideo(){
  console.log('showVideo ran');
}
//function showVideo(); add queries to the url, fetch from API, get a random video, display

//function randomVideo(): randomize Json results

//function formatQueryParams();

//function chooseAnimal(); takes the animal they chose, puts it into the query parameter. reveal video page

//function searchType(); sets the const type, populates animal page. 

function generateAnimalCard(i){
  $('#js-animals').append( 
    `<div class="animal-card">
      <h4>${animals[i].name}</h4>
      <img class="animal-pic" src="${animals[i].img-src}" alt=${animals[i].img-alt}">
    </div>`)
}

function searchHabitat(){
   $('.second-page-choice').click(function(event){
    var habitat = $(event.target).attr('id');
    for (let i=0; i< animals.length; i++){
      if (animals[i].habitat == habitat){
        generateAnimalCard(i);
      }
    }
   })
}

function watchForm(){
  startFunction();
};

$(watchForm);