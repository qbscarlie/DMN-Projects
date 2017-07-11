// import $ from 'jquery';
import pym from 'pym.js';
// import './jquery.twentytwenty';
// import 'jquery.event.move';
/* global $: true*/

const pymChild = new pym.Child();

$(function(){
  $(".sliders").twentytwenty({
    default_offset_pct: 0.02,
    //before_label: 'Book',
    //after_label: 'Synopsis',
    no_overlay: true
  });
  pymChild.sendHeight();
});

let sliderWidth = $('.sliders').width();
$('.sliders').css('height', sliderWidth);

$(window).resize(() => {
  setTimeout(() => {
    sliderWidth = $('.sliders').width();
    $('.sliders').css('height', sliderWidth);
    pymChild.sendHeight();
  }, 250)
});

pymChild.sendHeight();
