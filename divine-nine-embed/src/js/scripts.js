/* global console:true, Handlebars: true, setTimeout: true */

import $ from 'jquery';
import pym from 'pym.js';

const pymChild = new pym.Child();

const divineTemplate = Handlebars.compile($("#divine-nine-template").html());
const divineNav = Handlebars.compile($("#divine-nine-nav").html());

//parses HTML using k as key and v as value for each record
function parseHTML(data) {
  $.each(data, (k,v) => {
    //console.log(v);
    const chapter = divineTemplate(v);
    $('#dn__content').append(chapter);

    const navEl = divineNav(v);
    $('#dn__navbar ul').append(navEl);
  });

//defaults to first chapter being viewable and active in nav
  $('#chapter-0').addClass('viewable');
  $('#dn__nav-el-0').addClass('dn--active');
  pymChild.sendHeight();

//times out for 1000ms while image loads to get height
  setTimeout(() => {
    pymChild.sendHeight();
  }, 1000);

  $('.dn__nav-el').on('click', function() {
    const target = $(this).attr('data-target'); //gets id # from data-target id in nav li and makes that target based on click
    $('.chaptercard').removeClass('viewable'); //removes viewable from all objects on click
    $(`#chapter-${target}`).addClass('viewable'); //and adds viewable to target

    $('.dn__nav-el').removeClass('dn--active'); //removes active element from nav on click
    $(`#dn__nav-el-${target}`).addClass('dn--active'); //and adds active to target

    pymChild.sendHeight();
  });

}

const dataURL = "//interactives.dallasnews.com/data-store/2017/2017-06-dallas-divine-nine.json";

$.ajax({
  dataType: "json",
  url: dataURL,
  success: parseHTML,
  cache: false
});


pymChild.sendHeight();
