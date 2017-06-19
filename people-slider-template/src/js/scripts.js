/* global $:true, console:true, document: true, Handlebars:true, setTimeout:true */
// import $ from 'jquery';
import pym from 'pym.js';
// window.jQuery = $;

const pymChild = new pym.Child();

//compiles a Handlebars template for you to put data from sheet into
const sliderTemplate = Handlebars.compile($("#people-slider-template").html());
const sliderNav = Handlebars.compile($("#people-slider-nav").html());

//parses the HTML from the sheet into a key (k) for each record and value (v) for what each record contains
function parseHTML(data) {
  $.each(data, (k,v) => {
    //console.log(v);
    const person = sliderTemplate(v);
    $('#ps__content').append(person);

    const circle = sliderNav(v);
    $('#ps__nav ul').append(circle);
  });

  //defaults card-0 to being viewable
  $('#card-0').addClass('viewable');
  $('#ps__nav-el-0').addClass('ps--active');
  pymChild.sendHeight();

  //sets the timeout for a second so images can load to get accurate height
  setTimeout(() => {
    pymChild.sendHeight();
  }, 1000);

//function to click on dots to get to cards
$('.ps__nav-el').on('click', function() {
    const target = $(this).attr('data-target');
    $('.cardcontent').removeClass('viewable');
    $(`#card-${target}`).addClass('viewable');
    $('.ps__nav-el').removeClass('ps--active');
    $(`#ps__nav-el-${target}`).addClass('ps--active');
    pymChild.sendHeight();
  });

function rewind() {
  const length = $('.cardcontent').length;
  const currentCard = $('.viewable').index();
  const previousCard = currentCard - 1;
  $('.cardcontent').removeClass('viewable');
  $('.ps__nav-el').removeClass('ps--active');

  if(currentCard === 0) {
    $('.cardcontent').eq(length-1).addClass('viewable');
    $(`#ps__nav-el-${length-1}`).addClass('ps--active');
    pymChild.sendHeight();
  } else {
    $('.cardcontent').eq(previousCard).addClass('viewable');
    $(`#ps__nav-el-${previousCard}`).addClass('ps--active');
    pymChild.sendHeight();
  }
}

function fastForward() {
  const length = $('.cardcontent').length;
  const currentCard = $('.viewable').index();
  const nextCard = currentCard + 1;
  $('.cardcontent').removeClass('viewable');
  $('.ps__nav-el').removeClass('ps--active');

  if(currentCard === (length-1)) {
    $('#card-0').addClass('viewable');
    $('#ps__nav-el-0').addClass('ps--active');
    pymChild.sendHeight();
  } else {
    $('.cardcontent').eq(nextCard).addClass('viewable');
    $(`#ps__nav-el-${nextCard}`).addClass('ps--active');
    pymChild.sendHeight();
  }
}

//function when user clicks or swipes prev or next
$('.prev').on('click', () => rewind());
$('.next').on('click', () => fastForward());

$('.cardcontent').swipeleft(() => fastForward());
$('.cardcontent').swiperight(() => rewind());

//gets width of how many circles there are and centers them
function getWidth() {
const ulWidth = $('#ps__nav ul').width();
  const margin = -1*(ulWidth / 2);
  $('#ps__nav ul').css('margin-left', `${margin}px`)
}
getWidth();
}


//put data URL here after using GS3.
//make sure sheet has id, name, description, and img columns
const dataURL = "//interactives.dallasnews.com/data-store/2017/2017-06-people-slider.json";

$.ajax({
  dataType: "json",
  url: dataURL,
  success: parseHTML,
  cache: false
});
