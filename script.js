'use strict';

const run = async () => {
  const hillmanFamily = await d3.csv('data.csv');

  const getName = ({
    firstname, middlename, lastname, suffix
  }) => `${firstname || ''} ${middlename ? `${middlename.charAt(0)}. ` : ''} ${lastname || ''} ${suffix || ''}`;

  const buildPerson = (family, personId) => {
    const person = family.filter(({ id }) => id === personId)[0];
    const father = family.reduce((acc, curr) => {
      if (curr.id === person.father) {
        acc.push(curr);
      }
      return acc;
    }, [])[0];
    const mother = family.reduce((acc, curr) => {
      if (curr.id === person.mother) {
        acc.push(curr);
      }
      return acc;
    }, [])[0];

    return {
      ...person,
      children: [
        father ? buildPerson(family, father.id) : { },
        mother ? buildPerson(family, mother.id) : { }
      ]
    };
  };

  const width = 1000;

  const tree = d => {
    const root = d3.hierarchy(d);
    root.dx = 10;
    root.dy = width / (root.height + 1);
    return d3.tree().nodeSize([root.dx, root.dy])(root);
  };

  const chart = (data) => {
    const root = tree(data);

    let x0 = Infinity;
    let x1 = -x0;
    root.each(d => {
      if (d.x > x1) x1 = d.x;
      if (d.x < x0) x0 = d.x;
    });

    const svg = d3.create('svg')
      .attr('viewBox', [0, 0, width, x1 - x0 + root.dx * 2]);

    const g = svg.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('transform', `translate(${root.dy / 3},${root.dx - x0})`);

    g.append('g')
      .attr('fill', 'none')
      .attr('stroke', '#ddd')
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
      .attr('fill', '#ddd')
      .attr('r', 2.5);

    node.append('text')
      .attr('dy', '0.31em')
      .attr('x', d => d.children ? -6 : 6)
      .attr('text-anchor', d => d.children ? 'end' : 'start')
      .text(d => getName(d.data))
      .clone(true)
      .lower()
      .attr('stroke', 'white');

    return svg.node();
  };

  document.querySelector('body').appendChild(chart(buildPerson(hillmanFamily, '3')));
};

run();
