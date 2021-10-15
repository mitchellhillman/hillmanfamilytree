'use strict';

// eslint-disable-next-line no-undef
const { getName, getDates, addRelationships } = app;

const buildTree = (family, personId, stopId) => {
  const person = family.filter(({ id }) => id === personId)[0];

  const children = family.reduce((acc, curr) => {
    if (curr.father === person.id || curr.mother === person.id) {
      acc.push(curr);
    }
    return acc;
  }, []).sort((a, b) => {
    const aYear = Number(new Date(a.birthdate).getFullYear());
    const bYear = Number(new Date(b.birthdate).getFullYear());
    if (aYear < bYear) {
      return -1;
    }
    if (aYear > bYear) {
      return 1;
    }
    return 1;
  });

  return {
    ...person,
    children: children.map(child => buildTree(family, child.id))
  };
};

const colors = {
  line: '#777',
  girl: '#d742f5',
  boy: '#0c74a8'
};

const drawChart = (data, startId, stopId) => {
  const width = 1600;
  const tree = d => {
    const root = d3.hierarchy(d);
    root.dx = 100;
    root.dy = width / (root.height + 1);
    return d3.tree().nodeSize([root.dx, root.dy])(root);
  };

  const root = tree(buildTree(data, startId, stopId));

  let x0 = Infinity;
  let x1 = -x0;
  root.each(d => {
    if (d.x > x1) x1 = d.x;
    if (d.x < x0) x0 = d.x;
  });

  const svg = d3.create('svg')
    .attr('width', width)
    .attr('viewBox', [0, 0, width, x1 - x0 + root.dx * 2]);

  const g = svg.append('g')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 12)
    .attr('transform', `translate(${root.dy / 3}, ${root.dx - x0 })`);

  g.append('g')
    .attr('fill', 'none')
    .attr('stroke', colors.line)
    .attr('stroke-opacity', 1)
    .attr('stroke-width', 1)
    .selectAll('path')
    .data(root.links())
    .join('path')
    .attr('d', d3.linkHorizontal()
      .x(d => d.y)
      .y(d => d.x));

  const node = g.append('g')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-width', 3)
    .selectAll('g')
    .data(root.descendants())
    .join('g')
    .attr('transform', d => `translate(${d.y},${d.x})`);

  node.append('circle')
    .attr('fill', d => d.data.gender === 'f' ? colors.girl : colors.boy)
    .attr('r', 2.5);

  node.append('text')
    .attr('dy', '0.31em')
    .attr('x', -2)
    .attr('y', 10)
    .attr('text-anchor', 'start')
    .text(d => getName(d.data))
    .clone(true)
    .lower()
    .attr('stroke', 'white');

  node.append('text')
    .attr('dy', '0.31em')
    .attr('x', -2)
    .attr('y', 20)
    .attr('text-anchor', 'start')
    .text(d => getDates(d.data))
    .clone(true)
    .lower()
    .attr('stroke', 'white');

  const partners = root.descendants().reduce((acc, curr) => {
    if (curr.data.partners && curr.data.partners.length) {
      acc.push({ ...curr, data: curr.data.partners[0] });
    }
    return acc;
  }, []);

  // partner
  const partner = g.append('g')
    .attr('stroke-linejoin', 'round')
    .selectAll('g')
    .data(partners)
    .join('g')
    .attr('transform', d => `translate(${d.y},${d.x + 50})`);

  partner.append('line')
    .attr('stroke', colors.line)
    .attr('x1', -1)
    .attr('y1', -4)
    .attr('x2', -1)
    .attr('y2', -25);

  partner.append('line')
    .attr('stroke', colors.line)
    .attr('x1', 1)
    .attr('y1', -4)
    .attr('x2', 1)
    .attr('y2', -25);

  partner.append('circle')
    .attr('fill', d => d.data.gender === 'f' ? colors.girl : colors.boy)
    .attr('r', 2.5);

  partner.append('text')
    .attr('dy', '0.31em')
    .attr('x', -2)
    .attr('y', 10)
    .attr('text-anchor', 'start')
    .text(d => getName(d.data))
    .clone(true)
    .lower()
    .attr('stroke', 'white');

  partner.append('text')
    .attr('dy', '0.31em')
    .attr('x', -2)
    .attr('y', 20)
    .attr('text-anchor', 'start')
    .text(d => getDates(d.data))
    .clone(true)
    .lower()
    .attr('stroke', 'white');

  return svg.node();
};

const run = async () => {
  document.querySelector('#loading').innerHTML = 'Loading...';

  const personsData = await d3.csv('https://docs.google.com/spreadsheets/d/e/2PACX-1vQbWzAXR72DPLKrTIOAN4hyKeasXYV7Qukdu_wbgG5_tnSVUaQvorQ3lH8Xrs0j0uwR0WUhuGAuPrtY/pub?output=csv');
  const hillmanFamily = addRelationships(personsData);

  document.querySelector('#loading').innerHTML = '';

  document.querySelector('#hillman').appendChild(drawChart(hillmanFamily, '39', 'dick'));
  document.querySelector('#ralph').appendChild(drawChart(hillmanFamily, 'bettyanne'));
};

run();
