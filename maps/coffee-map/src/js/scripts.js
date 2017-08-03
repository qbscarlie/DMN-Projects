/* global mapboxgl: true, console: true */
import $ from 'jquery';
import pym from 'pym.js';
import GeoJSON from './geojson';

const width = document.getElementById("map").offsetWidth;
let zoom = 8.5;
console.log(width);
const pymChild = new pym.Child();
const map = new mapboxgl.Map({
    container: 'map',
    style: 'https://maps.dallasnews.com/styles.json',
    center: [-96.96, 32.98],
    zoom: setZoom(width),
  });

function setZoom(width) {
  if(width < 300) {
    zoom = 7.6;
  }
  else {
    zoom = 8.5;
  }
  return zoom
}

map.scrollZoom.disable();
map.addControl(new mapboxgl.NavigationControl());

function getData() {
$.getJSON('https://interactives.dallasnews.com/data-store/2017/2017-coffee-map.json', function(data){
  // console.log(data);
  const coffeeshops = GeoJSON.parse(data, {Point: ['lat', 'long']});
  drawMap(coffeeshops);
  pymChild.sendHeight();
});
}

function drawMap(data) {
  console.log(data);
  map.addSource('coffeeshops', {
    type: 'geojson',
    data: data,
  });
  map.addLayer({
        id: 'coffeeshops',
        type: "circle",
        source: 'coffeeshops',
        paint: {
          'circle-radius': {
            stops: [[5, 4], [8, 6], [11, 8]],
          },
          'circle-color': '#329ce8',
          'circle-opacity': 0.75,
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
    }
    const feature = features[0];

    if(feature.properties.address === undefined) {
      return;
    }

    let content = '';
    content += `<h6><a href="${feature.properties.website}" target="_blank">${feature.properties.name}</a></h6>`;
    content += `<p class='address'>${feature.properties.address}</p>`;
    if(feature.properties.phone) {
    content += `<p class ='address'>${feature.properties.phone}</p>`;
    }
    content += `<p><b>Hours: </b>${feature.properties.hours}</p>`;

    const popup = new mapboxgl.Popup()
      .setLngLat(feature.geometry.coordinates)
      .setHTML(content);

    popup.addTo(map);

    map.flyTo({ center: features[0].geometry.coordinates, zoom: 9 });
  });

  map.on('mousemove', (e) => {
    const features = map.queryRenderedFeatures(e.point, {});
    map.getCanvas().style.cursor = (features.length && features[0].properties.address !== undefined) ? 'pointer' : '';
  });
}
map.on('load', () => getData());


pymChild.sendHeight();
