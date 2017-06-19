/* global mapboxgl: true, console: true */
import $ from 'jquery';
import pym from 'pym.js';
import GeoJSON from './geojson';

const pymChild = new pym.Child();
const map = new mapboxgl.Map({
    container: 'map',
    style: 'https://maps.dallasnews.com/styles.json',
    center: [-97.05, 32.67],
    zoom: 8.1,
  });

map.scrollZoom.disable();
map.addControl(new mapboxgl.NavigationControl());

function getData() {
$.getJSON('https://interactives.dallasnews.com/data-store/2017/2017-06-spooky-map.json', function(data){
// console.log(data);
  const spooks = GeoJSON.parse(data, {Point: ['lat', 'long']});
  drawMap(spooks);
  pymChild.sendHeight();
});
}

function drawMap(data) {
//  console.log(data);
  map.addSource('spooks', {
    type: 'geojson',
    data: data,
  });
  map.addLayer({
        id: 'spookslocations',
        type: "circle",
        source: 'spooks',
        paint: {
          'circle-radius': {
            stops: [[5, 4], [8, 6], [11, 8]],
          },
          'circle-color': 'black',
          'circle-opacity': 0.75,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#FFFFFF',
        },
        layout: {
          visibility: 'visible',
        },
  });
  //
  // map.addLayer({
  //       id: 'spookslocations',
  //       source: 'spooks',
  //       type: "symbol",
  //       properties: {
  //         icon-image: 'spook.png',
  //         icon-size: 1
  //         // icon: {
  //         //   iconUrl: 'spook.png',
  //         //   iconSize: [20,20],
  //         //   iconAchor: [10,10],
  //         //   popupAnchor:[0,-10]
  //         // }
  //       },
  //       layout: {
  //         visibility: 'visible',
  //       },
  // });

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
    content += `<p class='description'>${feature.properties.description}</p>`;

    const popup = new mapboxgl.Popup()
      .setLngLat(feature.geometry.coordinates)
      .setHTML(content);

    popup.addTo(map);

    map.flyTo({ center: features[0].geometry.coordinates });
  });

  map.on('mousemove', (e) => {
    const features = map.queryRenderedFeatures(e.point, {});
    map.getCanvas().style.cursor = (features.length && features[0].properties.address !== undefined) ? 'pointer' : '';
  });
}
map.on('load', () => getData());


pymChild.sendHeight();
