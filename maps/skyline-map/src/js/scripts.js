/* global mapboxgl: true, console: true */
import $ from 'jquery';
import pym from 'pym.js';
import GeoJSON from './geojson';

const pymChild = new pym.Child();
const map = new mapboxgl.Map({
    container: 'map',
    style: 'https://maps.dallasnews.com/styles.json',
    center: [-96.8, 32.7849],
    zoom: 14,
  });

let slideNum = 1;

map.scrollZoom.disable();
var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-left');

function getData() {
$.getJSON('https://interactives.dallasnews.com/data-store/2017/2017-07-skyline-map.json', function(data){
  const skyline = GeoJSON.parse(data, {Point: ['lat', 'long']});
  drawMap(skyline);
  pymChild.sendHeight();
});
}

function drawMap(data) {
  map.addSource('skyline', {
    type: 'geojson',
    data: data,
  });

  map.addLayer({
        id: 'buildinglocations',
        type: "circle",
        source: 'skyline',
        paint: {
          'circle-radius': {
            stops: [[5, 4], [8, 6], [11, 8]],
          },
          'circle-color': {
            property: 'decade',
            type: 'categorical',
            stops: [
              [1960, '#08306b'],
              [1970, '#2171b5'],
              [1980, '#6baed6'],
              [2010, '#9ecae1']
            ],
          },
          'circle-opacity': 0.9,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#FFFFFF',
        },
        layout: {
          visibility: 'visible',
        },
  });

  map.on('click', (e) => {
    const features = map.queryRenderedFeatures(e.point, {});
    if (!features.length) {
      return;
    } else {
      const feature = features[0];

      let content = '';
      content += "<div class='mapcontent'>";
      content += `<img src="${feature.properties.images}" />`;
      content += "<div class='maptext'>";
      content += `<h6>${feature.properties.building}</h6>`;
      content += `<p class='address'>${feature.properties.location}</p>`;
      content += `<p><b>Height: </b>${feature.properties.height} `;
      content += `<p><b>Year constructed: </b>${feature.properties.year}</p></div></div>`;
      if (feature.properties.location != undefined) {
        const popup = new mapboxgl.Popup()
          .setLngLat(feature.geometry.coordinates)
          .setHTML(content);

        popup.addTo(map);
        const mapHeight = $('#map').height();
        map.flyTo({
          center: features[0].geometry.coordinates,
          offset: [0, -.5 * mapHeight],
        });
      }
    }
  });

  map.on('mousemove', (e) => {
    const features = map.queryRenderedFeatures(e.point, {});
    map.getCanvas().style.cursor = (features.length && features[0].properties.location !== undefined) ? 'pointer' : '';
  });

  goToSlide(slideNum);

}
map.on('load', () => getData());

let filters = ['==', 'decade', 1960];

const goToSlide = (num) => {
  const $captions = $('#captions li');

  if (num === 0 || num >= ($captions.length + 1)) {
    return;
  }

  $('.btn-previous').toggleClass('btn-disabled', num === 1);
  $('.btn-next').toggleClass('btn-disabled', num === $captions.length);

  $captions.addClass('hidden');

  const $next = $captions.eq(num - 1);

  $next.removeClass('hidden');

  $('#nav p').text(`${num} of ${$captions.length}`);

  slideNum = num;
  console.log(slideNum);

  const decades = [1960, 1970, 1980, 1990, 2010];

  filters = [];

  const filter = ['<=', 'decade', decades[(slideNum - 1)]];

  function btnText(decade) {
    if (decade === 1990) {
      return "1990s-2000s"
    } else {
      return decade + "s";
    }
  }

  $('#nextbtn').text(btnText(decades[slideNum])+" »");
  $('#prevbtn').text("« "+btnText(decades[slideNum-2]));

  map.setFilter('buildinglocations', filter);

  pymChild.sendHeight();
};

$('.btn-next').on('click', (evt) => {
  evt.preventDefault();
  goToSlide(slideNum + 1);
});

$('.btn-previous').on('click', (evt) => {
  evt.preventDefault();
  goToSlide(slideNum - 1);
});


pymChild.sendHeight();
