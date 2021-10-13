'use strict';

const getName = ({
  firstname, middlename, lastname, suffix, maidenname
}) => `${firstname || ''} ${middlename ? `${middlename.charAt(0)}. ` : ''} ${maidenname ? `(${maidenname}) ` : ''}${lastname || ''} ${suffix || ''}`;

const getDates = ({ birthdate, deathdate }) => {
  const birthYear = birthdate ? new Date(birthdate).getFullYear() : '';
  const deathYear = deathdate ? new Date(deathdate).getFullYear() : '';
  console.log('new Date(deathdate)', new Date(deathdate));
  return (birthdate || deathdate) && `${birthYear} - ${deathYear}`;
};

const buildHeritageTree = (family, personId) => {
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

  const children = [];
  if (father) children.push(buildHeritageTree(family, father.id));
  if (mother) children.push(buildHeritageTree(family, mother.id));
  return {
    ...person,
    children: (father || mother) && children
  };
};

const buildPatriarchTree = (family, personId) => {
  const withChildren = family.map(person => {
    const children = family.reduce((acc, curr) => {
      if (curr.father === person.id || curr.mother === person.id) {
        acc.push(curr);
      }
      return acc;
    }, []);

    return { ...person, children };
  });

  const person = withChildren.filter(({ id }) => id === personId)[0];

  const children = family.reduce((acc, curr) => {
    if (curr.father === person.id || curr.mother === person.id) {
      acc.push(curr);
    }
    return acc;
  }, []);
  return {
    ...person,
    children: children.map(child => buildPatriarchTree(family, child.id))
  };
};

const chart = (data) => {
  const width = 1500;

  const tree = d => {
    const root = d3.hierarchy(d);
    root.dx = 50;
    root.dy = width / (root.height + 1);
    return d3.tree().nodeSize([root.dx, root.dy])(root);
  };

  const root = tree(data);

  let x0 = Infinity;
  let x1 = -x0;
  root.each(d => {
    if (d.x > x1) x1 = d.x;
    if (d.x < x0) x0 = d.x;
  });

  const marginRightLeft = 80;

  const svg = d3.create('svg')
    .attr('viewBox', [0, 0, width + (marginRightLeft * 2), x1 - x0 + root.dx * 2]);

  const g = svg.append('g')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)
    .attr('transform', `translate(${marginRightLeft + (root.dy / 3)}, ${root.dx - x0 })`);

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
    .attr('fill', d => d.data.gender === 'f' ? '#d742f5' : '#0c74a8')
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

  return svg.node();
};

const run = async () => {
  const hillmanFamily = await d3.csv('data.csv');
  document.querySelector('#patriarch').appendChild(chart(buildPatriarchTree(hillmanFamily, '39')));
  document.querySelector('#heritage').appendChild(chart(buildHeritageTree(hillmanFamily, '200')));
};

run();
