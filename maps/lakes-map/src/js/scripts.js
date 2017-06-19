/* global mapboxgl: true, console: true */
import $ from 'jquery';
import pym from 'pym.js';
import GeoJSON from './geojson';

const pymChild = new pym.Child();
const map = new mapboxgl.Map({
    container: 'map',
    style: 'https://maps.dallasnews.com/styles.json',
    center: [-96.9, 33.04],
    zoom: 7.9999,
  });

map.scrollZoom.disable();
map.addControl(new mapboxgl.NavigationControl());

function getData() {
$.getJSON('https://interactives.dallasnews.com/data-store/2017/2017-06-dfw-lakes.json', function(data){
// console.log(data);
  const spooks = GeoJSON.parse(data, {Point: ['lat', 'long']});
  drawMap(spooks);
  pymChild.sendHeight();
});
}

function drawMap(data) {
//  console.log(data);
  map.addSource('lakes', {
    type: 'geojson',
    data: data,
  });
  map.addLayer({
        id: 'lakelocations',
        type: "circle",
        source: 'lakes',
        paint: {
          'circle-radius': {
            //stops: [[5, 4], [8, 6], [11, 8]],
            stops: [[7,6],[10,8],[13,10]],
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

    // if(feature.properties.address === undefined) {
    //   return;
    // }

    let content = '';
    content += `<h6>${feature.properties.name}</h6>`;
    //content += `<p class='address'>${feature.properties.address}</p>`;
    content += `<p>${feature.properties.activities}</p>`;

    const popup = new mapboxgl.Popup()
      .setLngLat(feature.geometry.coordinates)
      .setHTML(content);

    popup.addTo(map);

    map.flyTo({ center: features[0].geometry.coordinates, zoom: 9 });
  });

  map.on('mousemove', (e) => {
    const features = map.queryRenderedFeatures(e.point, {});
    //map.getCanvas().style.cursor = (features.length && features[0].properties.address !== undefined) ? 'pointer' : '';
    map.getCanvas().style.cursor = (features.length !== undefined) ? 'pointer' : '';
  });
}
map.on('load', () => getData());


pymChild.sendHeight();
