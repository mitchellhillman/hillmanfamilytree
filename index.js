'use strict';

// eslint-disable-next-line no-undef
const { addRelationships, drawChart } = app;

const run = async () => {
  document.querySelector('#loading').innerHTML = 'Loading...';

  const personsData = await d3.csv('https://docs.google.com/spreadsheets/d/e/2PACX-1vQbWzAXR72DPLKrTIOAN4hyKeasXYV7Qukdu_wbgG5_tnSVUaQvorQ3lH8Xrs0j0uwR0WUhuGAuPrtY/pub?output=csv');
  const hillmanFamily = addRelationships(personsData);

  document.querySelector('#loading').innerHTML = '';

  document.querySelector('#hillman').appendChild(drawChart(hillmanFamily, '39', 'dick'));
  document.querySelector('#ralph').appendChild(drawChart(hillmanFamily, 'bettyanne'));
};

run();
